import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import PracticaForm from "./PracticaForm.jsx"
import Swal from "sweetalert2"

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
      name: 'ESTADO',
      center: true,
      width: '150px',
      cell: row => (
        <span
          className={`status-badge ${row.Estado ? 'status-badge-activo' : 'status-badge-inactivo'}`}
          style={{ cursor: 'pointer' }}
          onClick={() => toggleEstado(row)}
        >
          {row.Estado ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      name: 'ACCIONES',
      center: true,
      width: '120px',
      cell: row => (
        <button
          className="btn-action btn-action-edit mx-auto"
          onClick={() => setRowToEdit(row)}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          title="Editar"
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
    const estadoNuevo = !row.Estado;
    const result = await Swal.fire({
      title: `¿${estadoNuevo ? 'Activar' : 'Inactivar'} práctica?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/Practica/${row.Id_Practica}`, { ...row, Estado: estadoNuevo });
      getAllPracticas();
      Swal.fire({ title: 'Estado actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
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

       {/* Modal */}
        <div className="modal fade" id="exampleModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h1 className="modal-title fs-5">
                  {rowToEdit ? "Editar Practica" : "Agregar Practica"}
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
                  refreshList={getAllPracticas}
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
