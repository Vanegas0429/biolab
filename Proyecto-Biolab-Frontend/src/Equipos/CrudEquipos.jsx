import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import EquiposForm from "./EquiposForm";
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

const CrudEquipos = ({ userRol }) => {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowToEdit, setRowToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado para el carrusel modal
  const [carouselImages, setCarouselImages] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);

  // Estado para modal PDF
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    getAllEquipos();
  }, []);

  const getAllEquipos = async () => {
    try {
      const response = await apiAxios.get("/api/Equipo");
      setEquipos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando equipos:", error);
      setLoading(false);
    }
  };

  const hideModal = () => {
    const modalElement = document.getElementById("exampleModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
  };

  const toggleEstado = async (row) => {
    let estadoNuevo = row.estado === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await apiAxios.put(`/api/Equipo/${row.id_equipo}`, {
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
    }
  };

  const parseImages = (imgField) => {
    if (!imgField) return [];
    try {
      const parsed = JSON.parse(imgField);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [imgField];
    }
  };

  const openCarousel = (row, startIndex = 0) => {
    const imgs = parseImages(row.img_equipo);
    if (imgs.length === 0) return;
    setCarouselImages(imgs);
    setCarouselIndex(startIndex);
    setShowCarousel(true);
  };

  const carouselPrev = () => setCarouselIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  const carouselNext = () => setCarouselIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));

  const uploadImagesToEquipo = async (row, files) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('img_equipo', f));
    formData.append('nombre', row.nombre || '');
    try {
      await apiAxios.put(`/api/Equipo/${row.id_equipo}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await getAllEquipos();
      Swal.fire('¡Éxito!', 'Imágenes subidas correctamente', 'success');
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
    }
  };

  const triggerImageUpload = (row) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => uploadImagesToEquipo(row, e.target.files);
    input.click();
  };

  const deleteImage = async (equipoId, filename) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    });
    if (!result.isConfirmed) return;

    try {
      await apiAxios.delete(`/api/Equipo/${equipoId}/imagen/${filename}`);
      await getAllEquipos();
      const remaining = carouselImages.filter(img => img !== filename);
      if (remaining.length === 0) {
        setShowCarousel(false);
      } else {
        setCarouselImages(remaining);
        setCarouselIndex((prev) => Math.min(prev, remaining.length - 1));
      }
      Swal.fire('Eliminada', 'La imagen ha sido eliminada.', 'success');
    } catch (error) {
      console.error("Error eliminando imagen:", error);
    }
  };

  const uploadFicha = async (row) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('ficha_tecnica', file);
      formData.append('nombre', row.nombre || '');
      try {
        await apiAxios.put(`/api/Equipo/${row.id_equipo}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        getAllEquipos();
        Swal.fire('¡Éxito!', 'Ficha técnica subida', 'success');
      } catch (error) {
        console.error("Error subiendo ficha técnica:", error);
      }
    };
    input.click();
  };

  const findCarouselEquipo = () => {
    return equipos.find(eq => {
      const imgs = parseImages(eq.img_equipo);
      return imgs.some(img => carouselImages.includes(img));
    });
  };

  const equiposFiltrados = equipos.filter((e) =>
    e.nombre?.toLowerCase().includes(filterText.toLowerCase()) ||
    e.grupo?.toLowerCase().includes(filterText.toLowerCase()) ||
    e.centro_costos?.toLowerCase().includes(filterText.toLowerCase())
  );

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
              placeholder="Buscar equipo..." 
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
              name: 'ID',
              selector: row => row.id_equipo,
              sortable: true,
              width: '70px'
            },
            {
              name: 'EQUIPO',
              sortable: true,
              grow: 2,
              minWidth: '180px',
              cell: (row) => {
                const imgs = parseImages(row.img_equipo);
                return (
                  <div className="d-flex align-items-center py-2">
                    <div className="me-3 position-relative">
                      {imgs.length > 0 ? (
                        <img 
                          src={`http://localhost:8000/uploads/${imgs[0]}`} 
                          alt={row.nombre}
                          className="rounded shadow-sm border"
                          style={{ width: '45px', height: '45px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => openCarousel(row)}
                        />
                      ) : (
                        <div 
                          className="bg-light text-muted d-flex align-items-center justify-content-center rounded border"
                          style={{ width: '45px', height: '45px', borderStyle: 'dashed !important', cursor: userRol !== 'solicitante' ? 'pointer' : 'default' }}
                          onClick={() => userRol !== 'solicitante' && triggerImageUpload(row)}
                        >
                          <i className="fa-solid fa-camera opacity-50"></i>
                        </div>
                      )}
                      {imgs.length > 1 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-white" style={{ fontSize: '0.6rem' }}>
                          +{imgs.length - 1}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{row.nombre}</div>
                    </div>
                  </div>
                );
              }
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
              name: 'LÍNEA',
              selector: row => row.linea || 'N/A',
              sortable: true,
              width: '120px'
            },
            {
              name: 'C. COSTOS',
              selector: row => row.centro_costos || 'N/A',
              sortable: true,
              width: '120px'
            },
            {
              name: 'FICHA',
              center: true,
              width: '80px',
              cell: (row) => (
                row.ficha_tecnica ? (
                  <button 
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-none"
                    onClick={() => {
                      setPdfUrl(`http://localhost:8000/uploads/${row.ficha_tecnica}`);
                      setShowPdf(true);
                    }}
                  >
                    <i className="fa-solid fa-file-pdf"></i>
                  </button>
                ) : (
                  userRol !== 'solicitante' && (
                    <button className="btn btn-sm text-muted opacity-50" onClick={() => uploadFicha(row)}>
                      <i className="fa-solid fa-upload"></i>
                    </button>
                  )
                )
              )
            },
            {
              name: 'ESTADO',
              sortable: true,
              center: true,
              width: '120px',
              cell: (row) => (
                <span 
                  className={`status-badge ${row.estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'}`}
                  style={{ cursor: userRol !== 'solicitante' ? 'pointer' : 'default' }}
                  onClick={() => userRol !== 'solicitante' && toggleEstado(row)}
                >
                  {row.estado}
                </span>
              )
            },
            ...(userRol !== 'solicitante' ? [{
              name: 'ACCIONES',
              center: true,
              width: '100px',
              cell: (row) => (
                <button 
                  className="btn-action btn-action-edit"
                  onClick={() => setRowToEdit(row)}
                  data-bs-toggle="modal" 
                  data-bs-target="#exampleModal"
                  title="Editar"
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              )
            }] : [])
          ]}
          data={equiposFiltrados}
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

      {/* MODAL CARRUSEL */}
      {showCarousel && carouselImages.length > 0 && (
        <div className="carousel-overlay" onClick={() => setShowCarousel(false)}>
          <div className="carousel-container" onClick={(e) => e.stopPropagation()}>
            <button className="carousel-close" onClick={() => setShowCarousel(false)}><i className="fa-solid fa-xmark"></i></button>
            <div className="carousel-counter">{carouselIndex + 1} / {carouselImages.length}</div>
            {carouselImages.length > 1 && (
              <button className="carousel-arrow carousel-arrow-left" onClick={carouselPrev}><i className="fa-solid fa-chevron-left"></i></button>
            )}
            <div className="carousel-image-wrapper">
              <img src={`http://localhost:8000/uploads/${carouselImages[carouselIndex]}`} alt={`Imagen ${carouselIndex + 1}`} className="carousel-image shadow-lg" />
            </div>
            {carouselImages.length > 1 && (
              <button className="carousel-arrow carousel-arrow-right" onClick={carouselNext}><i className="fa-solid fa-chevron-right"></i></button>
            )}
            {userRol !== 'solicitante' && (
              <div className="carousel-actions">
                <button className="carousel-action-btn add-btn" onClick={() => { const eq = findCarouselEquipo(); if (eq) triggerImageUpload(eq); }}><i className="fa-solid fa-plus me-2"></i>Agregar</button>
                <button className="carousel-action-btn delete-btn" onClick={() => { const eq = findCarouselEquipo(); if (eq) deleteImage(eq.id_equipo, carouselImages[carouselIndex]); }}><i className="fa-solid fa-trash-can me-2"></i>Eliminar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL PDF */}
      {showPdf && (
        <div className="carousel-overlay" onClick={() => setShowPdf(false)}>
          <div className="pdf-modal-container shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <span className="pdf-modal-title"><i className="fa-solid fa-file-pdf me-2"></i>Ficha Técnica</span>
              <button className="pdf-modal-close" onClick={() => setShowPdf(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <iframe src={pdfUrl} className="pdf-modal-iframe" title="Ficha Técnica PDF" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudEquipos;