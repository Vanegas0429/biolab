import { useState, useEffect, useMemo } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from 'react-data-table-component';
import EntradaMaterialForm from "./EntradaMaterialForm.jsx";
import Swal from "sweetalert2";

const CrudEntradaMaterial = () => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [entradas, setEntradas] = useState([]);
  const [filterText, setFilterText] = useState("");
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
  }, []);

  const getAllEntradasMaterial = async () => {
    try {
      const response = await apiAxios.get('/api/EntradaMaterial');
      setEntradas(response.data ?? []);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando entradas de material:", error);
      setLoading(false);
    }
  };

  const toggleEstado = async (row) => {
    const estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';

    const result = await Swal.fire({
      title: `¿${estadoNuevo === 'Activo' ? 'Activar' : 'Inactivar'} entrada?`,
      text: `Material: ${row.Material?.Nom_Material}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, ${estadoNuevo === 'Activo' ? 'activar' : 'inactivar'}`,
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/EntradaMaterial/${row.Id_Entrada_Material}`, { ...row, Estado: estadoNuevo });
      getAllEntradasMaterial();
      Swal.fire({ title: 'Estado actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };

  const hideModal = () => {
    const btn = document.getElementById('closeModalBtnEntradaMat');
    if (btn) btn.click();
  };

  const filteredEntradas = useMemo(() => {
    const text = filterText.toLowerCase();
    return entradas.filter(e => {
      const nom = e.Material?.Nom_Material?.toLowerCase() || '';
      const clas = e.Material?.clasificacion?.toLowerCase() || '';
      return nom.includes(text) || clas.includes(text);
    });
  }, [entradas, filterText]);

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

      {/* TABLA DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={[
            {
              name: 'ID',
              selector: row => row.Id_Entrada_Material,
              sortable: true,
              width: '80px'
            },
            {
              name: 'MATERIAL',
              sortable: true,
              width: '250px',
              cell: row => (
                <div className="fw-bold text-dark py-2">
                  {row.Material?.Nom_Material || `Material #${row.Id_Material}`}
                </div>
              )
            },
            {
              name: 'CLASIFICACIÓN',
              selector: row => row.Material?.clasificacion || 'Desechable',
              sortable: true,
              width: '220px',
              cell: row => (
                <span className={`badge ${row.Material?.clasificacion === 'Reutilizable' ? 'bg-info text-dark' : 'bg-secondary'} rounded-pill px-3 py-2 fw-medium`}>
                  {row.Material?.clasificacion || 'Desechable'}
                </span>
              )
            },
            {
              name: 'CANT. INGRESADA',
              selector: row => row.Can_Inicial,
              sortable: true,
              center: true,
              width: '180px',
              cell: row => <span className="fw-bold text-dark">{row.Can_Inicial}</span>
            },
            {
              name: 'CANT. EXISTENTE',
              selector: row => row.Can_Existente,
              sortable: true,
              center: true,
              width: '180px',
              cell: row => <span className="fw-bold text-dark">{row.Can_Existente ?? row.Can_Inicial}</span>
            },
            {
              name: 'ESTADO',
              sortable: true,
              center: true,
              width: '150px',
              cell: row => (
                <span
                  className={`status-badge ${row.Estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleEstado(row)}
                >
                  {row.Estado}
                </span>
              )
            },
            {
              name: 'ACCIONES',
              center: true,
              width: '140px',
              cell: row => (
                <div className="d-flex gap-1 justify-content-center">
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
                    className="btn-action btn-action-view"
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
                        else if (log.Tipo === 'Ajuste') badgeClass = "bg-warning";

                        return (
                          <tr key={log.Id_Movimiento_Material}>
                            <td className="small">{new Date(log.Fecha).toLocaleString('es-CO')}</td>
                            <td>
                              <span className={`badge ${badgeClass}`}>{log.Tipo}</span>
                            </td>
                            <td className="fw-bold text-nowrap">
                              {log.Tipo === 'Salida' ? '-' : '+'}{log.Cantidad}
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
            <div className="modal-footer border-0 p-3 bg-light text-end">
              <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CrudEntradaMaterial;
