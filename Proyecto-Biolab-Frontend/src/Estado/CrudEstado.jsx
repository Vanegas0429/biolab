import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudEstado = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Estado, setEstado] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arreglo con las columnas que contendra la tabla
    {name: 'Tip_Estado', selector: row => row.Tip_Estado}
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllEstado()
  }, [])

  // Crear una función para la consulta
  const getAllEstado = async () => {
    const response = await apiAxios.get('/api/Estado') // Se utilizará el apiAxios que tiene la URL del backend
    setEstado(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  // Buscador por Tip_Estado
  const newListEstado = Estado.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    return (
      uso.Tip_Estado?.toLowerCase().includes(textToSearch)
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" placeholder="Buscar por Tip_Estado" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="Estado" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListEstado} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudEstado