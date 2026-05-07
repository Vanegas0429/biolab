import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ProduccionForm from "./ProduccionForm.jsx"

const CrudProduccion = () => {

  const [rowToEdit, setRowToEdit] = useState(null)
  const [Produccion, setProduccion] = useState([])
  const [filterText, setFilterText] = useState("")
  const [isViewOnly, setIsViewOnly] = useState(false)

  // 🔹 Alternar Activo/Inactivo
  const toggleEstado = async (row) => {

    console.log(row.Estado)

    let estadoNuevo = ''

    if (row.Estado === 'Activo') {

      estadoNuevo = 'Inactivo'

    } else {
      estadoNuevo = 'Activo'
    }

    console.log(estadoNuevo)
    try {
      await apiAxios.put(`/api/Produccion/${row.Id_produccion}`, {
        ...row,
        Estado: estadoNuevo
      });

      getAllProduccion();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // 🔹 Columnas
  const columnsTable = [
    { name: 'ID', selector: row => row.Id_produccion },
    { name: 'Especie', selector: row => row.Especie?.Nom_especie },
    { name: 'Lote', selector: row => row.Lote },
    { name: 'Tipo de Produccion', selector: row => row.Tip_produccion },
    { name: 'Fecha de Produccion', selector: row => row.Fec_produccion },
    {
      name: 'Estado',
      cell: row => (
        <button
          className={`btn btn-sm ${row.Estado == 'Activo' ? 'btn-success' : 'btn-danger'}`}
          onClick={() => toggleEstado(row)}
        >
          {row.Estado}
        </button>
      )
    },
    {
      name: 'Acciones',
      selector: row => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm bg-info"
            onClick={() => { setRowToEdit(row); setIsViewOnly(false); }}
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

  // 🔹 Cargar datos
  useEffect(() => {
    getAllProduccion()
  }, [])

  const getAllProduccion = async () => {
    const response = await apiAxios.get('/api/Produccion')
    setProduccion(response.data)
  }

  // 🔹 Buscador
  const newListProduccion = Produccion.filter((sup) => {
    const text = filterText.toLowerCase();
    return (
      sup.Lote?.toLowerCase().includes(text) ||
      sup.Especie?.Nom_especie.toLowerCase().includes(text)
    );
  });

  const hideModal = () => {
    document.getElementById('closeModal').click()
    getAllProduccion()
  }

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-5" style={{ paddingTop: '2rem' }}>

        <div className="row d-flex justify-content-between align-items-center mb-4 gap-3 gap-md-0">
          <div className="col-12 col-md-6 col-lg-4">
            <input
              className="form-control shadow-sm"
              placeholder="Buscar Producción"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-auto text-md-end text-center">
            <button
              type="button"
              className="btn btn-primary px-4 shadow-sm"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => { setRowToEdit(null); setIsViewOnly(false); }}
            >
              Agregar Producción
            </button>
          </div>
        </div>

        <DataTable
          title="Producción"
          columns={columnsTable}
          data={newListProduccion}
          keyField="Id_produccion"
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
                  {isViewOnly ? "Detalles de Producción" : rowToEdit ? "Editar Producción" : "Agregar Producción"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>

              <div className="modal-body position-relative">
                {isViewOnly && (
                  <div
                    className="position-absolute w-100 h-100 start-0 top-0"
                    style={{ zIndex: 10, backgroundColor: 'rgba(255,255,255,0.3)' }}
                  ></div>
                )}
                <ProduccionForm
                  hideModal={hideModal}
                  refreshList={getAllProduccion}
                  rowToEdit={rowToEdit}
                  isViewOnly={isViewOnly}
                />
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default CrudProduccion