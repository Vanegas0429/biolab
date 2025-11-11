import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudPlantas = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Plantas, setPlantas] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Especie', selector: row => row.especie},
    {name: 'Metodo de Cultivo', selector: row => row.met_cultivo},
    {name: 'Metodo de Propagacion', selector: row => row.met_propagacion},
    {name: 'Planta Contaminada', selector: row => row.plan_contaminadas},
    {name: 'Planta Desarrollada', selector: row => row.plan_desarrolladas},
    {name: 'Numero de Endurecimiento', selector: row => row.numero_endurecimiento}
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllPlantas()
  }, [])

  // Crear una función para la consulta
  const getAllPlantas = async () => {
    const response = await apiAxios.get('/api/Planta') // Se utilizará el apiAxios que tiene la URL del backend
    setPlantas(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  const newListPlantas = Plantas.filter((uso) => {
  const textToSearch = filterText.toLowerCase()

  const especie = uso.especie?.toLowerCase()
  const metCultivo = uso.met_cultivo?.toLowerCase() 
  const planContaminada = uso.plan_contaminadas?.toLowerCase() 
  const planDesarrollada = uso.plan_desarrolladas?.toLowerCase() 

  return (
    especie.includes(textToSearch) ||
    metCultivo.includes(textToSearch) ||
    planContaminada.includes(textToSearch) ||
    planDesarrollada.includes(textToSearch)
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="Plantas" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListPlantas} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudPlantas