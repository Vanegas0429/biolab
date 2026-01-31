import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudFuncionarios = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Funcionarios, setFuncionarios] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Nombre', selector: row => row.Nombre},
    {name: 'Apellido', selector: row => row.Apellido},
    {name: 'Telefono', selector: row => row.Telefono},
    {name: 'Correo', selector: row => row.Correo},
    {name: 'Cargo funcionario', selector: row => row.Cargo_Funcionario}
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllFuncionarios()
  }, [])

  // Crear una función para la consulta
  const getAllFuncionarios = async () => {
    const response = await apiAxios.get('/api/Funcionario') // Se utilizará el apiAxios que tiene la URL del backend
    setFuncionarios(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  // Buscador por nombre y apellido
  const newListFuncionarios = Funcionarios.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    return (
      uso.Nombre?.toLowerCase().includes(textToSearch) ||
      uso.Apellido?.toLowerCase().includes(textToSearch)
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" placeholder="Buscar por nombre" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="Funcionarios" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListFuncionarios} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudFuncionarios