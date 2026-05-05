import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import ReactivosForm from "./ReactivosForm.jsx";
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

const CrudReactivos = () => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [Reactivo, setReactivo] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);

  // Estado para modal PDF
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const toggleEstado = async (row) => {
    let estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await apiAxios.put(`/api/Reactivo/${row.Id_Reactivo}`, {
        ...row,
        Estado: estadoNuevo
      });
      getAllReactivos();
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

  const uploadFicha = (row) => {
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
        await apiAxios.put(`/api/Reactivo/${row.Id_Reactivo}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        getAllReactivos();
        Swal.fire('¡Éxito!', 'Ficha técnica subida', 'success');
      } catch (error) {
        console.error("Error subiendo ficha técnica:", error);
      }
    };
    input.click();
  };

  useEffect(() => {
    getAllReactivos();
  }, []);

  const getAllReactivos = async () => {
    try {
      const response = await apiAxios.get('/api/Reactivo');
      setReactivo(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando reactivos:", error);
      setLoading(false);
    }
  };

  const newListReactivo = Reactivo.filter((uso) => {
    const textToSearch = filterText.toLowerCase();
    return uso.Nom_reactivo?.toLowerCase().includes(textToSearch) ||
           uso.Nomenclatura?.toLowerCase().includes(textToSearch);
  });

  const hideModal = () => {
    const modalElement = document.getElementById("exampleModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
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
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Gestión de Reactivos</h2>
              <p className="text-muted mb-0 small">Control de sustancias químicas y reactivos.</p>
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
          <button 
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal" 
            data-bs-target="#exampleModal"
            onClick={() => setRowToEdit(null)}
          >
            <i className="fa-solid fa-plus me-2"></i>Nuevo Reactivo
          </button>
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM CON DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={[
            {
              name: 'ID',
              selector: row => row.Id_Reactivo,
              sortable: true,
              width: '70px'
            },
            {
              name: 'REACTIVO',
              sortable: true,
              grow: 2,
              cell: (row) => (
                <div className="fw-bold text-dark py-2">
                  {row.Nom_reactivo}
                </div>
              )
            },
            {
              name: 'NOMENCLATURA',
              selector: row => row.Nomenclatura || 'N/A',
              sortable: true,
              width: '150px'
            },
            {
              name: 'PRESENTACIÓN',
              selector: row => row.Presentacion || 'N/A',
              sortable: true,
              width: '180px'
            },
            {
              name: 'FICHA',
              center: true,
              cell: (row) => (
                row.Ficha_tecnica ? (
                  <button 
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-none"
                    onClick={() => {
                      setPdfUrl(`http://localhost:8000/uploads/${row.Ficha_tecnica}`);
                      setShowPdf(true);
                    }}
                  >
                    <i className="fa-solid fa-file-pdf"></i>
                  </button>
                ) : (
                  <button className="btn btn-sm text-muted opacity-50" onClick={() => uploadFicha(row)}>
                    <i className="fa-solid fa-upload"></i>
                  </button>
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
            }
          ]}
          data={newListReactivo}
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

export default CrudReactivos;
