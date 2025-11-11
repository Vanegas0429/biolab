import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudLotes = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Lotes, setLotes] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Planta', selector: row => row.Id_planta},
    {name: 'Nombre', selector: row => row.Nombre}
    
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllLotes()
  }, [])

  // Crear una función para la consulta
  const getAllLotes = async () => {
    const response = await apiAxios.get('/api/Lote') // Se utilizará el apiAxios que tiene la URL del backend
    setLotes(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  const newListLotes = Lotes.filter((uso) => {
    const textToSearch = filterText.toLowerCase()

    const nombre = uso.Nombre?.toLowerCase()
    return (
      nombre.includes(textToSearch)
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="Lotes" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListLotes} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudLotes