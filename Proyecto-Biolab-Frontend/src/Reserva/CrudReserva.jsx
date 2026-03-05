import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudReserva = () => {

  const [Reserva, setReserva] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [
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

  useEffect(() => {
    getAllReserva()
  }, [])


  const Usuario = JSON.parse(localStorage.getItem("UsuarioLaboratorio"))

  const getAllReserva = async () => {
    const response = await apiAxios.get('/api/Reserva',{
      headers:{
        Authorization: `Bearer ${Usuario.token}`
      }
    })
    setReserva(response.data)
    console.log(response.data)
  }

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
          <input 
            className="form-control" 
            value={filterText} 
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <DataTable
          title="Reserva"
          columns={columnsTable}
          data={newListReserva}
          keyField="id"
          pagination
          highlightOnHover
          striped
        />
      </div>
    </>
  )
}

export default CrudReserva