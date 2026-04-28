import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from "react-data-table-component";
import EquiposForm from "./EquiposForm";

const CrudEquipos = ({ userRol }) => {

  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowToEdit, setRowToEdit] = useState([]);

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
    } catch (error) {
      console.error("Error cargando equipos:", error);
    }
  };

  const hideModal = () => {
    document.getElementById("closeModal").click();
  };

  const toggleEstado = async (row) => {
    let estadoNuevo = row.estado === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await apiAxios.put(`/api/Equipo/${row.id_equipo}`, {
        ...row,
        estado: estadoNuevo
      });
      getAllEquipos();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // Parsear imágenes del equipo (puede ser JSON array o string simple)
  const parseImages = (imgField) => {
    if (!imgField) return [];
    try {
      const parsed = JSON.parse(imgField);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [imgField];
    }
  };

  // Abrir carrusel modal
  const openCarousel = (row, startIndex = 0) => {
    const imgs = parseImages(row.img_equipo);
    if (imgs.length === 0) return;
    setCarouselImages(imgs);
    setCarouselIndex(startIndex);
    setShowCarousel(true);
  };

  // Navegación del carrusel
  const carouselPrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };
  const carouselNext = () => {
    setCarouselIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  // Subir imágenes directamente al equipo
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
      
      const response = await apiAxios.get(`/api/Equipo/${row.id_equipo}`);
      const updatedImgs = parseImages(response.data.img_equipo);
      
      setCarouselImages(updatedImgs);
      if (!showCarousel) {
         setCarouselIndex(0);
         setShowCarousel(true);
      }
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

  // Eliminar imagen
  const deleteImage = async (equipoId, filename) => {
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    try {
      await apiAxios.delete(`/api/Equipo/${equipoId}/imagen/${filename}`);
      await getAllEquipos();
      // Actualizar carrusel
      const remaining = carouselImages.filter(img => img !== filename);
      if (remaining.length === 0) {
        setShowCarousel(false);
      } else {
        setCarouselImages(remaining);
        setCarouselIndex((prev) => Math.min(prev, remaining.length - 1));
      }
    } catch (error) {
      console.error("Error eliminando imagen:", error);
    }
  };

  // Subir ficha técnica directamente desde la tabla
  const uploadFicha = async (row) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('ficha_tecnica', file);
      // Enviar campos requeridos para que el update no falle
      formData.append('nombre', row.nombre || '');
      try {
        await apiAxios.put(`/api/Equipo/${row.id_equipo}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        getAllEquipos();
      } catch (error) {
        console.error("Error subiendo ficha técnica:", error);
      }
    };
    input.click();
  };

  // Encontrar el equipo actual en el carrusel (para el botón eliminar)
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

  const columnsTable = [
    { name: "Id", selector: row => row.id_equipo, width: "60px", sortable: true },
    {
      name: "Imagen",
      width: "90px",
      cell: row => {
        const imgs = parseImages(row.img_equipo);
        if (imgs.length === 0) {
          if (userRol === 'solicitante') return <span className="text-muted small">Sin imagen</span>;
          return (
            <div 
              className="equipo-thumb-container d-flex align-items-center justify-content-center bg-light text-muted"
              style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-md)', border: '2px dashed #ccc', cursor: 'pointer' }}
              onClick={() => triggerImageUpload(row)}
              title="Agregar imagen"
            >
              <i className="fa-solid fa-plus fs-4"></i>
            </div>
          );
        }
        return (
          <div
            className="equipo-thumb-container"
            onClick={() => openCarousel(row)}
            title="Ver galería"
          >
            <img
              src={`http://localhost:8000/uploads/${imgs[0]}`}
              alt="Equipo"
              className="equipo-thumb"
            />
            {imgs.length > 1 && (
              <span className="equipo-thumb-badge">+{imgs.length - 1}</span>
            )}
          </div>
        );
      }
    },
    { name: "Nombre", selector: row => row.nombre, sortable: true },
    { name: "Marca", selector: row => row.marca, sortable: true },
    { name: "Grupo", selector: row => row.grupo, sortable: true },
    { name: "Linea", selector: row => row.linea, sortable: true },
    { name: "Centro Costos", selector: row => row.centro_costos, sortable: true, width: "130px" },
    {
      name: "Ficha",
      width: "100px",
      cell: row => (
        <div className="d-flex align-items-center justify-content-center">
          {row.ficha_tecnica ? (
            <button
              className="btn btn-sm btn-outline-primary rounded-pill px-3"
              title="Ver PDF"
              onClick={() => {
                setPdfUrl(`http://localhost:8000/uploads/${row.ficha_tecnica}`);
                setShowPdf(true);
              }}
            >
              <i className="fa-solid fa-eye me-1"></i>Ver
            </button>
          ) : userRol !== 'solicitante' ? (
            <button
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              onClick={() => uploadFicha(row)}
              title="Subir PDF"
            >
              <i className="fa-solid fa-upload me-1"></i>Subir
            </button>
          ) : (
            <span className="text-muted small">N/A</span>
          )}
        </div>
      )
    },
    {
      name: 'Estado',
      width: "95px",
      cell: row => (
        <button
          className={`btn btn-sm ${row.estado =='Activo' ? 'btn-success' : 'btn-danger'}`}
          onClick={() => userRol !== 'solicitante' && toggleEstado(row)}
          style={{ cursor: userRol === 'solicitante' ? 'default' : 'pointer' }}
        >
          {row.estado}
        </button>
      )
    },
    {
      name: "Acciones",
      width: "80px",
      cell: row => (
        <button
          className="btn btn-sm bg-info"
          onClick={() => setRowToEdit(row)}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <i className="fa-solid fa-pencil"></i>
        </button>
      )
    }
  ];

  // Filtrar columnas si es solicitante
  const finalColumnsTable = userRol === 'solicitante' 
    ? columnsTable.slice(0, 9) // Id hasta Estado
    : columnsTable;

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-2">

        <div className="row d-flex justify-content-between align-items-center mb-4 gap-3 gap-md-0">
          <div className="col-12 col-md-6 col-lg-4">
            <input
              className="form-control shadow-sm"
              placeholder="Buscar..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-auto text-md-end text-center">
            {userRol !== 'solicitante' && (
              <button
                type="button"
                className="btn btn-primary px-4 shadow-sm"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                id="closeModal"
              >
                Agregar Equipo
              </button>
            )}
          </div>
        </div>

        <DataTable
          title="Equipos"
          columns={finalColumnsTable}
          data={equiposFiltrados}
          keyField="id_equipo"
          pagination
          highlightOnHover
          striped
          conditionalRowStyles={[
            {
              when: row => row.estado === "Activo",
              style: { backgroundColor: "#ffffff", color: "#000000" }
            },
            {
              when: row => row.estado === "Inactivo",
              style: { backgroundColor: "#aeadad", color: "#6c757d" }
            }
          ]}
        />

        {/* Modal Formulario */}
        <div className="modal fade" id="exampleModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h1 className="modal-title fs-5">
                  {rowToEdit ? "Editar Equipo" : "Agregar Equipo"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>

              <div className="modal-body">
                <EquiposForm
                  hideModal={hideModal}
                  refreshList={getAllEquipos}
                  rowToEdit={rowToEdit}
                />
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ======== MODAL CARRUSEL DE IMÁGENES ======== */}
      {showCarousel && carouselImages.length > 0 && (
        <div className="carousel-overlay" onClick={() => setShowCarousel(false)}>
          <div className="carousel-container" onClick={(e) => e.stopPropagation()}>

            {/* Botón cerrar */}
            <button className="carousel-close" onClick={() => setShowCarousel(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Contador */}
            <div className="carousel-counter">
              {carouselIndex + 1} / {carouselImages.length}
            </div>

            {/* Flecha izquierda */}
            {carouselImages.length > 1 && (
              <button className="carousel-arrow carousel-arrow-left" onClick={carouselPrev}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            )}

            {/* Imagen */}
            <div className="carousel-image-wrapper">
              <img
                src={`http://localhost:8000/uploads/${carouselImages[carouselIndex]}`}
                alt={`Imagen ${carouselIndex + 1}`}
                className="carousel-image"
              />
            </div>

            {/* Flecha derecha */}
            {carouselImages.length > 1 && (
              <button className="carousel-arrow carousel-arrow-right" onClick={carouselNext}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            )}

            {/* Acciones de imagen */}
            {userRol !== 'solicitante' && (
              <div className="carousel-actions">
                <button
                  className="carousel-action-btn add-btn"
                  onClick={() => {
                    const eq = findCarouselEquipo();
                    if (eq) triggerImageUpload(eq);
                  }}
                >
                  <i className="fa-solid fa-plus me-2"></i>Agregar
                </button>

                <button
                  className="carousel-action-btn delete-btn"
                  onClick={() => {
                    const eq = findCarouselEquipo();
                    if (eq) deleteImage(eq.id_equipo, carouselImages[carouselIndex]);
                  }}
                >
                  <i className="fa-solid fa-trash-can me-2"></i>Eliminar
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======== MODAL VISOR DE PDF ======== */}
      {showPdf && (
        <div className="carousel-overlay" onClick={() => setShowPdf(false)}>
          <div className="pdf-modal-container" onClick={(e) => e.stopPropagation()}>

            {/* Header del modal PDF */}
            <div className="pdf-modal-header">
              <span className="pdf-modal-title">
                <i className="fa-solid fa-file-pdf me-2"></i>Ficha Técnica
              </span>
              <button className="pdf-modal-close" onClick={() => setShowPdf(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Iframe con el PDF */}
            <iframe
              src={pdfUrl}
              className="pdf-modal-iframe"
              title="Ficha Técnica PDF"
            />

          </div>
        </div>
      )}
    </>
  )
};

export default CrudEquipos;