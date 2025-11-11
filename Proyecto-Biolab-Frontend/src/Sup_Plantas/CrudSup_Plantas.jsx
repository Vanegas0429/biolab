import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudSup_Plantas = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Sup_Plantas, setSup_Plantas] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Estado de la Planta', selector: row => row.estado_planta},
    {name: 'Funcionario', selector: row => row.id_funcionario}
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllSup_Plantas()
  }, [])

  // Crear una función para la consulta
  const getAllSup_Plantas = async () => {
    const response = await apiAxios.get('/api/Sup_Planta') // Se utilizará el apiAxios que tiene la URL del backend
    setSup_Plantas(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  // Buscador por hora (inicio o fin)
  const newListSup_Plantas = Sup_Plantas.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    
    const estado = uso.estado_planta?.toLowerCase() 
    const funcionario = uso.id_funcionario?.toString().toLowerCase() 

    return (
      estado.includes(textToSearch) ||
      funcionario.includes(textToSearch)
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="Sup_Plantas" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListSup_Plantas} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudSup_Plantas