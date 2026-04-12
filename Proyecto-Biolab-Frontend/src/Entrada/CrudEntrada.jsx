import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import EntradaForm from "./EntradaForm.jsx"

const CrudEntrada = () => {


  const [rowToEdit, setRowToEdit] = useState(null);
  const [Entrada, setEntrada] = useState([])
  const [Estado, setEstado] = useState("Activo")
  const [filterText, setFilterText] = useState("")
  // 🔹 Función para alternar Activo/Inactivo
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
      await apiAxios.put(`/api/Entrada/${row.Id_Entrada}`, {
        ...row,
        Estado: estadoNuevo
      });

      getAllEntradas();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };


  const columnsTable = [
    { name: 'Id_Entrada', selector: row => row.Id_Entrada },
    { name: 'Reactivo', selector: row => row.Reactivo?.Nom_reactivo },
    { name: 'Lote', selector: row => row.Lote },
    { name: 'Can_Inicial', selector: row => row.Can_Inicial },
    { name: 'Can_Salida', selector: row => row.Can_Salida },
    { name: 'Uni_Medida', selector: row => row.Uni_Medida },
    { name: 'Fec_Vencimiento', selector: row => row.Fec_Vencimiento },
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
  ];

  useEffect(() => {
    getAllEntradas()
  }, [])

  const getAllEntradas = async () => {
    const response = await apiAxios.get('/api/Entrada')
    setEntrada(response.data)
    console.log(response.data)
  }

  const newListEntrada = Entrada.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    const Lote = uso.Lote?.toLowerCase()
    return Lote.includes(textToSearch)
  })

  const hideModal = () => {
    document.getElementById('closeModal').click()
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row d-flex justify-content-between">
          <div className="col-4">
            <input className="form-control" placeholder="Buscar por Entrada" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
          <div className="col-2">
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="closeModal" onClick={() => setRowToEdit(null)}>
              Agregar Entrada 
            </button>
          </div>
        </div>
         <DataTable
          title="Entrada"
          columns={columnsTable}
          data={newListEntrada}
          keyField="Id_Entrada"
          pagination
          highlightOnHover
          striped
          conditionalRowStyles={[
  {
    when: row => row.Estado === "Activo",
    style: { backgroundColor: "#ffffff", color: "#000000" }
  },
  {
    when: row => row.Estado === "Inactivo",
    style: { backgroundColor: "#aeadad", color: "#6c757d" }
  }
]}
        />

        

        {/* Modal */}
        <div className="modal fade" id="exampleModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h1 className="modal-title fs-5">
                  {rowToEdit ? "Editar Entrada" : "Agregar Entrada"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>

              <div className="modal-body">
                <EntradaForm
                  hideModal={hideModal}
                  refreshList={getAllEntradas}
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
export default CrudEntrada
