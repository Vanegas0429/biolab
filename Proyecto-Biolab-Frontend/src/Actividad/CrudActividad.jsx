import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ActividadForm from "./ActividadForm.jsx"

const CrudActividad = () => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [Actividad, setActividad] = useState([])
  const [filterText, setFilterText] = useState("")

  const toggleEstado = async (row) => {
    let estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await apiAxios.put(`/api/Actividad/${row.Id_Actividad}`, {
        ...row,
        Estado: estadoNuevo
      });
      getAllActividad();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const columnsTable = [
    { 
      name: 'ID', 
      selector: row => row.Id_Actividad,
      sortable: true,
      width: '80px'
    },
    { 
      name: 'ACTIVIDAD', 
      selector: row => row.Nom_Actividad,
      sortable: true,
      grow: 2
    },
    {
      name: 'ESTADO',
      center: true,
      width: '120px',
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
      center: true,
      width: '100px',
      cell: row => (
        <button
          className="btn-action btn-action-edit mx-auto"
          onClick={() => setRowToEdit(row)}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          title="Editar"
        >
          <i className="fa-solid fa-pencil"></i>
        </button>
      )
    }
  ];

  useEffect(() => {
    getAllActividad()
  }, [])

  const getAllActividad = async () => {
    try {
      const response = await apiAxios.get('/api/Actividad')
      setActividad(response.data)
    } catch (error) {
      console.error("Error cargando Actividades:", error)
    }
  }

  const newListActividad = Actividad.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    const Nom_Actividad = uso.Nom_Actividad?.toLowerCase() || ""
    return Nom_Actividad.includes(textToSearch)
  })

  const hideModal = () => {
    const closeBtn = document.getElementById('closeModal')
    if (closeBtn) closeBtn.click()
  }

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-5" style={{ paddingTop: '2rem' }}>
        <div className="row d-flex justify-content-between align-items-center mb-4 gap-3 gap-md-0">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                    <i className="fa-solid fa-magnifying-glass text-muted"></i>
                </span>
                <input
                    className="form-control border-start-0 ps-0"
                    placeholder="Buscar actividad..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>
          </div>
          <div className="col-12 col-md-auto text-md-end text-center">
            <button 
              type="button" 
              className="btn btn-primary px-4 shadow-sm fw-bold" 
              data-bs-toggle="modal" 
              data-bs-target="#exampleModal" 
              onClick={() => setRowToEdit(null)}
            >
              <i className="fa-solid fa-plus me-2"></i>
              Nueva Actividad 
            </button>
          </div>
        </div>

        <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
          <DataTable
            columns={columnsTable}
            data={newListActividad}
            keyField="Id_Actividad"
            pagination
            highlightOnHover
            noDataComponent={
              <div className="text-center py-5 text-muted">
                <i className="fa-solid fa-list-check fs-1 mb-3 d-block opacity-25"></i>
                No se encontraron actividades.
              </div>
            }
          />
        </div>

        <div className="modal fade" id="exampleModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light">
                <h1 className="modal-title fs-5 fw-bold">
                  {rowToEdit ? "Editar Actividad" : "Agregar Actividad"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>
              <div className="modal-body p-4">
                <ActividadForm
                  hideModal={hideModal}
                  refreshList={getAllActividad}
                  rowToEdit={rowToEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default CrudActividad
