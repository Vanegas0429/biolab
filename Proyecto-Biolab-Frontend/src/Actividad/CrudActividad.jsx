import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ActividadForm from "./ActividadForm.jsx"

const CrudActividad = () => {


  const [rowToEdit, setRowToEdit] = useState(null);
  const [Actividad, setActividad] = useState([])
  const [filterText, setFilterText] = useState("")
  // 🔹 Función para alternar Activo/Inactivo
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
    { name: 'Id_Actividad', selector: row => row.Id_Actividad },
    { name: 'Nombre de Actividad', selector: row => row.Nom_Actividad },
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
  ];

  useEffect(() => {
    getAllActividad()
  }, [])

  const getAllActividad = async () => {
    const response = await apiAxios.get('/api/Actividad')
    setActividad(response.data)
    console.log(response.data)
  }

  const newListActividad = Actividad.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    const Nom_Actividad = uso.Nom_Actividad?.toLowerCase()
    return Nom_Actividad.includes(textToSearch)
  })

  const hideModal = () => {
    document.getElementById('closeModal').click()
  }

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-5" style={{ paddingTop: '2rem' }}>
        <div className="row d-flex justify-content-between align-items-center mb-4 gap-3 gap-md-0">
          <div className="col-12 col-md-6 col-lg-4">
            <input className="form-control shadow-sm" placeholder="Buscar por Actividad" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
          <div className="col-12 col-md-auto text-md-end text-center">
            <button type="button" className="btn btn-primary px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" id="closeModal" onClick={() => setRowToEdit(null)}>
              Agregar Actividad 
            </button>
          </div>
        </div>
         <DataTable
          title="Actividad"
          columns={columnsTable}
          data={newListActividad}
          keyField="Id_Actividad"
          pagination
          highlightOnHover
          striped
          conditionalRowStyles={[
            {
              when: row => row.Estado === "Activo",
              style: {
                backgroundColor: "#ffffff", // fila blanca
                color: "#000000"            // texto negro
              }
            },
            {
              when: row => row.Estado === "Inactivo",
              style: {
                backgroundColor: "#aeadad", // fila gris clarito
                color: "#6c757d"            // texto gris oscuro
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
                  {rowToEdit ? "Editar Actividad" : "Agregar Actividad"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>

              <div className="modal-body">
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
