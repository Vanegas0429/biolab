import { useState, useEffect, useMemo } from "react";
import apiAxios from "../api/axiosConfig.js";
import EquiposForm from "./EquiposForm";
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

const API_URL = import.meta.env.VITE_API_URL || "";

const CrudEquipos = ({ userRol }) => {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowToEdit, setRowToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado para modal PDF
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    getAllEquipos();

    // Auto-refresh silencioso en tiempo real (cada 8 segundos) sin interrumpir modales
    const interval = setInterval(() => {
      if (document.body.classList.contains('modal-open') || document.querySelector('.modal.show') || document.querySelector('.carousel-overlay') || document.querySelector('.swal2-container')) {
        return;
      }
      getAllEquipos();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getAllEquipos = async () => {
    try {
      const response = await apiAxios.get("/api/Equipo");
      setEquipos(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando equipos:", error);
      setLoading(false);
    }
  };

  const hideModal = () => {
    const btn = document.getElementById('closeModal');
    if (btn) btn.click();
  };

  const toggleEstado = async (row) => {
    if (userRol === 'solicitante') return;
    const estadoNuevo = row.estado === 'Activo' ? 'Inactivo' : 'Activo';

    const result = await Swal.fire({
      title: `¿${estadoNuevo === 'Activo' ? 'Activar' : 'Inactivar'} equipo?`,
      text: `Equipo: ${row.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/Equipo/${row.Id_Equipo}`, {
        ...row,
        estado: estadoNuevo
      });
      getAllEquipos();
      Swal.fire({
        title: 'Estado actualizado',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };

  const onViewDetails = (row) => {
    const hasPdf = Boolean(row.ficha_tecnica);

    Swal.fire({
      title: `<div class="d-flex align-items-center justify-content-between pb-2 border-bottom w-100 px-2">
        <span class="fw-bold text-primary fs-4 text-start me-3"><i class="fa-solid fa-microscope me-2"></i>${row.nombre || 'Detalles del Equipo'}</span>
        <span class="status-badge ${row.estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'} px-3 py-2 rounded-pill fs-6">${row.estado || 'N/A'}</span>
      </div>`,
      width: '720px',
      showConfirmButton: false,
      showCloseButton: true,
      html: `
        <div class="text-start mt-2 px-1" style="font-size: 0.92rem;">
          <div class="row g-3 mb-3 bg-light p-3 rounded-4 mx-0 shadow-sm border">
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-tag me-2 text-primary"></i>NÚMERO DE PLACA</p>
              <h6 class="fw-bold mb-0 text-dark">${row.placa || row.no_chapeta || 'N/A'}</h6>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-barcode me-2 text-primary"></i>SERIAL</p>
              <h6 class="fw-bold mb-0 text-dark">${row.serial || 'N/A'}</h6>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-copyright me-2 text-primary"></i>MARCA</p>
              <p class="fw-semibold mb-0 text-dark">${row.marca || 'N/A'}</p>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-layer-group me-2 text-primary"></i>GRUPO</p>
              <p class="fw-semibold mb-0 text-dark">${row.grupo || 'N/A'}</p>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-building me-2 text-primary"></i>CENTRO DE COSTOS</p>
              <p class="fw-semibold mb-0 text-dark">${row.centro_costos || 'N/A'}</p>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-calendar-day me-2 text-primary"></i>F. ADQUISICIÓN</p>
              <p class="fw-semibold mb-0 text-dark">${row.fecha_adquisicion || 'N/A'}</p>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-clock-history me-2 text-primary"></i>VIDA ÚTIL</p>
              <p class="fw-semibold mb-0 text-dark">${row.vida_util ? `${row.vida_util} años` : 'N/A'}</p>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-dollar-sign me-2 text-primary"></i>VALOR UNITARIO</p>
              <p class="fw-semibold mb-0 text-dark">${row.valor_unitario !== null && row.valor_unitario !== undefined && row.valor_unitario !== '' ? `$${Math.round(Number(row.valor_unitario)).toLocaleString('es-CO')}` : 'N/A'}</p>
            </div>
          </div>

          <div class="mb-3 p-3 bg-white border rounded-4 shadow-sm">
            <h6 class="mb-2 text-muted small fw-bold text-uppercase"><i class="fa-solid fa-align-left me-2 text-primary"></i>Descripción del Equipo</h6>
            <p class="mb-0 text-secondary" style="white-space: pre-wrap; line-height: 1.6; font-size: 0.92rem;">${row.linea || 'Sin descripción disponible.'}</p>
          </div>

          ${hasPdf ? `
            <div class="text-end">
              <button id="swal-pdf-btn" type="button" class="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm">
                <i class="fa-solid fa-file-pdf me-2 text-white"></i>Ver Ficha Técnica (PDF)
              </button>
            </div>
          ` : ''}
        </div>
      `,
      customClass: {
        popup: 'rounded-4 border-0 shadow-lg'
      },
      didOpen: () => {
        const pdfBtn = document.getElementById('swal-pdf-btn');
        if (pdfBtn) {
          pdfBtn.addEventListener('click', () => {
            Swal.close();
            setLoadingPdf(true);
            setPdfUrl(`${API_URL}/uploads/${row.ficha_tecnica}`);
            setShowPdf(true);
          });
        }
      }
    });
  };

  const equiposFiltrados = useMemo(() => {
    const text = filterText.toLowerCase();
    return equipos.filter((e) =>
      (e.nombre || '').toLowerCase().includes(text) ||
      (e.placa || e.no_chapeta || '').toLowerCase().includes(text) ||
      (e.grupo || '').toLowerCase().includes(text) ||
      (e.centro_costos || '').toLowerCase().includes(text) ||
      (e.marca || '').toLowerCase().includes(text)
    );
  }, [equipos, filterText]);

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
              <i className="fa-solid fa-microscope fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Gestión de Equipos</h2>
              <p className="text-muted mb-0 small">Inventario y control de equipos de laboratorio.</p>
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
              placeholder="Buscar equipo o placa..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          {userRol !== 'solicitante' && (
            <button
              className="btn btn-primary rounded-pill px-4 shadow-sm"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => setRowToEdit(null)}
            >
              <i className="fa-solid fa-plus me-2"></i>Nuevo Equipo
            </button>
          )}
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM CON DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={[
            {
              name: 'EQUIPO',
              sortable: true,
              grow: 2,
              minWidth: '240px',
              cell: (row) => (
                <div className="py-2">
                  <div className="fw-bold text-dark" style={{ fontSize: '0.92rem' }}>
                    <i className="fa-solid fa-microscope text-primary me-2"></i>
                    {row.nombre}
                  </div>
                  <small className="text-muted d-block ps-4">
                    <i className="fa-solid fa-tag me-1 text-secondary"></i>
                    Placa: <strong className="text-dark">{row.placa || 'N/A'}</strong>
                  </small>
                </div>
              )
            },
            {
              name: 'MARCA / GRUPO',
              sortable: true,
              width: '180px',
              cell: (row) => (
                <div>
                  <div className="text-dark fw-medium">{row.marca || 'N/A'}</div>
                  <small className="text-muted">{row.grupo || 'N/A'}</small>
                </div>
              )
            },
            {
              name: 'DESCRIPCIÓN DEL EQUIPO',
              selector: row => row.linea || 'N/A',
              sortable: true,
              grow: 2,
              minWidth: '200px',
              wrap: true,
              cell: (row) => (
                <div style={{
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  padding: '8px 0',
                  lineHeight: '1.4'
                }}>
                  {row.linea || <span className="text-muted fst-italic">Sin descripción</span>}
                </div>
              ),
            },
            {
              name: 'CENTRO DE COSTOS',
              sortable: true,
              grow: 1,
              minWidth: '160px',
              wrap: true,
              cell: (row) => (
                <div
                  style={{
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    padding: '10px 0',
                    lineHeight: '1.4'
                  }}
                >
                  {row.centro_costos || 'N/A'}
                </div>
              ),
            },
            {
              name: 'FECHA ADQUISICIÓN',
              selector: row => row.fecha_adquisicion || 'N/A',
              sortable: true,
              width: '160px'
            },
            ...(userRol !== 'solicitante' ? [
              {
                name: 'ESTADO',
                selector: row => row.estado,
                sortable: true,
                center: true,
                width: '140px',
                cell: (row) => (
                  <span
                    className={`status-badge ${
                      row.estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleEstado(row)}
                    title="Clic para cambiar estado"
                  >
                    {row.estado || 'Activo'}
                  </span>
                )
              }
            ] : []),
            {
              name: 'ACCIONES',
              center: true,
              width: '120px',
              cell: (row) => (
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn-action"
                    style={{ background: '#64748b', color: 'white' }}
                    onClick={() => onViewDetails(row)}
                    title="Ver detalles"
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>
                  {userRol !== 'solicitante' && (
                    <button
                      className="btn-action btn-action-edit"
                      onClick={() => setRowToEdit(row)}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      title="Editar"
                    >
                      <i className="fa-solid fa-pencil"></i>
                    </button>
                  )}
                </div>
              )
            }
          ]}
          data={equiposFiltrados}
          keyField="Id_Equipo"
          pagination
          highlightOnHover
          noDataComponent={
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-folder-open fs-1 mb-3 d-block opacity-25"></i>
              No se encontraron equipos.
            </div>
          }
          conditionalRowStyles={[
            {
              when: row => row.estado === "Inactivo",
              style: {
                backgroundColor: "#f8fafc",
                color: "#94a3b8",
                opacity: 0.8
              }
            }
          ]}
        />
      </div>

      {/* Modal Formulario */}
      {userRol !== 'solicitante' && (
        <div className="modal fade" id="exampleModal" tabIndex="-1">
          <div className="modal-dialog modal-lg border-0">
            <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                <h5 className="modal-title fw-bold">
                  {rowToEdit ? "Editar Equipo" : "Agregar Nuevo Equipo"}
                </h5>
                <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" id="closeModal"></button>
              </div>
              <div className="modal-body p-4">
                <EquiposForm
                  hideModal={hideModal}
                  refreshList={getAllEquipos}
                  rowToEdit={rowToEdit}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PDF */}
      {showPdf && (
        <div className="carousel-overlay" onClick={() => setShowPdf(false)}>
          <div className="pdf-modal-container shadow-lg position-relative" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <span className="pdf-modal-title"><i className="fa-solid fa-file-pdf me-2"></i>Ficha Técnica</span>
              <button className="pdf-modal-close" onClick={() => setShowPdf(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            {loadingPdf && (
              <div className="position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center justify-content-center bg-white p-4 rounded-3 shadow z-3">
                <div className="spinner-border text-primary mb-2" role="status"></div>
                <span className="fw-bold text-dark">Cargando Ficha Técnica...</span>
              </div>
            )}
            <iframe
              src={pdfUrl}
              className="pdf-modal-iframe"
              title="Ficha Técnica PDF"
              onLoad={() => setLoadingPdf(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudEquipos;
