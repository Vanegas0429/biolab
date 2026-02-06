import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ProduccionForm from "./ProduccionForm.jsx"

const CrudProduccion = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Produccion, setProduccion] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Id_Produccion', selector: row => row.Id_produccion},
    {name: 'Tip_produccion', selector: row => row.Tip_produccion},
    {name: 'Cod_produccion', selector: row => row.Cod_produccion},
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllProduccion()
  }, [])

  // Crear una función para la consulta
  const getAllProduccion = async () => {
    const response = await apiAxios.get('/api/Produccion') // Se utilizará el apiAxios que tiene la URL del backend
    setProduccion(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  const newListProduccion = Produccion.filter((uso) => {
    const textToSearch = filterText.toLowerCase()

    const Tip_produccion = uso.Tip_produccion?.toLowerCase()
    return (
      Tip_produccion.includes(textToSearch)
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
            <input className="form-control" placeholder="Buscar Produccion (ej: Práctica, Externa, Producción)" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
          <div className="col-2">
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="closeModal">
              Nuevo
            </button>
          </div>
        </div>
        <DataTable
          title="Produccion" //Titulo de la tabla
          columns={columnsTable} //Columns de la tabla
          data={newListProduccion} //Fuente de los datos
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
                <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar Produccion Nueva</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close" id="closeModal"></button>
              </div>
              <div className="modal-body">
                <ProduccionForm hideModal={hideModal} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CrudProduccion