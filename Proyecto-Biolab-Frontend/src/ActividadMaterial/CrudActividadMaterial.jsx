import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ActividadMaterialForm from "./ActividadMaterialForm.jsx"

const CrudActividadMaterial = () => {

  const [rowToEdit, setRowToEdit] = useState(null)
  const [ActividadMaterial, setActividadMaterial] = useState([])
  const [filterText, setFilterText] = useState("")

  // 🔹 Alternar Activo/Inactivo
  const toggleEstado = async (row) => {

    console.log(row.Estado)

    let estadoNuevo = ''

    if(row.Estado === 'Activo'){

      estadoNuevo = 'Inactivo'

    }else{
      estadoNuevo = 'Activo'
    }

    console.log(estadoNuevo)
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

  // 🔹 Columnas
  const columnsTable = [
    { name: 'Id_ActvidadMaterial', selector: row => row.Id_ActividadMaterial },
    { name: 'Actividad', selector: row => row.actividad?.Nom_Actividad },
    { name: 'Material', selector: row => row.Material?.Nom_Material },
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

  // 🔹 Cargar datos
  useEffect(() => {
    getAllActividadMaterial()
  }, [])

  const getAllActividadMaterial = async () => {
    const response = await apiAxios.get('/api/ActividadMaterial')
    setActividadMaterial(response.data)
  }

  // 🔹 Buscador
  const newListActividadMaterial = ActividadMaterial.filter((sup) => {
    const text = filterText.toLowerCase();
    return (
      sup.actividad?.Nom_Actividad.toLowerCase().includes(text) ||
      sup.Material?.Nom_Material.toLowerCase().includes(text) 
    );
  });

  const hideModal = () => {
    document.getElementById('closeModal').click()
    getAllActividadMaterial()
  }

  return (
    <>
      <div className="container mt-5">

        <div className="row d-flex justify-content-between">
          <div className="col-4">
            <input
              className="form-control"
              placeholder="Buscar"
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
              onClick={() => setRowToEdit(null)}
            >
              Agregar Actividad-Material
            </button>
          </div>
        </div>

        <DataTable
          title="Actividad-Material"
          columns={columnsTable}
          data={newListActividadMaterial}
          keyField="Id_ActvidadMaterial"
          pagination
          highlightOnHover
          striped
          conditionalRowStyles={[
            {
              when: row => row.Estado === "Activo",
              style: {
                backgroundColor: "#ffffff",
                color: "#000000"
              }
            },
            {
              when: row => row.Estado === "Inactivo",
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
                  {rowToEdit ? "Editar Actividad-Material" : "Agregar Actividad-Material"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>

              <div className="modal-body">
                <ActividadMaterialForm
                  hideModal={hideModal}
                  refreshList={getAllActividadMaterial}
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

export default CrudActividadMaterial