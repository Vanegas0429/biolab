import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudReserva = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Reserva, setReserva] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Id_Reserva', selector: row => row.Id_Reserva},
    {name: 'Tip_Reserva', selector: row => row.Tip_Reserva},
    {name: 'Nom_Solicitante', selector: row => row.Nom_Solicitante},
    {name: 'Doc_Solicitante', selector: row => row.Doc_Solicitante},
    {name: 'Tel_Solicitante', selector: row => row.Tel_Solicitante},
    {name: 'Cor_Solicitante', selector: row => row.Cor_Solicitante},
    {name: 'Can_Aprendices', selector: row => row.Can_Aprendices},
    {name: 'Fec_Reserva', selector: row => row.Fec_Reserva},
    {name: 'Hor_Reserva', selector: row => row.Hor_Reserva},
    {name: 'Num_Ficha', selector: row => row.Num_Ficha}
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllReserva()
  }, [])

  // Crear una función para la consulta
  const getAllReserva = async () => {
    const response = await apiAxios.get('/api/Reserva') // Se utilizará el apiAxios que tiene la URL del backend
    setReserva(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  // Buscador por Tip_Reserva y Nom_Solicitante
  const newListReserva = Reserva.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    return (
      String(uso.Doc_Solicitante).toLowerCase().includes(textToSearch) ||
      uso.Nom_Solicitante?.toLowerCase().includes(textToSearch) ||
      String(uso.Num_Ficha).toLowerCase().includes(textToSearch) ||
      String(uso.Fec_Reserva).toLowerCase().includes(textToSearch)
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="Reserva" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListReserva} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudReserva