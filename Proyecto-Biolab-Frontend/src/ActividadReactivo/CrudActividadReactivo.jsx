import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ActividadReactivoForm from "./ActividadReactivoForm.jsx"

const CrudActividadReactivo = () => {

  const [rowToEdit, setRowToEdit] = useState(null)
  const [ActividadReactivo, setActividadReactivo] = useState([])
  const [filterText, setFilterText] = useState("")
  
  // Estados para el modal de detalle de reactivos
  const [selectedActivity, setSelectedActivity] = useState(null)

  // 🔹 Alternar Activo/Inactivo
  const toggleEstado = async (row) => {
    let estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo'

    try {
      await apiAxios.put(`/api/ActividadReactivo/${row.Id_ActividadReactivo}`, {
        ...row,
        Estado: estadoNuevo
      });

      getAllActividadReactivo();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // 🔹 Lógica de Agrupación
  const groupedData = useMemo(() => {
    const groups = {};
    
    ActividadReactivo.forEach(item => {
      const actId = item.Id_Actividad;
      if (!groups[actId]) {
        groups[actId] = {
          ...item,
          reactivosList: []
        };
      }
      groups[actId].reactivosList.push({
        Id_ActividadReactivo: item.Id_ActividadReactivo,
        Id_Reactivo: item.Id_Reactivo,
        nombre: item.reactivos?.Nom_reactivo || item.Reactivo?.Nom_reactivo || 'Reactivo Desconocido',
        Estado: item.Estado
      });
    });

    return Object.values(groups);
  }, [ActividadReactivo]);

  // 🔹 Buscador sobre datos agrupados
  const filteredData = groupedData.filter((item) => {
    const text = filterText.toLowerCase();
    const activityName = (item.actividades?.Nom_Actividad || item.Actividad?.Nom_Actividad || "").toLowerCase();
    return (
      activityName.includes(text) ||
      item.reactivosList.some(r => r.nombre?.toLowerCase().includes(text))
    );
  });

  // 🔹 Columnas
  const columnsTable = [
    { 
        name: 'Actividad', 
        selector: row => row.actividades?.Nom_Actividad || row.Actividad?.Nom_Actividad || 'Actividad no asignada',
        sortable: true,
        grow: 2
    },
    { 
      name: 'Reactivos', 
      cell: row => (
        <button 
          className="btn btn-sm btn-outline-primary fw-bold"
          data-bs-toggle="modal" 
          data-bs-target="#reactivosListModal"
          onClick={() => setSelectedActivity(row)}
        >
          <i className="fa-solid fa-flask-vial me-2"></i>
          {row.reactivosList?.length || 0} {row.reactivosList?.length === 1 ? 'Reactivo' : 'Reactivos'}
        </button>
      )
    },
    {
      name: 'Estado',
      cell: row => (
        <button
          className={`btn btn-sm ${row.Estado === 'Activo' ? 'btn-success' : 'btn-danger'}`}
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
    getAllActividadReactivo()
  }, [])

  const getAllActividadReactivo = async () => {
    try {
        const response = await apiAxios.get('/api/ActividadReactivo')
        setActividadReactivo(response.data || [])
    } catch (error) {
        console.error("Error cargando Actividad-Reactivo:", error)
    }
  }

  const hideModal = () => {
    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) closeBtn.click();
    getAllActividadReactivo()
  }

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-5" style={{ paddingTop: '2rem' }}>

        <div className="row d-flex justify-content-between align-items-center mb-4 gap-3 gap-md-0">
          <div className="col-12 col-md-6 col-lg-4">
            <input
              className="form-control shadow-sm"
              placeholder="Buscar actividad o reactivo..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
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
              Agregar Actividad-Reactivo
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
                  {rowToEdit ? "Editar Actividad-Reactivo" : "Agregar Actividad-Reactivo"}
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
                <ActividadReactivoForm
                  hideModal={hideModal}
                  refreshList={getAllActividadReactivo}
                  rowToEdit={rowToEdit}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Lista de Reactivos */}
        <div className="modal fade" id="reactivosListModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="fa-solid fa-list-check me-2"></i>
                  Reactivos: {selectedActivity?.actividades?.Nom_Actividad || selectedActivity?.Actividad?.Nom_Actividad || 'Actividad'}
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
                  {selectedActivity?.reactivosList?.map((r, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <i className="fa-solid fa-flask-vial text-primary"></i>
                        </div>
                        <span className="fw-semibold text-dark">{r.nombre}</span>
                      </div>
                      <span className={`badge rounded-pill ${r.Estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                        {r.Estado}
                      </span>
                    </div>
                  ))}
                  {(!selectedActivity?.reactivosList || selectedActivity.reactivosList.length === 0) && (
                    <div className="p-4 text-center text-muted">
                        No hay reactivos vinculados a esta actividad.
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0 bg-light">
                <button type="button" className="btn btn-secondary px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#reactivosListModal">
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

export default CrudActividadReactivo