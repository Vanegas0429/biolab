import { useState, useEffect, useMemo } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from 'react-data-table-component';
import EntradaMaterialForm from "./EntradaMaterialForm.jsx";
import Swal from "sweetalert2";
import { safeCloseModal } from "../utils/modalHelper.js";

const CrudEntradaMaterial = ({ userRol }) => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [entradas, setEntradas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [alertaFiltro, setAlertaFiltro] = useState("todos");
  const [loading, setLoading] = useState(true);

  const [selectedRowForHistory, setSelectedRowForHistory] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const openHistoryModal = async (row) => {
    setSelectedRowForHistory(row);
    setHistoryLogs([]);
    setLoadingHistory(true);
    try {
      const response = await apiAxios.get(`/api/MovimientoMaterial/entrada/${row.Id_Entrada_Material}`);
      setHistoryLogs(response.data ?? []);
    } catch (error) {
      console.error("Error cargando historial de movimientos de material:", error);
      Swal.fire("Error", "No se pudo cargar el historial de movimientos", "error");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    getAllEntradasMaterial();

    // Auto-refresh silencioso en tiempo real (cada 8 segundos) sin interrumpir modales
    const interval = setInterval(() => {
      if (document.body.classList.contains('modal-open') || document.querySelector('.modal.show') || document.querySelector('.swal2-container')) {
        return;
      }
      getAllEntradasMaterial();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getAllEntradasMaterial = async () => {
    try {
      const response = await apiAxios.get('/api/EntradaMaterial');
      const list = response.data ?? [];
      list.sort((a, b) => Number(b.Id_Entrada_Material || 0) - Number(a.Id_Entrada_Material || 0));
      setEntradas(list);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando entradas de material:", error);
      setLoading(false);
    }
  };

  const toggleEstado = async (row) => {
    const estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';
    const isActivar = estadoNuevo === 'Activo';

    const result = await Swal.fire({
      title: isActivar ? '¿Activar entrada de material?' : '¿Desactivar entrada de material?',
      html: `
        <p class="mb-2">¿Deseas cambiar el estado de la entrada del material <strong>"${row.Material?.Nom_Material || 'Material'}"</strong> a <span class="badge ${isActivar ? 'bg-success' : 'bg-danger'}">${estadoNuevo}</span>?</p>
        <small class="text-muted d-block mt-2">${isActivar ? '✅ Este stock de material volverá a estar habilitado para inventario y actividades.' : '⚠️ Este lote de entrada quedará deshabilitado temporalmente.'}</small>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: isActivar ? '#059669' : '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: isActivar ? '<i class="fa-solid fa-check me-1"></i>Sí, activar' : '<i class="fa-solid fa-ban me-1"></i>Sí, desactivar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: true,
      allowEscapeKey: true
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/EntradaMaterial/${row.Id_Entrada_Material}`, { ...row, Estado: estadoNuevo });
      getAllEntradasMaterial();
      Swal.fire({
        title: isActivar ? '¡Entrada activada!' : '¡Entrada desactivada!',
        text: `La entrada de material #${row.Id_Entrada_Material} ahora se encuentra ${estadoNuevo}.`,
        icon: 'success',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado de la entrada.', 'error');
    }
  };

  const hideModal = () => {
    safeCloseModal('exampleModal');
  };

  const onViewDetails = (row) => {
    const isDesechable = (row.Material?.clasificacion || 'Desechable').toLowerCase() === 'desechable';
    const val = parseFloat(row.Can_Existente ?? row.Can_Inicial) || 0;

    Swal.fire({
      title: `<div class="d-flex align-items-center justify-content-between pb-2 border-bottom w-100 px-2">
        <span class="fw-bold text-primary fs-4 text-start me-3"><i class="fa-solid fa-boxes-packing me-2"></i>Detalle de Entrada</span>
        <span class="status-badge ${row.Estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'} px-3 py-2 rounded-pill fs-6">${row.Estado || 'N/A'}</span>
      </div>`,
      width: '640px',
      showConfirmButton: false,
      showCloseButton: true,
      html: `
        <div class="text-start mt-3 px-1" style="font-size: 0.95rem;">
          <div class="p-3 bg-light rounded-4 border mb-3">
            <small class="text-muted d-block fw-semibold"><i class="fa-solid fa-boxes-stacked me-2 text-primary"></i>MATERIAL</small>
            <h5 class="fw-bold mb-0 text-dark">${row.Material?.Nom_Material || `Material #${row.Id_Material}`}</h5>
          </div>

          <div class="row g-3 bg-light p-3 rounded-4 mx-0 shadow-sm border mb-3">
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-layer-group me-2 text-primary"></i>CLASIFICACIÓN</p>
              <span class="badge ${row.Material?.clasificacion === 'Reutilizable' ? 'bg-info-subtle text-info-emphasis border border-info' : 'bg-secondary-subtle text-secondary-emphasis border border-secondary'} rounded-pill px-3 py-2 fw-semibold">
                ${row.Material?.clasificacion || 'Desechable'}
              </span>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-arrow-down-wide-short me-2 text-primary"></i>CANT. INGRESADA</p>
              <h6 class="fw-bold mb-0 text-dark">${row.Can_Inicial ?? 0}</h6>
            </div>
            <div class="col-12 mt-2 pt-2 border-top">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-boxes-stacked me-2 text-primary"></i>CANT. EXISTENTE</p>
              <h5 class="fw-bold mb-0 text-primary">${val}</h5>
            </div>
          </div>
        </div>
      `,
      customClass: {
        popup: 'rounded-4 border-0 shadow-lg'
      }
    });
  };

  const filteredEntradas = useMemo(() => {
    const text = filterText.toLowerCase();
    return entradas.filter(e => {
      const nom = e.Material?.Nom_Material?.toLowerCase() || '';
      const clas = e.Material?.clasificacion?.toLowerCase() || '';
      const matchesText = nom.includes(text) || clas.includes(text);

      if (!matchesText) return false;

      const isDesechable = (e.Material?.clasificacion || 'Desechable').toLowerCase() === 'desechable';
      const val = parseFloat(e.Can_Existente ?? e.Can_Inicial) || 0;

      if (alertaFiltro === 'porAgotarse') {
        return isDesechable && val <= 10;
      }

      return true;
    });
  }, [entradas, filterText, alertaFiltro]);

  // Alertas para materiales desechables con stock bajo o agotado
  const alertasResumen = useMemo(() => {
    const activas = entradas.filter(e => e.Estado === 'Activo');
    const porAgotarse = activas.filter(e => {
      const isDesechable = (e.Material?.clasificacion || 'Desechable').toLowerCase() === 'desechable';
      const val = parseFloat(e.Can_Existente ?? e.Can_Inicial) || 0;
      return isDesechable && val <= 10;
    });

    return {
      porAgotarse,
      totalAlertas: porAgotarse.length
    };
  }, [entradas]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4 fade-in">
      {/* HEADER */}
      <div className="row mb-4 align-items-center g-3">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '50px', height: '50px' }}>
              <i className="fa-solid fa-boxes-stacked fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Entradas de Materiales</h2>
              <p className="text-muted mb-0 small">Registro y seguimiento de compras e ingresos de materiales.</p>
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
              placeholder="Buscar entrada de material..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalEntradaMaterial"
            onClick={() => setRowToEdit(null)}
          >
            <i className="fa-solid fa-plus me-2"></i>Nueva Entrada Material
          </button>
        </div>
      </div>

      {/* BANNER DE ALERTAS PARA MATERIALES DESECHABLES */}
      {alertasResumen.totalAlertas > 0 && (
        <div className="alert alert-warning border-0 shadow-sm rounded-4 p-3 mb-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px' }}>
              <i className="fa-solid fa-triangle-exclamation fs-5"></i>
            </div>
            <div>
              <h6 className="fw-bold mb-1 text-dark">Atención en Materiales Desechables</h6>
              <p className="text-muted small mb-0">
                Selecciona la opción para filtrar materiales en la tabla:
              </p>
            </div>
          </div>

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
            title="Filtrar materiales por agotarse o agotados"
          >
            <i className="fa-solid fa-battery-quarter"></i>
            <span>Materiales por agotarse ({alertasResumen.porAgotarse.length})</span>
            {alertaFiltro === 'porAgotarse' && <i className="fa-solid fa-check ms-1"></i>}
          </button>
        </div>
      )}

      {/* BARRA DE FILTRO ACTIVO */}
      {alertaFiltro !== 'todos' && (
        <div className="alert alert-info py-2 px-3 rounded-pill d-flex align-items-center justify-content-between mb-3 shadow-sm border-0">
          <span className="small">
            <i className="fa-solid fa-filter me-2 text-primary"></i>
            Filtrando tabla por: <strong className="text-uppercase">Materiales por agotarse</strong> ({filteredEntradas.length} material(es) mostrado(s))
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

      {/* TABLA DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={[
            {
              name: 'MATERIAL',
              sortable: true,
              grow: 2,
              minWidth: '240px',
              cell: row => (
                <div className="py-2">
                  <div className="fw-bold text-dark">{row.Material?.Nom_Material || `Material #${row.Id_Material}`}</div>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Ingresado: {row.Can_Inicial ?? 0}
                  </small>
                </div>
              )
            },
            {
              name: 'CLASIFICACIÓN',
              selector: row => row.Material?.clasificacion || 'Desechable',
              sortable: true,
              grow: 1,
              minWidth: '160px',
              center: true,
              cell: row => (
                <span className={`badge ${row.Material?.clasificacion === 'Reutilizable' ? 'bg-info text-dark' : 'bg-secondary'} rounded-pill px-3 py-2 fw-medium`}>
                  {row.Material?.clasificacion || 'Desechable'}
                </span>
              )
            },
            {
              name: 'CANT. EXISTENTE',
              selector: row => parseFloat(row.Can_Existente ?? row.Can_Inicial) || 0,
              sortable: true,
              grow: 1,
              minWidth: '160px',
              center: true,
              cell: row => {
                const val = parseFloat(row.Can_Existente ?? row.Can_Inicial) || 0;
                const isDesechable = (row.Material?.clasificacion || 'Desechable').toLowerCase() === 'desechable';
                
                if (!isDesechable) {
                  return <span className="fw-medium text-dark">{val}</span>;
                }

                const isAgotado = val <= 0;
                const isBajo = val > 0 && val <= 10;

                let textColor = '#059669'; // verde normal
                let badgeClass = '';
                if (isAgotado) {
                  textColor = '#dc2626'; // rojo
                  badgeClass = 'badge bg-danger text-white rounded-pill px-2 py-0';
                } else if (isBajo) {
                  textColor = '#d97706'; // amarillo/naranja
                  badgeClass = 'badge bg-warning text-dark rounded-pill px-2 py-0';
                }

                return (
                  <div className="d-flex align-items-center justify-content-center gap-1 flex-wrap py-1">
                    <span className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>
                      {val}
                    </span>
                    {isAgotado && (
                      <span className={badgeClass} style={{ fontSize: '0.68rem' }}>
                        Agotado
                      </span>
                    )}
                    {isBajo && (
                      <span className={badgeClass} style={{ fontSize: '0.68rem' }}>
                        Bajo
                      </span>
                    )}
                  </div>
                );
              }
            },
            {
              name: 'ESTADO',
              sortable: true,
              center: true,
              width: '140px',
              cell: row => (
                <span
                  className={`status-badge ${row.Estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEstado(row);
                  }}
                  title="Clic para cambiar estado"
                >
                  {row.Estado}
                </span>
              )
            },
            {
              name: 'ACCIONES',
              center: true,
              width: '150px',
              cell: row => (
                <div className="d-flex gap-1 justify-content-center">
                  <button
                    type="button"
                    className="btn-action btn-action-view"
                    onClick={() => onViewDetails(row)}
                    title="Ver detalles"
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>
                  <button
                    className="btn-action btn-action-edit"
                    onClick={() => setRowToEdit(row)}
                    data-bs-toggle="modal"
                    data-bs-target="#modalEntradaMaterial"
                    title="Editar"
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                  <button
                    className="btn-action"
                    style={{ background: 'rgba(100,116,139,0.15)', color: '#475569' }}
                    onClick={() => openHistoryModal(row)}
                    data-bs-toggle="modal"
                    data-bs-target="#modalHistorialMaterial"
                    title="Ver Historial"
                  >
                    <i className="fa-solid fa-clock-rotate-left"></i>
                  </button>
                </div>
              )
            }
          ]}
          data={filteredEntradas}
          keyField="Id_Entrada_Material"
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent={
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-folder-open fs-1 mb-3 d-block opacity-25"></i>
              No se encontraron entradas de materiales.
            </div>
          }
          conditionalRowStyles={[
            {
              when: row => row.Estado === "Inactivo",
              style: {
                backgroundColor: "#f8fafc",
                color: "#94a3b8",
                opacity: 0.8
              }
            }
          ]}
        />
      </div>

      {/* Modal formulario */}
      <div className="modal fade" id="modalEntradaMaterial" tabIndex="-1">
        <div className="modal-dialog modal-lg border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                {rowToEdit ? "Editar Entrada de Material" : "Agregar Nueva Entrada de Material"}
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" id="closeModalBtnEntradaMat"></button>
            </div>
            <div className="modal-body p-4">
              <EntradaMaterialForm
                hideModal={hideModal}
                refreshList={getAllEntradasMaterial}
                rowToEdit={rowToEdit}
                userRol={userRol}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE HISTORIAL DE MATERIAL */}
      <div className="modal fade" id="modalHistorialMaterial" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="modal-header bg-primary text-white py-3 px-4">
              <h5 className="modal-title fw-bold">
                <i className="fa-solid fa-clock-rotate-left me-2"></i>
                Historial de Movimientos - Material: {selectedRowForHistory?.Material?.Nom_Material ?? 'N/A'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                id="closeHistoryMatModalBtn"
              ></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3 bg-light p-3 rounded-3">
                <p className="mb-1"><strong>Material:</strong> {selectedRowForHistory?.Material?.Nom_Material ?? 'N/A'} ({selectedRowForHistory?.Material?.clasificacion || 'Desechable'})</p>
                <p className="mb-1"><strong>Cantidad Inicial:</strong> {selectedRowForHistory?.Can_Inicial ?? 0}</p>
                <p className="mb-0"><strong>Cantidad Existente Actual:</strong> <span className="badge bg-success fs-6">{selectedRowForHistory?.Can_Existente ?? selectedRowForHistory?.Can_Inicial ?? 0}</span></p>
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
                        else if (log.Tipo === 'Ajuste') badgeClass = "bg-warning text-dark";

                        const isDiscount = log.Tipo === 'Salida' || (log.Tipo === 'Ajuste' && (log.Detalle?.toLowerCase().includes('descuento') || log.Detalle?.toLowerCase().includes('baja')));

                        return (
                          <tr key={log.Id_Movimiento_Material}>
                            <td className="small">{new Date(log.Fecha).toLocaleString('es-CO')}</td>
                            <td>
                              <span className={`badge ${badgeClass}`}>{log.Tipo}</span>
                            </td>
                            <td className={`fw-bold text-nowrap ${isDiscount ? 'text-danger' : 'text-success'}`}>
                              {isDiscount ? '-' : '+'}{log.Cantidad}
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

export default CrudEntradaMaterial;