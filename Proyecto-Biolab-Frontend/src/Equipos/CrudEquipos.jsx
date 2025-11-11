import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudEquipos = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Equipos, setEquipos] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Nombre', selector: row => row.nombre},
    {name: 'Marca', selector: row => row.marca},
    {name: 'Grupo', selector: row => row.grupo},
    {name: 'Linea', selector: row => row.linea},
    {name: 'Centro de costos', selector: row => row.centro_costos},
    {name: 'Subcentro de costos', selector: row => row.subcentro_costos}
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllEquipos()
  }, [])

  // Crear una función para la consulta
  const getAllEquipos = async () => {
    const response = await apiAxios.get('/api/Equipos') // Se utilizará el apiAxios que tiene la URL del backend
    setEquipos(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  // Buscador por hora (inicio o fin)
  const newListEquipos = Equipos.filter((uso) => {
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
            title="Equipos" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListEquipos} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudEquipos