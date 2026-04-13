import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ReactivosForm from "./ReactivosForm.jsx"

const CrudReactivo = () => {

  const [Reactivos, setReactivos] = useState([])
  const [filterText, setFilterText] = useState("")
  const [rowToEdit, setRowToEdit] = useState([])

  const columnsTable = [
    { name: 'Id_Reactivo', selector: row => row.Id_Reactivo },
    { name: 'Nombre Reactivo', selector: row => row.Nom_reactivo },
    { name: 'Nomenclatura', selector: row => row.Nomenclatura },
    { name: 'Presentacion', selector: row => row.Presentacion },
    { name: 'Estado Reactivo', selector: row => row.Est_reactivo },
    {
  name: "Estado",
  cell: (row) => (
    <button
      className={`btn btn-sm ${row.Estado === "Activo" ? "btn-success" : "btn-danger"}`}
      onClick={() => toggleEstado(row)}
    >
      {row.Estado === "Activo" ? "Activo" : "Inactivo"}
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
    getAllReactivos()
  }, [])

  const getAllReactivos = async () => {
    try {
      const response = await apiAxios.get('/api/Reactivo')
      setReactivos(response.data)
    } catch (error) {
      console.error("Error cargando prácticas:", error)
    }
  }

  const newListReactivos = Reactivos.filter(row =>
  row.Nom_reactivo?.toLowerCase().includes(filterText.toLowerCase()) ||
  row.Est_reactivo?.toLowerCase().includes(filterText.toLowerCase())

)


  const hideModal = () => {
    document.getElementById('closeModal').click()
  }

  const toggleEstado = async (row) => {
  try {
    const updatedData = {
      ...row,
      Estado: row.Estado === "Activo" ? "Inactivo" : "Activo"
    };

    await apiAxios.put(`/api/Reactivo/${row.Id_Reactivo}`, updatedData);

    setReactivos(prev =>
      prev.map(item =>
        item.Id_Reactivo === row.Id_Reactivo
          ? { ...item, Estado: updatedData.Estado }
          : item
      )
    );

  } catch (error) {
    console.error("Error cambiando estado:", error);
  }
};


  return (
    <>
      <div className="container mt-5">

        <div className="row d-flex justify-content-between">
          <div className="col-4">
            <input
              className="form-control"
              placeholder="Buscar..."
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
              Agregar Reactivo
            </button>
          </div>
        </div>

        <DataTable
          title="Reactivo"
          columns={columnsTable}
          data={newListReactivos}
          keyField="Id_Reactivo"
          pagination
          highlightOnHover
          striped
          conditionalRowStyles={[
  {
    when: row => row.Estado === "Activo",
    style: {
      backgroundColor: "#ffffff", // fila blanca
      color: "#000000"            // texto negro
    }
  },
  {
    when: row => row.Estado === "Inactivo",
    style: {
      backgroundColor: "#aeadad", // fila gris clarito
      color: "#6c757d"            // texto gris oscuro
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
                  {rowToEdit ? "Editar Reactivo" : "Agregar Reactivo"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>

              <div className="modal-body">
                <ReactivosForm
                  hideModal={hideModal}
                  refreshList={getAllReactivos}
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

export default CrudReactivo
