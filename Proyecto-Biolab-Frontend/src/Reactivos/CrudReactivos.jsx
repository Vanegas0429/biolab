import { useState, useEffect, useMemo } from "react";
import apiAxios from "../api/axiosConfig.js";
import ReactivosForm from "./ReactivosForm.jsx";
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { safeCloseModal } from "../utils/modalHelper.js";

const API_URL = import.meta.env.VITE_API_URL || "";

const CrudReactivos = ({ userRol }) => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [Reactivo, setReactivo] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);

  // Estado para modal PDF
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("ficha_tecnica.pdf");
  const [loadingPdf, setLoadingPdf] = useState(false);

  const handleDownloadPdf = async (url, fileName = "ficha_tecnica.pdf") => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("No se pudo descargar el archivo");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleEstado = async (row) => {
    if (userRol === 'solicitante') return;
    const estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';
    const isActivar = estadoNuevo === 'Activo';

    const result = await Swal.fire({
      title: isActivar ? '¿Activar reactivo?' : '¿Desactivar reactivo?',
      html: `
        <p class="mb-2">¿Deseas cambiar el estado de <strong>"${row.Nom_reactivo}"</strong> a <span class="badge ${isActivar ? 'bg-success' : 'bg-danger'}">${estadoNuevo}</span>?</p>
        <small class="text-muted d-block mt-2">${isActivar ? '✅ Estará disponible para su uso y selección en el laboratorio.' : '⚠️ No se podrá seleccionar en nuevas actividades del sistema.'}</small>
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
      await apiAxios.put(`/api/Reactivo/${row.Id_Reactivo}`, { ...row, Estado: estadoNuevo });
      getAllReactivos();
      Swal.fire({
        title: isActivar ? '¡Reactivo activado!' : '¡Reactivo desactivado!',
        text: `El reactivo "${row.Nom_reactivo}" ahora se encuentra ${estadoNuevo}.`,
        icon: 'success',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado del reactivo.', 'error');
    }
  };

  const uploadFicha = (row) => {
    if (userRol === 'solicitante') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('Ficha_tecnica', file);
      formData.append('Nom_reactivo', row.Nom_reactivo || '');
      try {
        const response = await apiAxios.put(`/api/Reactivo/${row.Id_Reactivo}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        await getAllReactivos();
        
        if (response.data && response.data.Ficha_tecnica) {
          setPdfUrl(`${API_URL}/uploads/${response.data.Ficha_tecnica}`);
          setShowPdf(true);
        }
        
        Swal.fire({
          title: '¡Éxito!',
          text: 'Ficha técnica subida y abierta',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Error subiendo ficha técnica:", error);
        Swal.fire('Error', 'No se pudo subir la ficha técnica', 'error');
      }
    };
    input.click();
  };

  useEffect(() => {
    getAllReactivos();

    // Auto-refresh silencioso en tiempo real (cada 8 segundos) sin interrumpir modales
    const interval = setInterval(() => {
      if (document.body.classList.contains('modal-open') || document.querySelector('.modal.show') || document.querySelector('.carousel-overlay') || document.querySelector('.swal2-container')) {
        return;
      }
      getAllReactivos();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getAllReactivos = async () => {
    try {
      const response = await apiAxios.get('/api/Reactivo');
      setReactivo(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando reactivos:", error);
      setLoading(false);
    }
  };

  const newListReactivo = useMemo(() => {
    const textToSearch = filterText.toLowerCase();
    return Reactivo.filter((uso) =>
      (uso.Nom_reactivo || '').toLowerCase().includes(textToSearch) ||
      (uso.Nomenclatura || '').toLowerCase().includes(textToSearch) ||
      (uso.Presentacion || '').toLowerCase().includes(textToSearch)
    );
  }, [Reactivo, filterText]);

  const hideModal = () => {
    safeCloseModal('exampleModal');
    setRowToEdit(null);
  };

  const onViewDetails = (row) => {
    const hasPdf = Boolean(row.Ficha_tecnica);

    Swal.fire({
      title: `<div class="d-flex align-items-center justify-content-between pb-2 border-bottom w-100 px-2">
        <span class="fw-bold text-primary fs-4 text-start me-3"><i class="fa-solid fa-flask me-2"></i>${row.Nom_reactivo || 'Detalles del Reactivo'}</span>
        <span class="status-badge ${row.Estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'} px-3 py-2 rounded-pill fs-6">${row.Estado || 'N/A'}</span>
      </div>`,
      width: '600px',
      showConfirmButton: false,
      showCloseButton: true,
      html: `
        <div class="text-start mt-3 px-1" style="font-size: 0.95rem;">
          <div class="row g-3 mb-3 bg-light p-3 rounded-4 mx-0 shadow-sm border">
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-signature me-2 text-primary"></i>NOMENCLATURA</p>
              <h6 class="fw-bold mb-0 text-dark">${row.Nomenclatura || 'N/A'}</h6>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-box-archive me-2 text-primary"></i>PRESENTACIÓN</p>
              <h6 class="fw-bold mb-0 text-dark">${row.Presentacion || 'N/A'}</h6>
            </div>
            <div class="col-12 mt-2 pt-2 border-top">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-file-lines me-2 text-primary"></i>FICHA TÉCNICA</p>
              <p class="fw-semibold mb-0 text-dark">${row.Ficha_tecnica ? 'Documento PDF disponible' : 'Sin ficha técnica registrada'}</p>
            </div>
          </div>
          ${hasPdf ? `
            <div class="d-flex justify-content-end gap-2 flex-wrap mt-3">
              <button id="swal-reactivo-pdf-btn" type="button" class="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm">
                <i class="fa-solid fa-file-pdf me-2 text-white"></i>Ver Ficha Técnica (PDF)
              </button>
              <button id="swal-reactivo-pdf-download-btn" type="button" class="btn btn-outline-success rounded-pill px-4 py-2 fw-semibold shadow-sm">
                <i class="fa-solid fa-download me-2"></i>Descargar PDF
              </button>
            </div>
          ` : ''}
        </div>
      `,
      customClass: {
        popup: 'rounded-4 border-0 shadow-lg'
      },
      didOpen: () => {
        if (hasPdf) {
          const cleanName = `Ficha_Tecnica_${(row.Nom_reactivo || 'Reactivo').replace(/\s+/g, '_')}.pdf`;
          const fileUrl = `${API_URL}/uploads/${row.Ficha_tecnica}`;
          const btn = document.getElementById('swal-reactivo-pdf-btn');
          if (btn) {
            btn.addEventListener('click', () => {
              Swal.close();
              setLoadingPdf(true);
              setPdfFileName(cleanName);
              setPdfUrl(fileUrl);
              setShowPdf(true);
            });
          }
          const downloadBtn = document.getElementById('swal-reactivo-pdf-download-btn');
          if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
              handleDownloadPdf(fileUrl, cleanName);
            });
          }
        }
      }
    });
  };

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
              <i className="fa-solid fa-flask fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Catálogo de Reactivos</h2>
              <p className="text-muted mb-0 small">Control y especificaciones de sustancias químicas y reactivos.</p>
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
              placeholder="Buscar reactivo..."
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
              <i className="fa-solid fa-plus me-2"></i>Nuevo Reactivo
            </button>
          )}
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM CON DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={[
            {
              name: 'REACTIVO',
              sortable: true,
              grow: 2,
              minWidth: '220px',
              cell: (row) => (
                <div className="fw-bold text-dark py-2">
                  <i className="fa-solid fa-flask text-primary me-2"></i>
                  {row.Nom_reactivo}
                </div>
              )
            },
            {
              name: 'NOMENCLATURA',
              selector: row => row.Nomenclatura || 'N/A',
              sortable: true,
              grow: 1.5,
              minWidth: '180px'
            },
            {
              name: 'PRESENTACIÓN',
              selector: row => row.Presentacion || 'N/A',
              sortable: true,
              grow: 1.5,
              minWidth: '180px'
            },
            ...(userRol !== 'solicitante' ? [{
              name: 'ESTADO',
              sortable: true,
              center: true,
              width: '140px',
              cell: (row) => (
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
            }] : []),
            {
              name: 'ACCIONES',
              center: true,
              width: '130px',
              cell: (row) => (
                <div className="d-flex gap-1 justify-content-center">
                  <button
                    type="button"
                    className="btn-action btn-action-view"
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
          data={newListReactivo}
          keyField="Id_Reactivo"
          pagination
          highlightOnHover
          noDataComponent={
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-flask-vial fs-1 mb-3 d-block opacity-25"></i>
              No se encontraron reactivos.
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
      {userRol !== 'solicitante' && (
        <div className="modal fade" id="exampleModal" tabIndex="-1">
          <div className="modal-dialog modal-lg border-0">
            <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                <h5 className="modal-title fw-bold">
                  {rowToEdit ? "Editar Reactivo" : "Agregar Nuevo Reactivo"}
                </h5>
                <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" id="closeModal"></button>
              </div>
              <div className="modal-body p-4">
                <ReactivosForm
                  hideModal={hideModal}
                  refreshList={getAllReactivos}
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
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-light rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                  onClick={() => handleDownloadPdf(pdfUrl, pdfFileName)}
                  title="Descargar Ficha Técnica"
                >
                  <i className="fa-solid fa-download text-primary"></i>
                  <span>Descargar PDF</span>
                </button>
                <button className="pdf-modal-close" onClick={() => setShowPdf(false)} title="Cerrar"><i className="fa-solid fa-xmark"></i></button>
              </div>
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

export default CrudReactivos;
