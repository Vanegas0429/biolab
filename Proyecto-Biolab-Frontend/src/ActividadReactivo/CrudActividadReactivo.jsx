import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ActividadReactivoForm from "./ActividadReactivoForm.jsx"

const CrudActividadReactivo = () => {

  const [rowToEdit, setRowToEdit] = useState(null)
  const [ActividadReactivo, setActividadReactivo] = useState([])
  const [filterText, setFilterText] = useState("")

  // 🔹 Alternar Activo/Inactivo
  const toggleEstado = async (row) => {

    console.log(row.Estado)

    let estadoNuevo = ''

    if(row.Estado === 'Activo'){

      estadoNuevo = 'Inactivo'

    }else{
      estadoNuevo = 'Activo'
    }

    console.log(estadoNuevo)
    try {
      await apiAxios.put(`/api/ActividadReactivo/${row.Id_ActividadReactivo}`, {
        ...row,
        Estado: estadoNuevo
      });

      getAllActividadReactivo();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // 🔹 Columnas
  const columnsTable = [
    { name: 'Id_ActvidadReactivo', selector: row => row.Id_ActividadReactivo },
    { name: 'Actividad', selector: row => row.actividades?.Nom_Actividad },
    { name: 'Reactivo', selector: row => row.reactivos?.Nom_reactivo },
    {
      name: 'Estado',
      cell: row => (
        <button
          className={`btn btn-sm ${row.Estado =='Activo' ? 'btn-success' : 'btn-danger'}`}
          onClick={() => toggleEstado(row)}
        >
          {row.Estado}
        </button>
      )
    },
    {
      name: 'Acciones',
      selector: row => (
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
  ]

  // 🔹 Cargar datos
  useEffect(() => {
    getAllActividadReactivo()
  }, [])

  const getAllActividadReactivo = async () => {
    const response = await apiAxios.get('/api/ActividadReactivo')
    setActividadReactivo(response.data)
  }

  // 🔹 Buscador
  const newListActividadReactivo = ActividadReactivo.filter((sup) => {
    const text = filterText.toLowerCase();
    return (
      sup.actividades?.Nom_Actividad.toLowerCase().includes(text) ||
      sup.reactivos?.Nom_reactivo.toLowerCase().includes(text) 
    );
  });

  const hideModal = () => {
    document.getElementById('closeModal').click()
    getAllActividadReactivo()
  }

  return (
    <>
      <div className="container mt-5">

        <div className="row d-flex justify-content-between">
          <div className="col-4">
            <input
              className="form-control"
              placeholder="Buscar"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="col-2">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => setRowToEdit(null)}
            >
              Agregar Actividad-Reactivo
            </button>
          </div>
        </div>

        <DataTable
          title="Actividad-Reactivo"
          columns={columnsTable}
          data={newListActividadReactivo}
          keyField="Id_ActvidadReactivo"
          pagination
          highlightOnHover
          striped
          conditionalRowStyles={[
            {
              when: row => row.Estado === "Activo",
              style: {
                backgroundColor: "#ffffff",
                color: "#000000"
              }
            },
            {
              when: row => row.Estado === "Inactivo",
              style: {
                backgroundColor: "#aeadad",
                color: "#6c757d"
              }
            }
          ]}
        />

        {/* Modal */}
        <div className="modal fade" id="exampleModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h1 className="modal-title fs-5">
                  {rowToEdit ? "Editar Actividad-Reactivo" : "Agregar Actividad-Reactivo"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>

              <div className="modal-body">
                <ActividadReactivoForm
                  hideModal={hideModal}
                  refreshList={getAllActividadReactivo}
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

export default CrudActividadReactivo