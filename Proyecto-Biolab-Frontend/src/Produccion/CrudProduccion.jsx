import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ProduccionForm from "./ProduccionForm.jsx"
import Sup_PlantasForm from "../Sup_Plantas/Sup_PlantasForm.jsx"
import Swal from "sweetalert2"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const CrudProduccion = () => {
  const [rowToEdit, setRowToEdit] = useState(null)
  const [Produccion, setProduccion] = useState([])
  const [filterText, setFilterText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Estados para supervisión y resumen
  const [selectedProdSupervision, setSelectedProdSupervision] = useState(null)
  const [summaryData, setSummaryData] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [selectedSupDetail, setSelectedSupDetail] = useState(null)

  const handleViewSupervisionDetail = (sup) => {
    setSelectedSupDetail(sup)
  }

  const getAllProduccion = async () => {
    try {
      setIsLoading(true)
      const response = await apiAxios.get('/api/Produccion')
      setProduccion(response.data)
    } catch (error) {
      console.error("Error cargando producción:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAllProduccion()
  }, [])

  const handleOpenSupervision = (row) => {
    setSelectedProdSupervision(row)
  }

  const handleOpenResumen = async (row) => {
    setSummaryData({ produccion: row, supervisiones: [] })
    setLoadingSummary(true)
    try {
      const res = await apiAxios.get('/api/Sup_Plantas')
      const allSups = res.data ?? []
      const filtered = allSups.filter(s => Number(s.Id_produccion) === Number(row.Id_produccion))
      setSummaryData({ produccion: row, supervisiones: filtered })
    } catch (error) {
      console.error("Error cargando supervisiones:", error)
      Swal.fire("Error", "No se pudo cargar el resumen de supervisión", "error")
    } finally {
      setLoadingSummary(false)
    }
  }

  const toggleEstado = async (row) => {
    const estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';
    const result = await Swal.fire({
      title: `¿${estadoNuevo === 'Activo' ? 'Activar' : 'Inactivar'} producción?`,
      text: `Lote: ${row.Lote}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/Produccion/${row.Id_produccion}`, { ...row, Estado: estadoNuevo });
      getAllProduccion();
      Swal.fire({ title: 'Estado actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };

  const filteredItems = useMemo(() => {
    const text = filterText.toLowerCase();
    return Produccion.filter((sup) =>
      sup.Lote?.toLowerCase().includes(text) ||
      sup.Especie?.Nom_especie?.toLowerCase().includes(text)
    );
  }, [Produccion, filterText]);

  const hideModal = () => {
    const btn = document.getElementById('closeModal')
    if (btn) btn.click()
  }

  const hideSupervisionModal = () => {
    const btn = document.getElementById('closeSupervisionModal')
    if (btn) btn.click()
  }

  return (
    <div className="container-fluid py-4 fade-in">
      {/* HEADER */}
      <div className="row mb-4 align-items-center g-3">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '50px', height: '50px' }}>
              <i className="fa-solid fa-seedling fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Gestión de Producción</h2>
              <p className="text-muted mb-0 small">Seguimiento y control de lotes de producción vegetal.</p>
            </div>
          </div>
        </div>
        <div className="col-md-auto d-flex gap-2">
          <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border" style={{ width: '300px' }}>
            <span className="input-group-text border-0 bg-transparent ps-3">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 py-2 shadow-none bg-transparent"
              placeholder="Buscar producción..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => setRowToEdit(null)}
          >
            <i className="fa-solid fa-plus me-2"></i>Nueva Producción
          </button>
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM CON DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={[
            { name: 'ID', selector: row => row.Id_produccion, sortable: true, width: '80px' },
            {
              name: 'ESPECIE',
              selector: row => row.Especie?.Nom_especie || 'N/A',
              sortable: true,
              grow: 0.5,
              cell: row => (
                <div className="fw-bold text-dark py-2">{row.Especie?.Nom_especie || 'N/A'}</div>
              )
            },
            { name: 'LOTE', selector: row => row.Lote, sortable: true, width: '100px' },
            { name: 'TIPO PRODUCCIÓN', selector: row => row.Tip_produccion, sortable: true, grow: 1 },
            { name: 'CANT. PRODUC. INCIAL', selector: row => row.Can_Produccion || 0, sortable: true, width: '180px', center: true },
            { name: 'CANT. PRODUC. ACTUAL', selector: row => row.Can_Existente ?? row.Can_Produccion ?? 0, sortable: true, width: '180px', center: true },
            {
              name: 'FECHA PRODUC.',
              selector: row => row.Fec_produccion ? row.Fec_produccion.split('T')[0] : '',
              sortable: true,
              width: '170px'
            },
            {
              name: 'ESTADO',
              sortable: true,
              center: "true",
              width: '110px',
              cell: row => (
                <span
                  className={`status-badge ${row.Estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'}`}
                  onClick={() => toggleEstado(row)}
                  style={{ cursor: 'pointer' }}
                >
                  {row.Estado}
                </span>
              )
            },
            {
              name: 'ACCIONES',
              center: "true",
              width: '250px',
              cell: row => (
                <div className="d-flex gap-1 align-items-center">
                  <button
                    className="btn-action btn-action-edit"
                    onClick={() => setRowToEdit(row)}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    title="Editar Producción"
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>

                  <button
                    className="btn btn-sm btn-outline-success rounded-pill px-2 py-1 shadow-sm"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => handleOpenSupervision(row)}
                    data-bs-toggle="modal"
                    data-bs-target="#supervisionModal"
                    title="Agregar Supervisión"
                  >
                    <i className="fa-solid fa-leaf me-1"></i>Supervisión
                  </button>

                  <button
                    className="btn btn-sm btn-outline-primary rounded-pill px-2 py-1 shadow-sm"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => handleOpenResumen(row)}
                    data-bs-toggle="modal"
                    data-bs-target="#resumenModal"
                    title="Resumen por Producción"
                  >
                    <i className="fa-solid fa-chart-pie me-1"></i>Resumen
                  </button>
                </div>
              )
            }
          ]}
          data={filteredItems}
          pagination
          highlightOnHover
          persistTableHead
          progressPending={isLoading}
          noDataComponent={
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-folder-open fs-1 mb-3 d-block opacity-25"></i>
              No se encontraron registros de producción.
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

      {/* Modal Producción */}
      <div className="modal fade" id="exampleModal" tabIndex="-1">
        <div className="modal-dialog modal-lg border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                {rowToEdit ? "Editar Producción" : "Agregar Nueva Producción"}
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" id="closeModal"></button>
            </div>
            <div className="modal-body p-4">
              <ProduccionForm
                hideModal={hideModal}
                refreshList={getAllProduccion}
                rowToEdit={rowToEdit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Agregar Supervisión */}
      <div className="modal fade" id="supervisionModal" tabIndex="-1">
        <div className="modal-dialog modal-xl border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-success text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                <i className="fa-solid fa-leaf me-2"></i>
                Agregar Supervisión a Producción (Lote: {selectedProdSupervision?.Lote})
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" id="closeSupervisionModal"></button>
            </div>
            <div className="modal-body p-4">
              {selectedProdSupervision && (
                <Sup_PlantasForm
                  hideModal={hideSupervisionModal}
                  refreshList={getAllProduccion}
                  rowToEdit={{
                    Id_produccion: selectedProdSupervision.Id_produccion,
                    Num_lote: selectedProdSupervision.Lote,
                    Fc_Iniciales: selectedProdSupervision.Can_Existente ?? selectedProdSupervision.Can_Produccion
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Resumen por Producción */}
      <div className="modal fade" id="resumenModal" tabIndex="-1">
        <div className="modal-dialog modal-lg border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                <i className="fa-solid fa-chart-pie me-2"></i>
                Resumen por Producción - Lote {summaryData?.produccion?.Lote}
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              {loadingSummary ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted">Cargando resumen...</p>
                </div>
              ) : summaryData ? (
                <div>
                  {/* Ficha rápida de producción */}
                  <div className="row g-3 mb-4 p-3 bg-light rounded-3 border">
                    <div className="col-md-4">
                      <small className="text-muted d-block">Especie:</small>
                      <strong className="text-dark fs-6">{summaryData.produccion?.Especie?.Nom_especie || 'N/A'}</strong>
                    </div>
                    <div className="col-md-4">
                      <small className="text-muted d-block">Tipo de Producción:</small>
                      <strong className="text-dark fs-6">{summaryData.produccion?.Tip_produccion}</strong>
                    </div>
                    <div className="col-md-4">
                      <small className="text-muted d-block">Fecha de Producción:</small>
                      <strong className="text-dark fs-6">{summaryData.produccion?.Fec_produccion}</strong>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-secondary mb-0">
                      <i className="fa-solid fa-clipboard-list me-2"></i>
                      Supervisiones Registradas ({summaryData.supervisiones?.length || 0}):
                    </h6>
                    <button className="btn btn-sm btn-outline-danger shadow-sm rounded-pill px-3" onClick={() => {
                      const doc = new jsPDF({ orientation: 'landscape' });
                      doc.text(`Reporte de Supervisiones - Lote ${summaryData.produccion?.Lote}`, 14, 15);
                      doc.setFontSize(10);
                      doc.text(`Especie: ${summaryData.produccion?.Especie?.Nom_especie || 'N/A'}`, 14, 22);
                      doc.text(`Tipo de Producción: ${summaryData.produccion?.Tip_produccion}`, 14, 28);
                      doc.text(`Fecha de Producción: ${summaryData.produccion?.Fec_produccion}`, 14, 34);

                      const tableHead = [
                        [
                          { content: 'Lote Sup.', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                          { content: 'Medio Cultivo', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                          { content: 'Propagación', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                          { content: 'Iniciales', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                          { content: 'Frascos Contaminados', colSpan: 2, styles: { halign: 'center' } },
                          { content: 'Sin Des.', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                          { content: 'Frascos Desarrollados', colSpan: 5, styles: { halign: 'center' } },
                          { content: 'Endurec.', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }
                        ],
                        [
                          { content: 'Bacterias', styles: { halign: 'center' } },
                          { content: 'Hongos', styles: { halign: 'center' } },
                          { content: 'BR', styles: { halign: 'center' } },
                          { content: 'RA', styles: { halign: 'center' } },
                          { content: 'CA', styles: { halign: 'center' } },
                          { content: 'MOR', styles: { halign: 'center' } },
                          { content: 'GER', styles: { halign: 'center' } }
                        ]
                      ];

                      const tableRows = [];

                      summaryData.supervisiones.forEach(sup => {
                        const supData = [
                          sup.Num_lote || 'N/A',
                          sup.Med_Cultivo || 'N/A',
                          sup.Met_Propagacion || 'N/A',
                          sup.Fc_Iniciales || 0,
                          sup.Fc_Bacterias || 0,
                          sup.Fc_Hongos || 0,
                          sup.Fs_Desarrollo || 0,
                          sup.Fd_BR || 0,
                          sup.Fd_RA || 0,
                          sup.Fd_CA || 0,
                          sup.Fd_MOR || 0,
                          sup.Fd_GER || 0,
                          sup.Num_endurecimiento || 0
                        ];
                        tableRows.push(supData);
                      });

                      autoTable(doc, {
                        head: tableHead,
                        body: tableRows,
                        startY: 40,
                        theme: 'grid',
                        headStyles: {
                          fillColor: [33, 37, 41],
                          textColor: [255, 255, 255],
                          fontSize: 9,
                          fontStyle: 'bold',
                        },
                        bodyStyles: {
                          fontSize: 9,
                        },
                      });

                      doc.save(`Supervisiones_Lote_${summaryData.produccion?.Lote}.pdf`);
                    }}>
                      <i className="fa-solid fa-file-pdf me-2"></i>Descargar PDF
                    </button>
                  </div>

                  {summaryData.supervisiones?.length === 0 ? (
                    <div className="alert alert-info text-center py-3">
                      <i className="fa-solid fa-info-circle me-2"></i>
                      Esta producción aún no tiene registros de supervisión.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle border rounded-3 overflow-hidden">
                        <thead className="table-light">
                          <tr>
                            <th># Lote Sup.</th>
                            <th>Medio Cultivo</th>
                            <th>Frascos Iniciales</th>
                            <th>Contaminación</th>
                            <th>Desarrollados</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summaryData.supervisiones.map((sup, idx) => (
                            <tr key={sup.Id_sup_plantas || idx}>
                              <td className="fw-bold">{sup.Num_lote || 'N/A'}</td>
                              <td>{sup.Med_Cultivo || 'N/A'}</td>
                              <td><span className="badge bg-primary rounded-pill px-3">{sup.Fc_Iniciales || 0}</span></td>
                              <td>
                                <span className="text-danger small">
                                  Bacterias: {sup.Fc_Bacterias || 0} | Hongos: {sup.Fc_Hongos || 0}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-success rounded-pill px-3">
                                  {(Number(sup.Fd_BR || 0) + Number(sup.Fd_RA || 0) + Number(sup.Fd_CA || 0) + Number(sup.Fd_MOR || 0) + Number(sup.Fd_GER || 0))} desarrollados
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-sm"
                                  data-bs-toggle="modal"
                                  data-bs-target="#verSupervisionModal"
                                  onClick={() => handleViewSupervisionDetail(sup)}
                                >
                                  <i className="fa-solid fa-eye me-1"></i>Ver Detalle
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ver Detalle de Supervisión (Lectura) */}
      <div className="modal fade" id="verSupervisionModal" tabIndex="-1">
        <div className="modal-dialog modal-xl border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-secondary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                <i className="fa-solid fa-eye me-2"></i>
                Detalle de Supervisión (Lote Sup: {selectedSupDetail?.Num_lote})
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-toggle="modal" data-bs-target="#resumenModal"></button>
            </div>
            <div className="modal-body p-4">
              {selectedSupDetail && (
                <Sup_PlantasForm
                  rowToEdit={selectedSupDetail}
                  isViewOnly={true}
                />
              )}
            </div>
            <div className="modal-footer border-0 bg-light p-3">
              <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#resumenModal">
                Volver al Historial
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CrudProduccion;