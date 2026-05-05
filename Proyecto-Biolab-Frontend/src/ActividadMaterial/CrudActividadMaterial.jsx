import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ActividadMaterialForm from "./ActividadMaterialForm.jsx"

const CrudActividadMaterial = () => {

  const [rowToEdit, setRowToEdit] = useState(null)
  const [ActividadMaterial, setActividadMaterial] = useState([])
  const [filterText, setFilterText] = useState("")
  
  // Estados para el modal de detalle de materiales
  const [selectedActivity, setSelectedActivity] = useState(null)

  // 🔹 Alternar Activo/Inactivo
  const toggleEstado = async (row) => {
    let estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo'

    try {
      await apiAxios.put(`/api/ActividadMaterial/${row.Id_ActividadMaterial}`, {
        ...row,
        Estado: estadoNuevo
      });

      getAllActividadMaterial();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // 🔹 Lógica de Agrupación
  const groupedData = useMemo(() => {
    const groups = {};
    
    ActividadMaterial.forEach(item => {
      const actId = item.Id_Actividad;
      if (!groups[actId]) {
        groups[actId] = {
          ...item,
          materialesList: []
        };
      }
      groups[actId].materialesList.push({
        Id_ActividadMaterial: item.Id_ActividadMaterial,
        Id_Material: item.Id_Material,
        nombre: item.Material?.Nom_Material || 'Material Desconocido',
        Estado: item.Estado
      });
    });

    return Object.values(groups);
  }, [ActividadMaterial]);

  // 🔹 Buscador sobre datos agrupados
  const filteredData = groupedData.filter((item) => {
    const text = filterText.toLowerCase();
    const activityName = (item.actividad?.Nom_Actividad || item.Actividad?.Nom_Actividad || "").toLowerCase();
    return (
      activityName.includes(text) ||
      item.materialesList.some(m => m.nombre?.toLowerCase().includes(text))
    );
  });

  // 🔹 Columnas
  const columnsTable = [
    { 
        name: 'Actividad', 
        selector: row => row.actividad?.Nom_Actividad || row.Actividad?.Nom_Actividad || 'Actividad no asignada',
        sortable: true,
        grow: 2
    },
    { 
      name: 'Materiales', 
      cell: row => (
        <button 
          className="btn btn-sm btn-outline-primary fw-bold"
          data-bs-toggle="modal" 
          data-bs-target="#materialesListModal"
          onClick={() => setSelectedActivity(row)}
        >
          <i className="fa-solid fa-box-archive me-2"></i>
          {row.materialesList?.length || 0} {row.materialesList?.length === 1 ? 'Material' : 'Materiales'}
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
    getAllActividadMaterial()
  }, [])

  const getAllActividadMaterial = async () => {
    try {
        const response = await apiAxios.get('/api/ActividadMaterial')
        setActividadMaterial(response.data || [])
    } catch (error) {
        console.error("Error cargando Actividad-Material:", error)
    }
  }

  const hideModal = () => {
    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) closeBtn.click();
    getAllActividadMaterial()
  }

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-5" style={{ paddingTop: '2rem' }}>

        <div className="row d-flex justify-content-between align-items-center mb-4 gap-3 gap-md-0">
          <div className="col-12 col-md-6 col-lg-4">
            <input
              className="form-control shadow-sm"
              placeholder="Buscar actividad o material..."
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
              Agregar Actividad-Material
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
                  {rowToEdit ? "Editar Actividad-Material" : "Agregar Actividad-Material"}
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
                <ActividadMaterialForm
                  hideModal={hideModal}
                  refreshList={getAllActividadMaterial}
                  rowToEdit={rowToEdit}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Lista de Materiales */}
        <div className="modal fade" id="materialesListModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="fa-solid fa-list-check me-2"></i>
                  Materiales: {selectedActivity?.actividad?.Nom_Actividad || selectedActivity?.Actividad?.Nom_Actividad || 'Actividad'}
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
                  {selectedActivity?.materialesList?.map((m, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <i className="fa-solid fa-box-archive text-primary"></i>
                        </div>
                        <span className="fw-semibold text-dark">{m.nombre}</span>
                      </div>
                      <span className={`badge rounded-pill ${m.Estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                        {m.Estado}
                      </span>
                    </div>
                  ))}
                  {(!selectedActivity?.materialesList || selectedActivity.materialesList.length === 0) && (
                    <div className="p-4 text-center text-muted">
                        No hay materiales vinculados a esta actividad.
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0 bg-light">
                <button type="button" className="btn btn-secondary px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#materialesListModal">
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

export default CrudActividadMaterial