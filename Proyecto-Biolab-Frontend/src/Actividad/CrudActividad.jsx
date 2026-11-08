import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ActividadForm from "./ActividadForm.jsx"
import Swal from "sweetalert2"
import { safeCloseModal } from "../utils/modalHelper.js"

const CrudActividad = () => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [Actividad, setActividad] = useState([])
  const [filterText, setFilterText] = useState("")
  const [loading, setLoading] = useState(true)

  const onViewDetails = (row) => {
    Swal.fire({
      title: `<div class="d-flex align-items-center justify-content-between pb-2 border-bottom w-100 px-2">
        <span class="fw-bold text-primary fs-4 text-start me-3"><i class="fa-solid fa-clipboard-list me-2"></i>Detalles de Actividad</span>
        <span class="status-badge ${row.Estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'} px-3 py-2 rounded-pill fs-6">${row.Estado || 'N/A'}</span>
      </div>`,
      width: '560px',
      showConfirmButton: false,
      showCloseButton: true,
      html: `
        <div class="text-start mt-3 px-1" style="font-size: 0.95rem;">
          <div class="p-3 bg-light rounded-4 border">
            <p class="mb-1 text-muted small fw-semibold"><i class="fa-solid fa-tag me-2 text-primary"></i>NOMBRE DE LA ACTIVIDAD</p>
            <h5 class="fw-bold mb-0 text-dark">${row.Nom_Actividad || 'N/A'}</h5>
          </div>
        </div>
      `,
      customClass: {
        popup: 'rounded-4 border-0 shadow-lg'
      }
    });
  };

  const toggleEstado = async (row) => {
    const estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';
    const isActivar = estadoNuevo === 'Activo';

    const result = await Swal.fire({
      title: isActivar ? '¿Activar actividad?' : '¿Desactivar actividad?',
      html: `
        <p class="mb-2">¿Deseas cambiar el estado de la actividad <strong>"${row.Nom_Actividad}"</strong> a <span class="badge ${isActivar ? 'bg-success' : 'bg-danger'}">${estadoNuevo}</span>?</p>
        <small class="text-muted d-block mt-2">${isActivar ? '✅ La actividad estará disponible para programar prácticas y vincular insumos.' : '⚠️ La actividad no podrá programarse en nuevas prácticas.'}</small>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: isActivar ? '#059669' : '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: isActivar ? '<i class="fa-solid fa-check me-1"></i>Sí, activar' : '<i class="fa-solid fa-ban me-1"></i>Sí, desactivar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: true,
      allowEscapeKey: true
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/Actividad/${row.Id_Actividad}`, { ...row, Estado: estadoNuevo });
      getAllActividad();
      Swal.fire({
        title: isActivar ? '¡Actividad activada!' : '¡Actividad desactivada!',
        text: `La actividad "${row.Nom_Actividad}" ahora se encuentra ${estadoNuevo}.`,
        icon: 'success',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado de la actividad.', 'error');
    }
  };

  const columnsTable = [
    {
      name: 'ACTIVIDAD',
      selector: row => row.Nom_Actividad,
      sortable: true,
      grow: 2,
      minWidth: '280px',
      cell: row => (
        <div className="fw-bold text-dark py-2">
          <i className="fa-solid fa-clipboard-check text-primary me-2"></i>
          {row.Nom_Actividad}
        </div>
      )
    },
    {
      name: 'ESTADO',
      center: true,
      width: '140px',
      cell: row => (
        <span
          className={`status-badge ${row.Estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'}`}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            toggleEstado(row);
          }}
          title="Clic para cambiar estado"
        >
          {row.Estado}
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
  ];

  useEffect(() => {
    getAllActividad()

    // Auto-refresh silencioso en tiempo real (cada 8 segundos) sin interrumpir modales
    const interval = setInterval(() => {
      if (document.body.classList.contains('modal-open') || document.querySelector('.modal.show') || document.querySelector('.swal2-container')) {
        return;
      }
      getAllActividad()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getAllActividad = async () => {
    try {
      const response = await apiAxios.get('/api/Actividad')
      setActividad(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error("Error cargando Actividades:", error)
      setLoading(false)
    }
  }

  const newListActividad = useMemo(() => {
    const textToSearch = filterText.toLowerCase()
    return Actividad.filter((uso) => {
      const Nom_Actividad = uso.Nom_Actividad?.toLowerCase() || ""
      return Nom_Actividad.includes(textToSearch)
    })
  }, [Actividad, filterText])

  const hideModal = () => {
    safeCloseModal('exampleModal');
    setRowToEdit(null);
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
              <i className="fa-solid fa-clipboard-list fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Catálogo de Actividades</h2>
              <p className="text-muted mb-0 small">Administración de actividades operativas y de laboratorio.</p>
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
              placeholder="Buscar actividad..."
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
            <i className="fa-solid fa-plus me-2"></i>Nueva Actividad
          </button>
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM CON DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={columnsTable}
          data={newListActividad}
          keyField="Id_Actividad"
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent={
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-list-check fs-1 mb-3 d-block opacity-25"></i>
              No se encontraron actividades.
            </div>
          }
          conditionalRowStyles={[
            {
              when: row => row.Estado === "Inactivo",
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
                {rowToEdit ? "Editar Actividad" : "Agregar Actividad"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white shadow-none"
                data-bs-dismiss="modal"
                id="closeModal"
              ></button>
            </div>
            <div className="modal-body p-4">
              <ActividadForm
                hideModal={hideModal}
                refreshList={getAllActividad}
                rowToEdit={rowToEdit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CrudActividad
