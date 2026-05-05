import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import MaterialForm from "./MaterialForm.jsx";
import Swal from 'sweetalert2';

const CrudMaterial = () => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [Material, setMaterial] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);

  const toggleEstado = async (row) => {
    let estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await apiAxios.put(`/api/Material/${row.Id_Material}`, {
        ...row,
        Estado: estadoNuevo
      });
      getAllMaterial();
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

  useEffect(() => {
    getAllMaterial();
  }, []);

  const getAllMaterial = async () => {
    try {
      const response = await apiAxios.get('/api/Material');
      setMaterial(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando materiales:", error);
      setLoading(false);
    }
  };

  const newListMaterial = Material.filter((uso) => {
    const textToSearch = filterText.toLowerCase();
    return uso.Nom_Material?.toLowerCase().includes(textToSearch);
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
              <i className="fa-solid fa-boxes-stacked fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Gestión de Materiales</h2>
              <p className="text-muted mb-0 small">Inventario de insumos y materiales de laboratorio.</p>
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
              placeholder="Buscar material..." 
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
            <i className="fa-solid fa-plus me-2"></i>Nuevo Material
          </button>
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM CON CABECERA OSCURA */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr style={{ background: 'var(--secondary-color)', color: 'white' }}>
                <th className="px-4 py-3 border-0 fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>MATERIAL</th>
                <th className="py-3 border-0 fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>ESTADO</th>
                <th className="px-4 py-3 border-0 text-end fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {newListMaterial.map((m) => (
                <tr key={m.Id_Material} className="last-child-border-0">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-info-subtle text-info rounded-circle d-flex justify-content-center align-items-center me-3 border border-info-subtle" style={{ width: '40px', height: '40px', fontWeight: 'bold', fontSize: '1rem' }}>
                        {m.Nom_Material.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{m.Nom_Material}</div>
                        <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>ID: {m.Id_Material}</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span 
                      className={`badge rounded-pill px-3 py-2 ${m.Estado === 'Activo' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}`}
                      style={{ cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem' }}
                      onClick={() => toggleEstado(m)}
                    >
                      {m.Estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button 
                      className="btn btn-sm btn-light rounded-circle shadow-sm border me-2"
                      onClick={() => setRowToEdit(m)}
                      data-bs-toggle="modal" 
                      data-bs-target="#exampleModal"
                      title="Editar"
                    >
                      <i className="fa-solid fa-pencil text-primary"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {newListMaterial.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-5 text-muted">
                    <i className="fa-solid fa-box-open fs-1 mb-3 d-block opacity-25"></i>
                    No se encontraron materiales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal formulario */}
      <div className="modal fade" id="exampleModal" tabIndex="-1">
        <div className="modal-dialog modal-lg border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                {rowToEdit ? "Editar Material" : "Agregar Nuevo Material"}
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" id="closeModal"></button>
            </div>
            <div className="modal-body p-4">
              <MaterialForm
                hideModal={hideModal}
                refreshList={getAllMaterial}
                rowToEdit={rowToEdit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudMaterial;
