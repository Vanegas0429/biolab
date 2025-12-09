import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import PracticaForm from "./PracticaForm.jsx"

const CrudPractica = () => {

  const [Practicas, setPracticas] = useState([])
  const [filterText, setFilterText] = useState("")
  const [rowToEdit, setRowToEdit] = useState([])

  const columnsTable = [
    { name: 'Id_Practica', selector: row => row.Id_Practica },
    { name: 'Solicitante',selector: row => row.Reserva?.Nom_Solicitante || "Sin dato"},
    { name: 'Tipo Reserva',selector: row => row.Reserva?.Tip_Reserva || "Sin dato"},
    { name: 'Fecha',selector: row => row.Reserva?.Fec_Reserva || "Sin fecha"},
    { name: 'Hora',selector: row => row.Reserva?.Hor_Reserva || "Sin hora"},
    { name: 'Acciones', selector: row => (
        <button 
        className="btn btn-sm bg-info"
        onClick={() => setRowToEdit(row)}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal">
        <i className="fa-solid fa-pencil"></i>
        </button>
      )
    }
  ];


  useEffect(() => {
    getAllPracticas()
  }, [])

  const getAllPracticas = async () => {
    try {
      const response = await apiAxios.get('/api/Practica?include=Reserva')
      setPracticas(response.data)
    } catch (error) {
      console.error("Error cargando prácticas:", error)
    }
  }

  const newListPracticas = Practicas.filter((uso) => {
    const txt = filterText.toLowerCase()
    const solicitante = uso.Reserva?.Nom_Solicitante?.toLowerCase() ?? ""
    return solicitante.includes(txt)
  })

  const hideModal = () => {
    document.getElementById('closeModal').click()
  }

  return (
    <>
      <div className="container mt-5">

        <div className="row d-flex justify-content-between">
          <div className="col-4">
            <input
              className="form-control"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <div className="col-2">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              id="closeModal"
            >
              Nuevo
            </button>
          </div>
        </div>

        <DataTable
          title="Practica"
          columns={columnsTable}
          data={newListPracticas}
          keyField="Id_Practica"
          pagination
          highlightOnHover
          striped
        />

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Agregar Practica</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeModal"></button>
              </div>
              <div className="modal-body">
                <PracticaForm hideModal={hideModal} rowToEdit={rowToEdit}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CrudPractica
