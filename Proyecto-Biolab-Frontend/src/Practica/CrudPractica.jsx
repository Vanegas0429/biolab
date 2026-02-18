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
    { name: 'Solicitante', selector: row => row.Reserva?.Nom_Solicitante },
    { name: 'Tipo Reserva', selector: row => row.Reserva?.Tip_Reserva },
    { name: 'Fecha', selector: row => row.Reserva?.Fec_Reserva },
    { name: 'Hora', selector: row => row.Reserva?.Hor_Reserva },
    {
      name: 'Estado',
      cell: row => (
        <button
          className={`btn btn-sm ${row.Estado ? 'btn-success' : 'btn-danger'}`}
          onClick={() => toggleEstado(row)}
        >
          {row.Estado ? 'Activo' : 'Inactivo'}
        </button>
      )
    },
    {
      name: 'Acciones',
      selector: row => (
        <button
          className="btn btn-sm bg-info"
          onClick={() => setRowToEdit(row)}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <i className="fa-solid fa-pencil"></i>
        </button>
      )
    }
  ]

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

  const newListPracticas = Practicas.filter(uso =>
  uso.Reserva?.Nom_Solicitante?.toLowerCase().includes(filterText.toLowerCase()) ||
  uso.Reserva?.Tip_Reserva?.toLowerCase().includes(filterText.toLowerCase()) ||
  uso.Reserva?.Fec_Reserva?.toLowerCase().includes(filterText.toLowerCase())
)


  const hideModal = () => {
    document.getElementById('closeModal').click()
  }

  const toggleEstado = async (row) => {
    try {
      await apiAxios.put(`/api/Practica/${row.Id_Practica}`, {
        ...row,
        Estado: !row.Estado
      })

      getAllPracticas() // Recargar tabla
    } catch (error) {
      console.error("Error actualizando estado:", error)
    }
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
              Agregar Practica
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
          conditionalRowStyles={[
            {
              when: row => row.Estado,
              style: {
                backgroundColor: "#ffffff",
                color: "#000000"
              }
            },
            {
              when: row => !row.Estado,
              style: {
                backgroundColor: "#aeadad",
                color: "#6c757d"
              }
            }
          ]}

        />

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">
                  Agregar Practica
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>
              <div className="modal-body">
                <PracticaForm
                  hideModal={hideModal}
                  rowToEdit={rowToEdit}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default CrudPractica
