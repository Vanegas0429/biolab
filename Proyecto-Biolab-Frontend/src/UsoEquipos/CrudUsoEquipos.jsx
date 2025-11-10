import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudUsoEquipos = () => {

  // Crear una prop para guardar los datos de la consulta
  const [UsoEquipos, setUsoEquipos] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Hora Inicio', selector: row => row.hora_inicio},
    {name: 'Hora Fin', selector: row => row.hora_fin },
    {name: 'Actvidad Realizada', selector: row => row.actvidad_realizada},
    {name: 'Equipo', selector: row => row.id_equipo}
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

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" placeholder="Buscar por hora (ej: 08:00)" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

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
      </div>
    </>
  )
}

export default CrudUsoEquipos