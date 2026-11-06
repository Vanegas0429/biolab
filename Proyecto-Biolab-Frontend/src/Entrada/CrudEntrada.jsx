import { useState, useEffect, useMemo, useRef } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from 'react-data-table-component';
import EntradaForm from "./EntradaForm.jsx";
import Swal from "sweetalert2";

const CrudEntrada = ({ userRol }) => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [Entrada, setEntrada] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [alertaFiltro, setAlertaFiltro] = useState("todos");

  const [selectedRowForHistory, setSelectedRowForHistory] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const getVencimientoInfo = (fecStr) => {
    if (!fecStr) return { estado: 'sin_fecha', texto: 'N/A', badgeClass: 'bg-light text-muted' };
    const cleanDateStr = fecStr.split('T')[0];
    const parts = cleanDateStr.split('-');
    const expDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { estado: 'vencido', dias: diffDays, texto: cleanDateStr, badgeClass: 'bg-danger text-white' };
    } else if (diffDays <= 30) {
      return { estado: 'por_vencer', dias: diffDays, texto: cleanDateStr, badgeClass: 'bg-warning text-dark' };
    } else {
      return { estado: 'vigente', dias: diffDays, texto: cleanDateStr, badgeClass: 'text-dark' };
    }
  };

  const getStockInfo = (canExistente, uniMedida) => {
    const val = parseFloat(canExistente) || 0;
    if (val <= 0) {
      return { estado: 'agotado', texto: `0 ${uniMedida || ''}`, badge: 'Agotado', badgeClass: 'bg-danger text-white' };
    } else if (val <= 5) {
      return { estado: 'bajo', texto: `${val} ${uniMedida || ''}`, badge: 'Poco stock', badgeClass: 'bg-warning text-dark' };
    } else {
      return { estado: 'ok', texto: `${val} ${uniMedida || ''}`, badge: null, badgeClass: '' };
    }
  };

  const openHistoryModal = async (row) => {
    setSelectedRowForHistory(row);
    setHistoryLogs([]);
    setLoadingHistory(true);
    try {
      const response = await apiAxios.get(`/api/MovimientoReactivo/entrada/${row.Id_Entrada}`);
      setHistoryLogs(response.data ?? []);
    } catch (error) {
      console.error("Error cargando historial de movimientos:", error);
      Swal.fire("Error", "No se pudo cargar el historial de movimientos", "error");
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleEstado = async (row) => {
    const estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';

    const result = await Swal.fire({
      title: `¿${estadoNuevo === 'Activo' ? 'Activar' : 'Inactivar'} entrada?`,
      text: `Lote: ${row.Lote}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, ${estadoNuevo === 'Activo' ? 'activar' : 'inactivar'}`,
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/Entrada/${row.Id_Entrada}`, { ...row, Estado: estadoNuevo });
      getAllEntradas();
      Swal.fire({ title: 'Estado actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };

  useEffect(() => {
    getAllEntradas();

    // Auto-refresh cada 15 segundos
    const interval = setInterval(() => {
      getAllEntradas();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getAllEntradas = async () => {
    try {
      const response = await apiAxios.get('/api/Entrada');
      const list = response.data ?? [];
      list.sort((a, b) => Number(b.Id_Entrada || 0) - Number(a.Id_Entrada || 0));
      setEntrada(list);
    } catch (error) {
      console.error("Error cargando entradas:", error);
    }
  };

  const hideModal = () => { document.getElementById('closeModalBtn').click(); };

  const filteredEntradas = useMemo(() => {
    const text = filterText.toLowerCase();
    return Entrada.filter(e => {
      const matchText =
        e.Lote?.toLowerCase().includes(text) ||
        e.Reactivo?.Nom_reactivo?.toLowerCase().includes(text) ||
        e.Uni_Medida?.toLowerCase().includes(text);

      if (!matchText) return false;

      const vInfo = getVencimientoInfo(e.Fec_Vencimiento);
      const val = parseFloat(e.Can_Existente) || 0;

      if (alertaFiltro === 'porAgotarse') {
        // Excluir lotes que ya están vencidos
        return val <= 5 && vInfo.estado !== 'vencido';
      }
      if (alertaFiltro === 'porVencer') {
        return vInfo.estado === 'por_vencer';
      }
      if (alertaFiltro === 'vencidos') {
        return vInfo.estado === 'vencido';
      }

      return true;
    });
  }, [Entrada, filterText, alertaFiltro]);

  // Alertas generales de vencimiento y stock
  const alertasResumen = useMemo(() => {
    const vencidos = Entrada.filter(e => getVencimientoInfo(e.Fec_Vencimiento).estado === 'vencido');
    const porVencer = Entrada.filter(e => getVencimientoInfo(e.Fec_Vencimiento).estado === 'por_vencer');
    const porAgotarse = Entrada.filter(e => {
      const val = parseFloat(e.Can_Existente) || 0;
      const v = getVencimientoInfo(e.Fec_Vencimiento);
      return val <= 5 && v.estado !== 'vencido';
    });

    return {
      vencidos,
      porVencer,
      porAgotarse,
      totalAlertas: vencidos.length + porVencer.length + porAgotarse.length
    };
  }, [Entrada]);

  // Alerta interactiva tipo Toast para lotes que están por vencerse
  const hasNotifiedVencimientoRef = useRef(false);
  useEffect(() => {
    if (alertasResumen.porVencer.length > 0 && !hasNotifiedVencimientoRef.current) {
      hasNotifiedVencimientoRef.current = true;
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: `¡Atención! Hay ${alertasResumen.porVencer.length} lote(s) que están por vencerse`,
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: true
      });
    }
  }, [alertasResumen.porVencer.length]);

  return (
    <div className="container-fluid py-4 fade-in">
      {/* HEADER */}
      <div className="row mb-4 align-items-center g-3">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '50px', height: '50px' }}>
              <i className="fa-solid fa-box-open fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Entradas de Reactivos</h2>
              <p className="text-muted mb-0 small">Control de entradas, lotes y fechas de vencimiento de reactivos.</p>
            </div>
          </div>
        </div>
        <div className="col-md-auto d-flex gap-2 flex-wrap">
          <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border" style={{ width: '300px' }}>
            <span className="input-group-text border-0 bg-transparent ps-3">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 py-2 shadow-none bg-transparent"
              placeholder="Buscar entrada..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalEntrada"
            onClick={() => setRowToEdit(null)}
          >
            <i className="fa-solid fa-plus me-2"></i>Agregar Entrada Reactivo
          </button>
        </div>
      </div>

      {/* BANNER DE ALERTAS */}
      <div className="alert alert-warning border-0 shadow-sm rounded-4 mb-4 p-3 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-warning text-dark rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style={{ width: '42px', height: '42px' }}>
            <i className="fa-solid fa-triangle-exclamation fs-5"></i>
          </div>
          <div>
            <h6 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2 flex-wrap">
              <span>Alertas de Lotes de Reactivos</span>
              {alertasResumen.porVencer.length > 0 && (
                <span className="badge bg-warning text-dark border border-warning-subtle rounded-pill fw-semibold shadow-sm">
                  <i className="fa-solid fa-bell me-1"></i>
                  {alertasResumen.porVencer.length} por vencerse
                </span>
              )}
            </h6>
            <p className="text-muted small mb-0">
              Selecciona una opción para filtrar los lotes en la tabla:
            </p>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {/* BOTÓN 1: Lotes por agotarse (no vencidos) */}
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold shadow-sm transition-all d-flex align-items-center gap-2 ${
              alertaFiltro === 'porAgotarse'
                ? 'btn-warning text-dark border-warning'
                : 'btn-outline-dark bg-white'
            }`}
            style={{
              transform: alertaFiltro === 'porAgotarse' ? 'scale(1.04)' : 'scale(1)',
              boxShadow: alertaFiltro === 'porAgotarse' ? '0 0 0 3px rgba(255,193,7,0.4)' : undefined
            }}
            onClick={() => {
              setFilterText('');
              setAlertaFiltro(prev => prev === 'porAgotarse' ? 'todos' : 'porAgotarse');
            }}
            title="Filtrar lotes con stock bajo o agotado que no estén vencidos"
          >
            <i className="fa-solid fa-battery-quarter"></i>
            <span>Lotes por agotarse ({alertasResumen.porAgotarse.length})</span>
            {alertaFiltro === 'porAgotarse' && <i className="fa-solid fa-check ms-1"></i>}
          </button>

          {/* BOTÓN 2: Lotes por vencerse */}
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold shadow-sm transition-all d-flex align-items-center gap-2 ${
              alertaFiltro === 'porVencer'
                ? 'btn-warning text-dark border-warning'
                : 'btn-outline-warning text-dark bg-white'
            }`}
            style={{
              transform: alertaFiltro === 'porVencer' ? 'scale(1.04)' : 'scale(1)',
              boxShadow: alertaFiltro === 'porVencer' ? '0 0 0 3px rgba(255,193,7,0.4)' : undefined
            }}
            onClick={() => {
              setFilterText('');
              setAlertaFiltro(prev => prev === 'porVencer' ? 'todos' : 'porVencer');
            }}
            title="Filtrar lotes que están próximos a vencerse (&le; 30 días)"
          >
            <i className="fa-solid fa-clock"></i>
            <span>Lotes por vencerse ({alertasResumen.porVencer.length})</span>
            {alertaFiltro === 'porVencer' && <i className="fa-solid fa-check ms-1"></i>}
          </button>

          {/* BOTÓN 3: Lotes vencidos */}
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold shadow-sm transition-all d-flex align-items-center gap-2 ${
              alertaFiltro === 'vencidos'
                ? 'btn-danger text-white'
                : 'btn-outline-danger bg-white'
            }`}
            style={{
              transform: alertaFiltro === 'vencidos' ? 'scale(1.04)' : 'scale(1)',
              boxShadow: alertaFiltro === 'vencidos' ? '0 0 0 3px rgba(220,53,69,0.3)' : undefined
            }}
            onClick={() => {
              setFilterText('');
              setAlertaFiltro(prev => prev === 'vencidos' ? 'todos' : 'vencidos');
            }}
            title="Filtrar lotes que ya están vencidos"
          >
            <i className="fa-solid fa-ban"></i>
            <span>Lotes vencidos ({alertasResumen.vencidos.length})</span>
            {alertaFiltro === 'vencidos' && <i className="fa-solid fa-check ms-1"></i>}
          </button>
        </div>
      </div>

      {/* AVISO ESPECIAL DE ALERTA PARA LOTES POR VENCERSE */}
      {alertasResumen.porVencer.length > 0 && alertaFiltro === 'todos' && (
        <div className="alert alert-warning py-2 px-3 rounded-4 d-flex align-items-center justify-content-between mb-3 shadow-sm border border-warning">
          <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-bell text-warning fs-5"></i>
            <span className="small">
              <strong>¡Atención!</strong> Hay <strong>{alertasResumen.porVencer.length} lote(s)</strong> que están por vencerse en los próximos 30 días.
            </span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-dark rounded-pill py-1 px-3 fw-semibold small"
            onClick={() => {
              setFilterText('');
              setAlertaFiltro('porVencer');
            }}
          >
            <i className="fa-solid fa-eye me-1"></i>Ver lotes por vencerse
          </button>
        </div>
      )}

      {/* BARRA DE FILTRO ACTIVO */}
      {alertaFiltro !== 'todos' && (
        <div className="alert alert-info py-2 px-3 rounded-pill d-flex align-items-center justify-content-between mb-3 shadow-sm border-0">
          <span className="small">
            <i className="fa-solid fa-filter me-2 text-primary"></i>
            Filtrando tabla por:{' '}
            <strong className="text-uppercase">
              {alertaFiltro === 'porAgotarse'
                ? 'Lotes por agotarse'
                : alertaFiltro === 'porVencer'
                ? 'Lotes por vencerse'
                : 'Lotes vencidos'}
            </strong>{' '}
            ({filteredEntradas.length} registro(s) mostrado(s))
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-dark rounded-pill py-0 px-3 fw-bold small"
            onClick={() => {
              setAlertaFiltro('todos');
              setFilterText('');
            }}
          >
            <i className="fa-solid fa-xmark me-1"></i>Mostrar todos
          </button>
        </div>
      )}

      {/* TABLA */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <div className="table-responsive-custom">
          <DataTable
            columns={[
              {
                name: 'REACTIVO',
                selector: row => row?.Reactivo?.Nom_reactivo ?? 'N/A',
                sortable: true,
                width: '260px',
                cell: row => <span className="fw-bold text-dark">{row?.Reactivo?.Nom_reactivo ?? 'N/A'}</span>
              },
              { name: 'LOTE', selector: row => row?.Lote ?? 'N/A', sortable: true, width: '130px' },
              {
                name: 'CANT. INICIAL',
                selector: row => `${row?.Can_Inicial ?? 0} ${row?.Uni_Medida ?? ''}`,
                sortable: true,
                width: '140px',
                center: "true",
                cell: row => <span className="fw-normal">{row?.Can_Inicial ?? 0} {row?.Uni_Medida ?? ''}</span>
              },
              {
                name: 'CANT. EXISTENTE',
                selector: row => parseFloat(row?.Can_Existente) || 0,
                sortable: true,
                width: '190px',
                center: "true",
                cell: row => {
                  const val = parseFloat(row?.Can_Existente) || 0;
                  const isAgotado = val <= 0;
                  const isBajo = val > 0 && val <= 5;

                  let textColor = '#059669'; // verde normal
                  let pillBg = 'bg-success-subtle text-success border border-success';
                  if (isAgotado) {
                    textColor = '#dc2626'; // rojo
                    pillBg = 'bg-danger text-white';
                  } else if (isBajo) {
                    textColor = '#d97706'; // naranja/amarillo
                    pillBg = 'bg-warning text-dark';
                  }

                  return (
                    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap py-1">
                      <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>
                        {row?.Can_Existente ?? 0} {row?.Uni_Medida ?? ''}
                      </span>
                      {isAgotado && (
                        <span className={`badge rounded-pill px-2 py-1 ${pillBg}`} style={{ fontSize: '0.72rem' }}>
                          <i className="fa-solid fa-ban me-1"></i>Agotado
                        </span>
                      )}
                      {isBajo && (
                        <span className={`badge rounded-pill px-2 py-1 ${pillBg}`} style={{ fontSize: '0.72rem' }}>
                          <i className="fa-solid fa-triangle-exclamation me-1"></i>Poco stock
                        </span>
                      )}
                    </div>
                  );
                }
              },
              {
                name: 'F. VENCIMIENTO',
                selector: row => row.Fec_Vencimiento || '',
                sortable: true,
                width: '210px',
                center: "true",
                cell: row => {
                  const info = getVencimientoInfo(row.Fec_Vencimiento);
                  if (info.estado === 'vencido') {
                    return (
                      <div className="p-1 px-2 rounded-3 border border-danger text-danger bg-danger-subtle fw-bold d-inline-block text-center" style={{ fontSize: '0.82rem' }}>
                        <i className="fa-solid fa-triangle-exclamation me-1"></i>
                        {info.texto}
                        <small className="d-block text-danger fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>¡VENCIDO!</small>
                      </div>
                    );
                  } else if (info.estado === 'por_vencer') {
                    return (
                      <div className="p-1 px-2 rounded-3 border border-warning text-dark bg-warning-subtle fw-bold d-inline-block text-center shadow-sm" style={{ fontSize: '0.82rem' }}>
                        <i className="fa-solid fa-bell me-1 text-warning"></i>
                        {info.texto}
                        <small className="d-block text-warning-emphasis fw-bold" style={{ fontSize: '0.68rem' }}>⚠️ ¡Por vencerse ({info.dias}d)!</small>
                      </div>
                    );
                  }
                  return <span className="text-secondary fw-medium">{info.texto}</span>;
                }
              },
              {
                name: 'ESTADO',
                center: "true",
                width: '130px',
                cell: row => (
                  <span
                    className={`status-badge ${row.Estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleEstado(row)}
                    title="Clic para cambiar estado"
                  >
                    {row.Estado}
                  </span>
                )
              },
              {
                name: 'ACCIONES',
                center: "true",
                width: '130px',
                cell: row => (
                  <div className="d-flex gap-1 justify-content-center">
                    <button
                      className="btn-action btn-action-edit"
                      onClick={() => setRowToEdit(row)}
                      data-bs-toggle="modal"
                      data-bs-target="#modalEntrada"
                      title="Editar"
                    >
                      <i className="fa-solid fa-pencil"></i>
                    </button>
                    <button
                      className="btn-action btn-action-view"
                      onClick={() => openHistoryModal(row)}
                      data-bs-toggle="modal"
                      data-bs-target="#modalHistorial"
                      title="Ver Historial"
                    >
                      <i className="fa-solid fa-clock-rotate-left"></i>
                    </button>
                  </div>
                )
              }
            ]}
            data={filteredEntradas}
            keyField="Id_Entrada"
            pagination
            highlightOnHover
            persistTableHead
            conditionalRowStyles={[
              { when: row => row.Estado === 'Inactivo', style: { opacity: 0.5 } }
            ]}
            noDataComponent={
              <div className="text-center py-5 text-muted">
                <i className="fa-solid fa-box-open fs-1 mb-3 d-block opacity-25"></i>
                No se encontraron entradas.
              </div>
            }
          />
        </div>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="modalEntrada" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="modal-header bg-primary text-white py-3 px-4">
              <h5 className="modal-title fw-bold">
                <i className="fa-solid fa-box-open me-2"></i>
                {rowToEdit ? 'Editar Entrada' : 'Agregar Nueva Entrada'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                id="closeModalBtn"
              ></button>
            </div>
            <div className="modal-body p-4">
              <EntradaForm
                hideModal={hideModal}
                refreshList={getAllEntradas}
                rowToEdit={rowToEdit}
                userRol={userRol}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE HISTORIAL */}
      <div className="modal fade" id="modalHistorial" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="modal-header bg-primary text-white py-3 px-4">
              <h5 className="modal-title fw-bold">
                <i className="fa-solid fa-clock-rotate-left me-2"></i>
                Historial de Movimientos - Lote: {selectedRowForHistory?.Lote ?? 'N/A'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                id="closeHistoryModalBtn"
              ></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <p className="mb-1"><strong>Reactivo:</strong> {selectedRowForHistory?.Reactivo?.Nom_reactivo ?? 'N/A'}</p>
                <p className="mb-1"><strong>Cantidad Inicial:</strong> {selectedRowForHistory?.Can_Inicial ?? 0} {selectedRowForHistory?.Uni_Medida ?? ''}</p>
                <p className="mb-0"><strong>Cantidad Existente:</strong> <span className="badge bg-primary">{selectedRowForHistory?.Can_Existente ?? 0} {selectedRowForHistory?.Uni_Medida ?? ''}</span></p>
              </div>

              {loadingHistory ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : historyLogs.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fa-solid fa-folder-open fs-2 mb-2 d-block opacity-25"></i>
                  No se encontraron movimientos registrados para esta entrada.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Fecha / Hora</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Detalle</th>
                        <th>Reserva</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyLogs.map((log) => {
                        let badgeClass = "bg-secondary";
                        if (log.Tipo === 'Entrada') badgeClass = "bg-success";
                        else if (log.Tipo === 'Salida') badgeClass = "bg-danger";
                        else if (log.Tipo === 'Devolución') badgeClass = "bg-info";
                        else if (log.Tipo === 'Ajuste') badgeClass = "bg-warning";

                        return (
                          <tr key={log.Id_Movimiento}>
                            <td className="small">{new Date(log.Fecha).toLocaleString()}</td>
                            <td>
                              <span className={`badge ${badgeClass}`}>{log.Tipo}</span>
                            </td>
                            <td className="fw-bold text-nowrap">
                              {log.Tipo === 'Salida' ? '-' : '+'}{log.Cantidad} {selectedRowForHistory?.Uni_Medida ?? ''}
                            </td>
                            <td>{log.Detalle}</td>
                            <td>
                              {log.Reserva ? (
                                <span className="text-primary small fw-semibold">
                                  Reserva #{log.Reserva.Id_Reserva} ({log.Reserva.Nom_Solicitante})
                                </span>
                              ) : (
                                <span className="text-muted small">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div></div>
  );
};

export default CrudEntrada;
