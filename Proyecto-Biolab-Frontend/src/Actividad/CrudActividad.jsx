import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudActividad = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Actividad, setActividad] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arreglo con las columnas que contendra la tabla
    {name: 'Nom_Actividad', selector: row => row.Nom_Actividad}
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllActividad()
  }, [])

  // Crear una función para la consulta
  const getAllActividad = async () => {
    const response = await apiAxios.get('/api/Actividad') // Se utilizará el apiAxios que tiene la URL del backend
    setActividad(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  // Buscador por Nom_Actividad
  const newListActividad = Actividad.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    return (
      uso.Nom_Actividad?.toLowerCase().includes(textToSearch)
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" placeholder="Buscar por Nom_Actividad" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="Actividad" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListActividad} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudActividad