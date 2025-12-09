import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ReservaForm from "./ReservaForm.jsx"

const CrudReserva = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Reservas, setReservas] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Id_Reserva', selector: row => row.Id_Reserva},
    {name: 'Tipo Reserva', selector: row => row.Tip_Reserva},
    {name: 'Nombre Solicitante', selector: row => row.Nom_Solicitante},
    {name: 'Documento', selector: row => row.Doc_Solicitante},
    {name: 'Telefono', selector: row => row.Tel_Solicitante},
    {name: 'Correo', selector: row => row.Cor_Solicitante},
    {name: 'Cantidad de Aprendices', selector: row => row.Can_Aprendices},
    {name: 'Ficha', selector: row => row.Num_Ficha},
    {name: 'Fecha Reserva', selector: row => row.Fec_Reserva},
    {name: 'Hora Reserva', selector: row => row.Hor_Reserva},
    {name: 'Acciones', selector: row => (
        <button className="btn btn-sm bg-info"><i className="fa-solid fa-pencil"></i></button>
    )}
]   

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllReservas()
  }, [])

  // Crear una función para la consulta
  const getAllReservas = async () => {
    const response = await apiAxios.get('/api/Reserva') // Se utilizará el apiAxios que tiene la URL del backend
    setReservas(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador

  const newListReservas = Reservas.filter((uso) => {
  const textToSearch = filterText.toLowerCase()

  const fecha = uso.Fec_Reserva?.toLowerCase()  
  const tip_reserva = uso.Tip_Reserva?.toLowerCase() 

  return (
    fecha.includes(textToSearch) ||
    tip_reserva.includes(textToSearch) 
    )

  })

  const hideModal = () => {

    document.getElementById('closeModal').click()
  }

return (
    <>
      <div className="container mt-5">

        <div className="row d-flex justify-content-between">
          <div className="col-4">
            <input className="form-control" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
          <div className="col-2">
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="closeModal">
              Nuevo
            </button>
          </div>
        </div>
        <DataTable
          title="Reservas" //Titulo de la tabla
          columns={columnsTable} //Columns de la tabla
          data={newListReservas} //Fuente de los datos
          keyField="id" //Identficador de cada registro
          pagination //Activar paginacion
          highlightOnHover //Resalta la fila por donde pase el mouse
          striped //Estilo de tabla - tono en filas intercaladas
        />

        {/* <!-- Modal --> */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar Practica</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close" id="closeModal"></button>
              </div>
              <div className="modal-body">
                <ReservaForm hideModal={hideModal} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CrudReserva