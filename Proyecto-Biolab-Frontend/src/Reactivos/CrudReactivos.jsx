import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import ReactivosForm from "./ReactivosForm.jsx"

const CrudReactivos = () => {

  const [rowToEdit, setRowToEdit] = useState(null);
  const [Reactivo, setReactivo] = useState([])
  const [filterText, setFilterText] = useState("")

  // Estado para modal PDF
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // 🔹 Función para alternar Activo/Inactivo
  const toggleEstado = async (row) => {
    let estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await apiAxios.put(`/api/Reactivo/${row.Id_Reactivo}`, {
        ...row,
        Estado: estadoNuevo
      });
      getAllReactivos();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // Subir ficha técnica directamente desde la tabla
  const uploadFicha = (row) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('Ficha_tecnica', file);
      formData.append('Nom_reactivo', row.Nom_reactivo || '');
      try {
        await apiAxios.put(`/api/Reactivo/${row.Id_Reactivo}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        getAllReactivos();
      } catch (error) {
        console.error("Error subiendo ficha técnica:", error);
      }
    };
    input.click();
  };

  const columnsTable = [
    { name: 'Id', selector: row => row.Id_Reactivo, width: '60px' },
    { name: 'Nombre Reactivo', selector: row => row.Nom_reactivo },
    { name: 'Nomenclatura', selector: row => row.Nomenclatura },
    { name: 'Presentacion', selector: row => row.Presentacion },
    { name: 'Estado Reactivo', selector: row => row.Est_reactivo, width: '140px' },
    {
      name: 'Ficha',
      width: '100px',
      cell: row => (
        <div className="d-flex align-items-center justify-content-center">
          {row.Ficha_tecnica ? (
            <button
              className="btn btn-sm btn-outline-primary rounded-pill px-3"
              title="Ver PDF"
              onClick={() => {
                setPdfUrl(`http://localhost:8000/uploads/${row.Ficha_tecnica}`);
                setShowPdf(true);
              }}
            >
              <i className="fa-solid fa-eye me-1"></i>Ver
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              onClick={() => uploadFicha(row)}
              title="Subir PDF"
            >
              <i className="fa-solid fa-upload me-1"></i>Subir
            </button>
          )}
        </div>
      )
    },
    {
      name: 'Estado',
      width: '95px',
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
      width: '80px',
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
  ];

  useEffect(() => {
    getAllReactivos()
  }, [])

  const getAllReactivos = async () => {
    const response = await apiAxios.get('/api/Reactivo')
    setReactivo(response.data)
  }

  const newListReactivo = Reactivo.filter((uso) => {
    const textToSearch = filterText.toLowerCase()
    const Nom_Reactivo = uso.Nom_reactivo?.toLowerCase()
    return Nom_Reactivo?.includes(textToSearch)
  })

  const hideModal = () => {
    document.getElementById('closeModal').click()
  }

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-2">
        <div className="row d-flex justify-content-between align-items-center mb-4 gap-3 gap-md-0">
          <div className="col-12 col-md-6 col-lg-4">
            <input className="form-control shadow-sm" placeholder="Buscar por Reactivo" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
          <div className="col-12 col-md-auto text-md-end text-center">
            <button type="button" className="btn btn-primary px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" id="closeModal" onClick={() => setRowToEdit(null)}>
              Agregar Reactivo
            </button>
          </div>
        </div>

        <DataTable
          title="Reactivos"
          columns={columnsTable}
          data={newListReactivo}
          keyField="Id_Reactivo"
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

        {/* Modal formulario */}
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

      {/* ======== MODAL VISOR DE PDF ======== */}
      {showPdf && (
        <div className="carousel-overlay" onClick={() => setShowPdf(false)}>
          <div className="pdf-modal-container" onClick={(e) => e.stopPropagation()}>

            <div className="pdf-modal-header">
              <span className="pdf-modal-title">
                <i className="fa-solid fa-file-pdf me-2"></i>Ficha Técnica
              </span>
              <button className="pdf-modal-close" onClick={() => setShowPdf(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <iframe
              src={pdfUrl}
              className="pdf-modal-iframe"
              title="Ficha Técnica PDF"
            />

          </div>
        </div>
      )}
    </>
  )
}
export default CrudReactivos
