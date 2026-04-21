import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ActividadEquipoForm from "./ActividadEquipoForm.jsx"

const CrudActividadEquipo = () => {

  const [rowToEdit, setRowToEdit] = useState(null)
  const [ActividadEquipo, setActividadEquipo] = useState([])
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
      await apiAxios.put(`/api/ActividadEquipo/${row.Id_ActividadEquipo}`, {
        ...row,
        Estado: estadoNuevo
      });

      getAllActividadEquipo();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // 🔹 Columnas
  const columnsTable = [
    { name: 'Id_ActvidadEquipo', selector: row => row.Id_ActividadEquipo },
    { name: 'Actividad', selector: row => row.Actividad?.Nom_Actividad },
    { name: 'Equipo', selector: row => row.Equipo?.nombre },
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
    getAllActividadEquipo()
  }, [])

  const getAllActividadEquipo = async () => {
    const response = await apiAxios.get('/api/ActividadEquipo')
    setActividadEquipo(response.data)
  }

  // 🔹 Buscador
  const newListActividadEquipo = ActividadEquipo.filter((sup) => {
    const text = filterText.toLowerCase();
    return (
      sup.Actividad?.Nom_Actividad.toLowerCase().includes(text) ||
      sup.Equipo?.nombre.toLowerCase().includes(text) 
    );
  });

  const hideModal = () => {
    document.getElementById('closeModal').click()
    getAllActividadEquipo()
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
              Agregar Actividad-Equipo
            </button>
          </div>
        </div>

        <DataTable
          title="Actividad-Equipo"
          columns={columnsTable}
          data={newListActividadEquipo}
          keyField="Id_ActvidadEquipo"
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
                  {rowToEdit ? "Editar Actividad-Equipo" : "Agregar Actividad-Equipo"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>

              <div className="modal-body">
                <ActividadEquipoForm
                  hideModal={hideModal}
                  refreshList={getAllActividadEquipo}
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

export default CrudActividadEquipo