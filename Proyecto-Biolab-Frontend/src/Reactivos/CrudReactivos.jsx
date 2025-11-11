import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudReactivos = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Reactivos, setReactivos] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Nombre', selector: row => row.Nom_Reactivo},
    {name: 'Nomenclatura', selector: row => row.Nomenclatura },
    {name: 'Unidad de Medida', selector: row => row.Uni_Medida},
    {name: 'Cantidad', selector: row => row.Cantidad},
    {name: 'Concentracion', selector: row => row.Concentración},
    {name: 'Marca', selector: row => row.Marca},
    {name: 'Fecha de Vencimiento', selector: row => row.Fec_Vencimiento},
    {name: 'Funcion Quimica', selector: row => row.Fun_Química},
    {name: 'Estado Fisico', selector: row => row.Est_Fisico},
    {name: 'Naturaleza Quimica', selector: row => row.Nat_Quimica},
    {name: 'Clasificacion', selector: row => row.Clasificación},
    {name: 'Peligrosidad', selector: row => row.Peligrosidad},
    {name: 'Clasificacion de Peligro', selector: row => row.Cla_Peligro},
    {name: 'Ficha Datos Seguridad', selector: row => row.Fic_Dat_Seguridad},
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllReactivos()
  }, [])

  // Crear una función para la consulta
  const getAllReactivos = async () => {
    const response = await apiAxios.get('/api/Reactivo') // Se utilizará el apiAxios que tiene la URL del backend
    setReactivos(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  const newListReactivos = Reactivos.filter((r) => {
    const textToSearch = filterText.toLowerCase()

    const nombre = r.Nom_Reactivo?.toLowerCase() 
    const marca = r.Marca?.toLowerCase() 
    const cantidad = r.cantidad?.toLowerCase() 
    const fecha = r.fecha?.toLowerCase()
    const estado = r.estado?.toLowerCase()
    const ficha = r.ficha?.toLowerCase()

    return (
      nombre.includes(textToSearch) ||
      marca.includes(textToSearch) ||
      cantidad.includes(textToSearch) ||
      fecha.includes(textToSearch) ||
      estado.includes(textToSearch) ||
      ficha.includes(textToSearch)
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control"  value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="Reactivos" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListReactivos} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudReactivos