import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import UsoEquipoForm from "./UsoEquiposForm.jsx"

const CrudUsoEquipos = () => {

  // Crear una prop para guardar los datos de la consulta
  const [UsoEquipos, setUsoEquipos] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    { name: 'Hora Inicio', selector: row => row.hora_inicio },
    { name: 'Hora Fin', selector: row => row.hora_fin },
    { name: 'Actvidad Realizada', selector: row => row.actividad_realizada },
    { name: 'id_equipo', selector: row =>row.equipo.nombre},
    { name: 'Acciones', selector: row => (
        <button className="btn btn-sm bg-info"><i className="fa-solid fa-pencil"></i></button>
    )}
  ]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {

    getAllUsoEquipos()
  }, [])

  // Crear una función para la consulta
  const getAllUsoEquipos = async () => {
    const response = await apiAxios.get('/api/Uso_Equipo') // Se utilizará el apiAxios que tiene la URL del backend
    setUsoEquipos(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  // Buscador por hora (inicio o fin)
  const newListUsoEquipos = UsoEquipos.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    return (
      uso.hora_inicio?.toLowerCase().includes(textToSearch) ||
      uso.hora_fin?.toLowerCase().includes(textToSearch)
    )

  })

  const hideModal = () => {

    document.getElementById('closeModal').click()
  }

  return (
    <>
      <div className="container mt-5">

        <div className="row d-flex justify-content-between">
          <div className="col-4">
            <input className="form-control" placeholder="Buscar por hora (ej: 08:00)" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
          <div className="col-2">
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="closeModal">
              Nuevo
            </button>
          </div>
        </div>
        <DataTable
          title="Uso Equipos" //Titulo de la tabla
          columns={columnsTable} //Columns de la tabla
          data={newListUsoEquipos} //Fuente de los datos
          keyField="id" //Identficador de cada registro
          pagination //Activar paginacion
          highlightOnHover //Resalta la fila por donde pase el mouse
          striped //Estilo de tabla - tono en filas intercaladas
        />

        {/* <!-- Modal --> */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar Uso de Equipo</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close" id="closeModal"></button>
              </div>
              <div className="modal-body">
                <UsoEquipoForm hideModal={hideModal} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CrudUsoEquipos