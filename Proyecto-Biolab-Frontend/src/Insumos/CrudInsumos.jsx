import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudInsumos = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Insumos, setInsumos] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Nombre', selector: row => row.Nom_Insumo},
    {name: 'Tipo de Insumo', selector: row => row.Tip_Insumo},
    {name: 'Fecha de Vencimineto', selector: row => row.Fec_Vencimiento},

]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllInsumos()
  }, [])

  // Crear una función para la consulta
  const getAllInsumos = async () => {
    const response = await apiAxios.get('/api/Insumo') // Se utilizará el apiAxios que tiene la URL del backend
    setInsumos(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  // Buscador por hora (inicio o fin)
  const newListInsumos = Insumos.filter((uso) => {
    const textToSearch = filterText.toLowerCase()

    const nombre = Insumos.nombres.toLowerCase()
    const tipInsumo = Insumos.tipInsumos.toLowerCase()
    const fecVencimiento = Insumos.fecVencimientos.toLowerCase()
    return (
      nombre.includes(textToSearch) ||
      tipInsumo.includes(textToSearch) ||
      fecVencimiento.includes(textToSearch)
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="Insumos" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListInsumos} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudInsumos