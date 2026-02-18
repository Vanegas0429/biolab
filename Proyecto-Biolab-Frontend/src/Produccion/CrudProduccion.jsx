import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ProduccionForm from "./ProduccionForm.jsx"

const CrudProduccion = () => {

  const [rowToEdit, setRowToEdit] = useState(null)
  const [Produccion, setProduccion] = useState([])
  const [filterText, setFilterText] = useState("")

  // 🔹 Alternar Activo/Inactivo
  const toggleEstado = async (row) => {
    try {

      const nuevoEstado =
        row.Estado === "Activo" ? "Inactivo" : "Activo"

      const updatedData = {
        Tip_produccion: row.Tip_produccion,
        Cod_produccion: row.Cod_produccion,
        Estado: nuevoEstado
      }

      await apiAxios.put(
        `/api/Produccion/${row.Id_produccion}`,
        updatedData
      )

      setProduccion(prev =>
        prev.map(item =>
          item.Id_produccion === row.Id_produccion
            ? { ...item, Estado: nuevoEstado }
            : item
        )
      )

    } catch (error) {
      console.error("Error cambiando estado:", error.response?.data || error.message)
    }
  }


  // 🔹 Columnas
  const columnsTable = [
    { name: 'Id_Produccion', selector: row => row.Id_produccion },
    { name: 'Tip_produccion', selector: row => row.Tip_produccion },
    { name: 'Cod_produccion', selector: row => row.Cod_produccion },
    {
      name: "Estado",
      cell: (row) => (
        <button
          className={`btn btn-sm ${row.Estado === "Activo" ? "btn-success" : "btn-danger"}`}
          onClick={() => toggleEstado(row)}
        >
          {row.Estado === "Activo" ? "Activo" : "Inactivo"}
        </button>
      ),
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
    getAllProduccion()
  }, [])

  const getAllProduccion = async () => {
    const response = await apiAxios.get('/api/Produccion')
    setProduccion(response.data)
  }

  // 🔹 Buscador
  const newListProduccion = Produccion.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    const tip = uso.Tip_produccion?.toLowerCase() || ""
    return tip.includes(textToSearch)
  })

  const hideModal = () => {
    document.getElementById('closeModal').click()
    getAllProduccion()
  }

  return (
    <>
      <div className="container mt-5">

        <div className="row d-flex justify-content-between">
          <div className="col-4">
            <input
              className="form-control"
              placeholder="Buscar Producción"
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
                  {rowToEdit ? "Editar Producción" : "Agregar Producción"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>

              <div className="modal-body">
                <ProduccionForm
                  hideModal={hideModal}
                  refreshList={getAllProduccion}
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

export default CrudProduccion
