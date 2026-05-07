import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import EspeciesForm from "./EspeciesForm.jsx"
import Swal from 'sweetalert2'

const CrudEspecie = () => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [Especie, setEspecie] = useState([])
  const [filterText, setFilterText] = useState("")

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
              width: '150px',
              cell: row => (
                row.img_especie ? (
                  <img
                    src={`http://localhost:8000/uploads/${row.img_especie}`}
                    alt={row.Nom_especie}
                    className="rounded shadow-sm border my-2"
                    style={{ width: '45px', height: '45px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => {
                      Swal.fire({
                        imageUrl: `http://localhost:8000/uploads/${row.img_especie}`,
                        imageAlt: row.Nom_especie,
                        showConfirmButton: false,
                        showCloseButton: true,
                        customClass: {
                          closeButton: 'custom-swal-close-btn'
                        },
                        background: 'transparent',
                        backdrop: `rgba(0,0,0,0.8)`
                      })
                    }}
                  />
                ) : (
                  <div className="bg-light text-muted d-flex align-items-center justify-content-center rounded border my-2" style={{ width: '45px', height: '45px', borderStyle: 'dashed !important' }}>
                    <i className="fa-solid fa-image opacity-50"></i>
                  </div>
                )
              )
            },
            {
              name: 'ESTADO',
              sortable: true,
              center: "true",
              width: '150px',
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
              width: '150px',
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
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudEspecie;
