import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ActividadEquipoForm from "./ActividadEquipoForm.jsx"

const CrudActividadEquipo = () => {

  const [rowToEdit, setRowToEdit] = useState(null)
  const [ActividadEquipo, setActividadEquipo] = useState([])
  const [filterText, setFilterText] = useState("")
  
  // Estados para el modal de detalle de equipos
  const [selectedActivity, setSelectedActivity] = useState(null)

  // 🔹 Alternar Activo/Inactivo
  const toggleEstado = async (row) => {
    let estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo'

    try {
      // Si es un registro agrupado, podríamos querer cambiar el estado de todos? 
      // Por ahora mantenemos la lógica individual si es necesario, 
      // pero el usuario pidió agrupar. Usaremos el ID del primer registro del grupo.
      await apiAxios.put(`/api/ActividadEquipo/${row.Id_ActividadEquipo}`, {
        ...row,
        Estado: estadoNuevo
      });

      getAllActividadEquipo();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // 🔹 Lógica de Agrupación
  const groupedData = useMemo(() => {
    const groups = {};
    
    ActividadEquipo.forEach(item => {
      const actId = item.Id_Actividad;
      if (!groups[actId]) {
        groups[actId] = {
          ...item,
          equiposList: []
        };
      }
      groups[actId].equiposList.push({
        Id_ActividadEquipo: item.Id_ActividadEquipo,
        id_equipo: item.id_equipo,
        nombre: item.Equipo?.nombre,
        Estado: item.Estado
      });
    });

    return Object.values(groups);
  }, [ActividadEquipo]);

  // 🔹 Buscador sobre datos agrupados
  const filteredData = groupedData.filter((item) => {
    const text = filterText.toLowerCase();
    return (
      item.Actividad?.Nom_Actividad.toLowerCase().includes(text) ||
      item.equiposList.some(e => e.nombre?.toLowerCase().includes(text))
    );
  });

  // 🔹 Columnas
  const columnsTable = [
    { 
        name: 'Actividad', 
        selector: row => row.Actividad?.Nom_Actividad,
        sortable: true,
        grow: 2
    },
    { 
      name: 'Equipos', 
      cell: row => (
        <button 
          className="btn btn-sm btn-outline-primary fw-bold"
          data-bs-toggle="modal" 
          data-bs-target="#equiposListModal"
          onClick={() => setSelectedActivity(row)}
        >
          <i className="fa-solid fa-microscope me-2"></i>
          {row.equiposList.length} {row.equiposList.length === 1 ? 'Equipo' : 'Equipos'}
        </button>
      )
    },
    {
      name: 'Estado',
      cell: row => (
        <button
          className={`btn btn-sm ${row.Estado =='Activo' ? 'btn-success' : 'btn-danger'}`}
          onClick={() => toggleEstado(row)}
        >
          {row.Estado}
        </button>
      )
    },
    {
      name: 'Acciones',
      cell: row => (
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

  // 🔹 Cargar datos
  useEffect(() => {
    getAllActividadEquipo()
  }, [])

  const getAllActividadEquipo = async () => {
    try {
        const response = await apiAxios.get('/api/ActividadEquipo')
        setActividadEquipo(response.data)
    } catch (error) {
        console.error("Error cargando Actividad-Equipo:", error)
    }
  }

  const hideModal = () => {
    const closeBtn = document.getElementById('closeModal')
    if (closeBtn) closeBtn.click()
    getAllActividadEquipo()
  }

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-5" style={{ paddingTop: '2rem' }}>

        <div className="row d-flex justify-content-between align-items-center mb-4 gap-3 gap-md-0">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                    <i className="fa-solid fa-magnifying-glass text-muted"></i>
                </span>
                <input
                    className="form-control border-start-0 ps-0"
                    placeholder="Buscar actividad o equipo..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>
          </div>

          <div className="col-12 col-md-auto text-md-end text-center">
            <button
              type="button"
              className="btn btn-primary px-4 shadow-sm fw-bold"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => setRowToEdit(null)}
            >
              <i className="fa-solid fa-plus me-2"></i>
              Agregar Actividad-Equipo
            </button>
          </div>
        </div>

        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
            <DataTable
                columns={columnsTable}
                data={filteredData}
                keyField="Id_Actividad"
                pagination
                highlightOnHover
                responsive
                noDataComponent={<div className="p-4">No se encontraron registros</div>}
                customStyles={{
                    header: { style: { minHeight: '56px' } },
                    headRow: {
                        style: {
                            backgroundColor: '#f8f9fa',
                            borderTopStyle: 'solid',
                            borderTopWidth: '1px',
                            borderTopColor: '#dee2e6',
                        },
                    },
                    headCells: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            color: '#495057',
                            textTransform: 'uppercase'
                        },
                    },
                    cells: {
                        style: {
                            fontSize: '0.9rem',
                        },
                    },
                }}
            />
        </div>

        {/* Modal Formulario (Agregar/Editar) */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light">
                <h1 className="modal-title fs-5 fw-bold">
                  {rowToEdit ? "Editar Actividad-Equipo" : "Agregar Actividad-Equipo"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <ActividadEquipoForm
                  hideModal={hideModal}
                  refreshList={getAllActividadEquipo}
                  rowToEdit={rowToEdit}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Lista de Equipos */}
        <div className="modal fade" id="equiposListModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="fa-solid fa-list-check me-2"></i>
                  Equipos: {selectedActivity?.Actividad?.Nom_Actividad}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="list-group list-group-flush">
                  {selectedActivity?.equiposList.map((eq, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <i className="fa-solid fa-microscope text-primary"></i>
                        </div>
                        <span className="fw-semibold text-dark">{eq.nombre}</span>
                      </div>
                      <span className={`badge rounded-pill ${eq.Estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                        {eq.Estado}
                      </span>
                    </div>
                  ))}
                  {selectedActivity?.equiposList.length === 0 && (
                    <div className="p-4 text-center text-muted">
                        No hay equipos vinculados a esta actividad.
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0 bg-light">
                <button type="button" className="btn btn-secondary px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#equiposListModal">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default CrudActividadEquipo