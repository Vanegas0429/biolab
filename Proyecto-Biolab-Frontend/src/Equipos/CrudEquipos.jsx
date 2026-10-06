import { useState, useEffect } from "react";
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

  // Estado para el carrusel modal
  const [carouselImages, setCarouselImages] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);

  // Estado para modal PDF
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    getAllEquipos();

    // Auto-refresh cada 15 segundos
    const interval = setInterval(() => {
      getAllEquipos();
    }, 15000);

    return () => clearInterval(interval);
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
    const btn = document.getElementById('closeModal')
    if (btn) btn.click()
  };

  const toggleEstado = async (row) => {
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
      await apiAxios.put(`/api/Equipo/${row.Id_Equipo}`, formData, {
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
        const response = await apiAxios.put(`/api/Equipo/${row.Id_Equipo}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        await getAllEquipos();

        // Abrir el modal automáticamente con el nuevo archivo
        if (response.data && response.data.ficha_tecnica) {
          setPdfUrl(`${API_URL}/uploads/${response.data.ficha_tecnica}`);
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

  const findCarouselEquipo = () => {
    return equipos.find(eq => {
      const imgs = parseImages(eq.img_equipo);
      return imgs.some(img => carouselImages.includes(img));
    });
  };

  const onViewDetails = (row) => {
    const imgs = parseImages(row.img_equipo);
    const hasImages = imgs.length > 0;
    const hasPdf = Boolean(row.ficha_tecnica);
    let currentImgIdx = 0;

    Swal.fire({
      title: `<div class="d-flex align-items-center justify-content-between pb-2 border-bottom w-100 px-2">
        <span class="fw-bold text-primary fs-4 text-start me-3"><i class="fa-solid fa-microscope me-2"></i>${row.nombre || 'Detalles del Equipo'}</span>
        <span class="badge ${row.estado === 'Activo' ? 'bg-success' : 'bg-danger'} px-3 py-2 rounded-pill fs-6">${row.estado || 'N/A'}</span>
      </div>`,
      width: '720px',
      showConfirmButton: false,
      showCloseButton: true,
      html: `
        <div class="text-start mt-2 px-1" style="font-size: 0.92rem;">
          ${hasImages ? `
            <div class="position-relative text-center mb-3 bg-light p-3 rounded-4 shadow-sm border overflow-hidden">
              <div class="d-flex align-items-center justify-content-center" style="min-height: 320px;">
                <img id="swal-equipo-img" src="${API_URL}/uploads/${imgs[0]}" alt="${row.nombre}" class="rounded-3 shadow-sm transition-all" style="max-height: 340px; object-fit: contain; width: 100%;" />
              </div>
              ${imgs.length > 1 ? `
                <button id="swal-img-prev" type="button" class="btn btn-primary rounded-circle position-absolute top-50 start-0 translate-middle-y ms-3 shadow" style="width: 44px; height: 44px; z-index: 5;">
                  <i class="fa-solid fa-chevron-left fs-5"></i>
                </button>
                <button id="swal-img-next" type="button" class="btn btn-primary rounded-circle position-absolute top-50 end-0 translate-middle-y me-3 shadow" style="width: 44px; height: 44px; z-index: 5;">
                  <i class="fa-solid fa-chevron-right fs-5"></i>
                </button>
                <span id="swal-img-counter" class="position-absolute bottom-0 start-50 translate-middle-x mb-3 badge bg-dark opacity-75 px-3 py-2 rounded-pill fs-6">
                  1 / ${imgs.length}
                </span>
              ` : ''}
            </div>
          ` : ''}

          <div class="row g-3 mb-3 bg-light p-3 rounded-4 mx-0 shadow-sm border">
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-tag me-2 text-primary"></i>PLACA</p>
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

        if (imgs.length > 1) {
          const imgEl = document.getElementById('swal-equipo-img');
          const prevBtn = document.getElementById('swal-img-prev');
          const nextBtn = document.getElementById('swal-img-next');
          const counterEl = document.getElementById('swal-img-counter');

          const updateImg = () => {
            if (imgEl) imgEl.src = `${API_URL}/uploads/${imgs[currentImgIdx]}`;
            if (counterEl) counterEl.textContent = `${currentImgIdx + 1} / ${imgs.length}`;
          };

          if (prevBtn) {
            prevBtn.addEventListener('click', () => {
              currentImgIdx = currentImgIdx === 0 ? imgs.length - 1 : currentImgIdx - 1;
              updateImg();
            });
          }

          if (nextBtn) {
            nextBtn.addEventListener('click', () => {
              currentImgIdx = currentImgIdx === imgs.length - 1 ? 0 : currentImgIdx + 1;
              updateImg();
            });
          }
        }
      }
    });
  };

  const equiposFiltrados = equipos.filter((e) =>
    (e.nombre || '').toLowerCase().includes(filterText.toLowerCase()) ||
    (e.grupo || '').toLowerCase().includes(filterText.toLowerCase()) ||
    (e.centro_costos || '').toLowerCase().includes(filterText.toLowerCase()) ||
    (e.placa || e.no_chapeta || '').toLowerCase().includes(filterText.toLowerCase())
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
              name: 'EQUIPO',
              sortable: true,
              grow: 1,
              minWidth: '180px',
              cell: (row) => {
                const imgs = parseImages(row.img_equipo);
                return (
                  <div className="d-flex align-items-center py-2">
                    <div className="me-3 position-relative">
                      {imgs.length > 0 ? (
                        <img
                          src={`${API_URL}/uploads/${imgs[0]}`}
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
              name: 'PLACA',
              selector: row => row.placa || row.no_chapeta || 'N/A',
              sortable: true,
              width: '140px'
            },
            {
              name: 'MARCA / GRUPO',
              sortable: true,
              width: '200px',
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
                  {row.linea || 'N/A'}
                </div>
              ),
            },
            {
              name: 'CENTRO DE COSTOS',
              sortable: true,
              grow: 1,
              minWidth: '180px',
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
              width: '180px'
            },
            {
              name: 'ACCIONES',
              center: "true",
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
              <img src={`${API_URL}/uploads/${carouselImages[carouselIndex]}`} alt={`Imagen ${carouselIndex + 1}`} className="carousel-image shadow-lg" />
            </div>
            {carouselImages.length > 1 && (
              <button className="carousel-arrow carousel-arrow-right" onClick={carouselNext}><i className="fa-solid fa-chevron-right"></i></button>
            )}
            {userRol !== 'solicitante' && (
              <div className="carousel-actions">
                <button className="carousel-action-btn add-btn" onClick={() => { const eq = findCarouselEquipo(); if (eq) triggerImageUpload(eq); }}><i className="fa-solid fa-plus me-2"></i>Agregar</button>
                <button className="carousel-action-btn delete-btn" onClick={() => { const eq = findCarouselEquipo(); if (eq) deleteImage(eq.Id_Equipo, carouselImages[carouselIndex]); }}><i className="fa-solid fa-trash-can me-2"></i>Eliminar</button>
              </div>
            )}
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