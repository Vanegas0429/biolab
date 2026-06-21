import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import EspeciesForm from "./EspeciesForm.jsx"
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || "";

const CrudEspecie = () => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [Especie, setEspecie] = useState([])
  const [filterText, setFilterText] = useState("")

  // Estado para el carrusel modal
  const [carouselImages, setCarouselImages] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    getAllEspecies()
  }, [])

  const getAllEspecies = async () => {
    try {
      const response = await apiAxios.get('/api/Especie')
      setEspecie(response.data)
    } catch (error) {
      console.error("Error cargando especies:", error)
    }
  }

  const toggleEstado = async (row) => {
    const estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';
    const result = await Swal.fire({
      title: `¿${estadoNuevo === 'Activo' ? 'Activar' : 'Inactivar'} especie?`,
      text: row.Nom_especie,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/Especie/${row.Id_especie}`, { ...row, Estado: estadoNuevo });
      getAllEspecies();
      Swal.fire({ title: 'Estado actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
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
    const imgs = parseImages(row.img_especie);
    if (imgs.length === 0) return;
    setCarouselImages(imgs);
    setCarouselIndex(startIndex);
    setShowCarousel(true);
  };

  const carouselPrev = () => setCarouselIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  const carouselNext = () => setCarouselIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));

  const uploadImagesToEspecie = async (row, files) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('img_especie', f));
    formData.append('Nom_especie', row.Nom_especie || '');
    try {
      await apiAxios.put(`/api/Especie/${row.Id_especie}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await getAllEspecies();
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
    input.onchange = (e) => uploadImagesToEspecie(row, e.target.files);
    input.click();
  };

  const deleteImage = async (especieId, filename) => {
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
      await apiAxios.delete(`/api/Especie/${especieId}/imagen/${filename}`);
      await getAllEspecies();
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

  const findCarouselEspecie = () => {
    return Especie.find(esp => {
      const imgs = parseImages(esp.img_especie);
      return imgs.some(img => carouselImages.includes(img));
    });
  };

  const newListEspecie = useMemo(() => {
    const textToSearch = filterText.toLowerCase()
    return Especie.filter((uso) => uso.Nom_especie?.toLowerCase().includes(textToSearch))
  }, [Especie, filterText]);

  const hideModal = () => {
    const btn = document.getElementById('closeModal')
    if (btn) btn.click()
  }

  return (
    <div className="container-fluid py-4 fade-in">
      {/* HEADER */}
      <div className="row mb-4 align-items-center g-3">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '50px', height: '50px' }}>
              <i className="fa-solid fa-leaf fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Gestión de Especies</h2>
              <p className="text-muted mb-0 small">Catálogo de especies vegetales y microorganismos.</p>
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
              placeholder="Buscar especie..."
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
            <i className="fa-solid fa-plus me-2"></i>Nueva Especie
          </button>
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM CON DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={[
            { name: 'ID', selector: row => row?.Id_especie ?? "N/A", sortable: true, width: '100px' },
            {
              name: 'NOMBRE DE ESPECIE',
              selector: row => row?.Nom_especie ?? "N/A",
              sortable: true,
              grow: 2,
              cell: row => (
                <div className="fw-bold text-dark py-2">{row?.Nom_especie ?? "N/A"}</div>
              )
            },
            {
              name: 'IMAGEN',
              center: "true",
              width: '220px',
              cell: (row) => {
                const imgs = parseImages(row.img_especie);
                return (
                  <div className="d-flex align-items-center py-2">
                    <div className="position-relative">
                      {imgs.length > 0 ? (
                        <img
                          src={`${API_URL}/uploads/${imgs[0]}`}
                          alt={row.Nom_especie}
                          className="rounded shadow-sm border"
                          style={{ width: '45px', height: '45px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => openCarousel(row)}
                        />
                      ) : (
                        <div
                          className="bg-light text-muted d-flex align-items-center justify-content-center rounded border"
                          style={{ width: '45px', height: '45px', borderStyle: 'dashed !important', cursor: 'pointer' }}
                          onClick={() => triggerImageUpload(row)}
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
                  </div>
                );
              }
            },
            {
              name: 'ESTADO',
              sortable: true,
              center: "true",
              width: '220px',
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
              width: '220px',
              cell: row => (
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
            }
          ]}
          data={newListEspecie}
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent={
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-folder-open fs-1 mb-3 d-block opacity-25"></i>
              No se encontraron especies.
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

      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1">
        <div className="modal-dialog modal-lg border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                {rowToEdit ? "Editar Especie" : "Agregar Nueva Especie"}
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" id="closeModal"></button>
            </div>
            <div className="modal-body p-4">
              <EspeciesForm
                hideModal={hideModal}
                refreshList={getAllEspecies}
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
            <div className="carousel-actions">
              <button className="carousel-action-btn add-btn" onClick={() => { const esp = findCarouselEspecie(); if (esp) triggerImageUpload(esp); }}><i className="fa-solid fa-plus me-2"></i>Agregar</button>
              <button className="carousel-action-btn delete-btn" onClick={() => { const esp = findCarouselEspecie(); if (esp) deleteImage(esp.Id_especie, carouselImages[carouselIndex]); }}><i className="fa-solid fa-trash-can me-2"></i>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudEspecie;
