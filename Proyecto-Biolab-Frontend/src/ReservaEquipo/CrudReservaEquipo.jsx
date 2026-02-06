import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudReservaEquipo = () => {

  // Crear una prop para guardar los datos de la consulta
  const [ReservaEquipo, setReservaEquipo] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arreglo con las columnas que contendra la tabla
    {name: 'Id_Reserva', selector: row => row.Id_Reserva},
    {name: 'Id_Equipo', selector: row => row.Id_Equipo},
    {name: 'Can_Equipos', selector: row => row.Can_Equipos}
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllReservaEquipo()
  }, [])

  // Crear una función para la consulta
  const getAllReservaEquipo = async () => {
    const response = await apiAxios.get('/api/ReservaEquipo') // Se utilizará el apiAxios que tiene la URL del backend
    setReservaEquipo(response.data) // Se llena la constante players con el resultado de la consulta
    // console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  // Buscador por reserva y Equipo
  const newListReservaEquipo = ReservaEquipo.filter((uso) => {
    const textToSearch = (filterText ?? "").toString().toLowerCase()  //.toString para convertir numero a string
    
    return (
      uso.Id_Reserva?.toString().toLowerCase().includes(textToSearch) ||
      uso.Id_Equipo?.toString().toLowerCase().includes(textToSearch)
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" placeholder="Buscar por reserva o Equipo" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="ReservaEquipo" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListReservaEquipo} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudReservaEquipo