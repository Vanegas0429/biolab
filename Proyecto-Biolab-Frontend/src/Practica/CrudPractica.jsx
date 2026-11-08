import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import PracticaForm from "./PracticaForm.jsx"
import Swal from "sweetalert2"
import { safeCloseModal } from "../utils/modalHelper.js"

const CrudPractica = () => {
  const [Practicas, setPracticas] = useState([])
  const [filterText, setFilterText] = useState("")
  const [rowToEdit, setRowToEdit] = useState(null)
  const [loading, setLoading] = useState(true)

  const onViewDetails = (row) => {
    Swal.fire({
      title: `<div class="d-flex align-items-center justify-content-between pb-2 border-bottom w-100 px-2">
        <span class="fw-bold text-primary fs-4 text-start me-3"><i class="fa-solid fa-graduation-cap me-2"></i>Detalles de Práctica</span>
        <span class="status-badge ${row.Estado ? 'status-badge-activo' : 'status-badge-inactivo'} px-3 py-2 rounded-pill fs-6">${row.Estado ? 'Activo' : 'Inactivo'}</span>
      </div>`,
      width: '600px',
      showConfirmButton: false,
      showCloseButton: true,
      html: `
        <div class="text-start mt-3 px-1" style="font-size: 0.95rem;">
          <div class="row g-3 mb-3 bg-light p-3 rounded-4 mx-0 shadow-sm border">
            <div class="col-12">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-user me-2 text-primary"></i>SOLICITANTE</p>
              <h6 class="fw-bold mb-0 text-dark">${row.Reserva?.Nom_Solicitante || 'N/A'}</h6>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-tag me-2 text-primary"></i>TIPO RESERVA</p>
              <p class="fw-semibold mb-0 text-dark">${row.Reserva?.Tip_Reserva || 'N/A'}</p>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-id-card me-2 text-primary"></i>FICHA</p>
              <p class="fw-semibold mb-0 text-dark">${row.Reserva?.Num_Ficha || 'N/A'}</p>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-regular fa-calendar me-2 text-primary"></i>FECHA</p>
              <p class="fw-semibold mb-0 text-dark">${row.Reserva?.Fec_Reserva || 'N/A'}</p>
            </div>
            <div class="col-6">
              <p class="mb-1 text-muted small fw-semibold"><i class="fa-regular fa-clock me-2 text-primary"></i>HORA</p>
              <p class="fw-semibold mb-0 text-dark">${row.Reserva?.Hor_Reserva || 'N/A'}</p>
            </div>
          </div>
        </div>
      `,
      customClass: {
        popup: 'rounded-4 border-0 shadow-lg'
      }
    });
  };

  const columnsTable = [
    {
      name: 'SOLICITANTE',
      sortable: true,
      grow: 2,
      minWidth: '220px',
      cell: row => (
        <div className="py-2">
          <div className="fw-bold text-dark">{row.Reserva?.Nom_Solicitante || 'N/A'}</div>
          {row.Reserva?.Num_Ficha && (
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              Ficha: {row.Reserva.Num_Ficha}
            </small>
          )}
        </div>
      )
    },
    {
      name: 'TIPO RESERVA',
      selector: row => row.Reserva?.Tip_Reserva || 'N/A',
      sortable: true,
      grow: 1,
      minWidth: '150px'
    },
    {
      name: 'FECHA Y HORA',
      sortable: true,
      grow: 1,
      minWidth: '160px',
      cell: row => (
        <div className="py-1">
          <div className="fw-semibold text-dark small">
            <i className="fa-regular fa-calendar me-1 text-primary"></i>
            {row.Reserva?.Fec_Reserva || 'N/A'}
          </div>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            <i className="fa-regular fa-clock me-1 text-secondary"></i>
            {row.Reserva?.Hor_Reserva || 'N/A'}
          </small>
        </div>
      )
    },
    {
      name: 'ESTADO',
      center: true,
      width: '140px',
      cell: row => (
        <span
          className={`status-badge ${row.Estado ? 'status-badge-activo' : 'status-badge-inactivo'}`}
          style={{ cursor: 'pointer' }}
          onClick={() => toggleEstado(row)}
          title="Clic para cambiar estado"
        >
          {row.Estado ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      name: 'ACCIONES',
      center: true,
      width: '130px',
      cell: row => (
        <div className="d-flex gap-1 justify-content-center">
          <button
            type="button"
            className="btn-action btn-action-view"
            onClick={() => onViewDetails(row)}
            title="Ver detalles"
          >
            <i className="fa-solid fa-eye"></i>
          </button>
          <button
            className="btn-action btn-action-edit"
            onClick={() => setRowToEdit(row)}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            title="Editar"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>
        </div>
      )
    }
  ]

  useEffect(() => {
    getAllPracticas()

    // Auto-refresh silencioso en tiempo real (cada 8 segundos) sin interrumpir modales
    const interval = setInterval(() => {
      if (document.body.classList.contains('modal-open') || document.querySelector('.modal.show') || document.querySelector('.swal2-container')) {
        return;
      }
      getAllPracticas()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getAllPracticas = async () => {
    try {
      const response = await apiAxios.get('/api/Practica?include=Reserva')
      setPracticas(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error("Error cargando prácticas:", error)
      setLoading(false)
    }
  }

  const newListPracticas = useMemo(() => {
    const text = filterText.toLowerCase()
    return Practicas.filter(uso =>
      (uso.Reserva?.Nom_Solicitante || '').toLowerCase().includes(text) ||
      (uso.Reserva?.Tip_Reserva || '').toLowerCase().includes(text) ||
      (uso.Reserva?.Fec_Reserva || '').toLowerCase().includes(text)
    )
  }, [Practicas, filterText])

  const hideModal = () => {
    safeCloseModal('exampleModal');
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

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  )

  return (
    <div className="container-fluid py-4 fade-in">
      {/* HEADER */}
      <div className="row mb-4 align-items-center g-3">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '50px', height: '50px' }}>
              <i className="fa-solid fa-graduation-cap fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Prácticas de Laboratorio</h2>
              <p className="text-muted mb-0 small">Seguimiento y registro de actividades formativas y prácticas.</p>
            </div>
          </div>
        </div>
        <div className="col-md-auto d-flex gap-2">
          <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border" style={{ width: '300px' }}>
            <span className="input-group-text border-0 bg-transparent ps-3">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 py-2 shadow-none bg-transparent"
              placeholder="Buscar práctica..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => setRowToEdit(null)}
          >
            <i className="fa-solid fa-plus me-2"></i>Nueva Práctica
          </button>
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM CON DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={columnsTable}
          data={newListPracticas}
          keyField="Id_Practica"
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent={
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-folder-open fs-1 mb-3 d-block opacity-25"></i>
              No se encontraron prácticas registradas.
            </div>
          }
          conditionalRowStyles={[
            {
              when: row => !row.Estado,
              style: {
                backgroundColor: "#f8fafc",
                color: "#94a3b8",
                opacity: 0.8
              }
            }
          ]}
        />
      </div>

      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                {rowToEdit ? "Editar Práctica" : "Agregar Práctica"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white shadow-none"
                data-bs-dismiss="modal"
                id="closeModal"
              ></button>
            </div>
            <div className="modal-body p-4">
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
  )
}

export default CrudPractica
