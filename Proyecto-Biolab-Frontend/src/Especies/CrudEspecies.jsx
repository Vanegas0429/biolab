import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import EspeciesForm from "./EspeciesForm.jsx"

const CrudEspecie = () => {


  const [rowToEdit, setRowToEdit] = useState(null);
  const [Especie, setEspecie] = useState([])
  const [Estado, setEstado] = useState("Activo")
  const [filterText, setFilterText] = useState("")
  // 🔹 Función para alternar Activo/Inactivo
  const toggleEstado = async (row) => {
    try {
      const updatedData = { ...row, Estado: row.Estado === "Activo" ? "Inactivo" : "Activo" };

      await apiAxios.put(`/api/Especie/${row.Id_especie}`, updatedData);

      setEspecie(prev =>
        prev.map(item =>
          item.Id_especie === row.Id_especie
            ? { ...item, Estado: updatedData.Estado }
            : item
        )
      );
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };


  // 🔹 Columnas de la tabla
  const columnsTable = [
    { name: 'Id_Especie', selector: row => row.Id_especie },
    { name: 'Nombre de especie', selector: row => row.Nom_especie },
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
  ];

  useEffect(() => {
    getAllEspecies()
  }, [])

  const getAllEspecies = async () => {
    const response = await apiAxios.get('/api/Especie')
    setEspecie(response.data)
    console.log(response.data)
  }

  const newListEspecie = Especie.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    const Nom_especie = uso.Nom_especie?.toLowerCase()
    return Nom_especie.includes(textToSearch)
  })

  const hideModal = () => {
    document.getElementById('closeModal').click()
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row d-flex justify-content-between">
          <div className="col-4">
            <input className="form-control" placeholder="Buscar por Especie (ej: Limon)" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
          <div className="col-2">
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="closeModal" onClick={() => setRowToEdit(null)}>
              Agregar Especie 
            </button>
          </div>
        </div>
         <DataTable
          title="Especie"
          columns={columnsTable}
          data={newListEspecie}
          keyField="Id_especie"
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

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar Especie Nueva</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close" id="closeModal"></button>
              </div>
              <div className="modal-body">
                <EspeciesForm hideModal={hideModal} refreshList={getAllEspecies} rowToEdit={rowToEdit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CrudEspecie
