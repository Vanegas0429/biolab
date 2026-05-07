import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from "react-data-table-component";
import Sup_PlantasForm from "./Sup_PlantasForm.jsx";
import ProduccionForm from "../Produccion/ProduccionForm.jsx";


const CrudSup_Plantas = () => {

  const [Sup_Plantas, setSup_Plantas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowToEdit, setRowToEdit] = useState(null);
  const [rowToViewProduccion, setRowToViewProduccion] = useState(null);

  // 🔹 Función para alternar Activo/Inactivo
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
      await apiAxios.put(`/api/Sup_Plantas/${row.Id_supervision}`, {
        ...row,
        Estado: estadoNuevo
      });

      getAllSup_Plantas();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };


  // 🔹 Columnas de la tabla
  const columnsTable = [
    { name: 'ID', selector: row => row.Id_supervision },
    { name: 'Lote', selector: row => row.Num_lote },
    { name: 'Medio de Cultivo', selector: row => row.Med_Cultivo },
    { name: 'Metodo de Propagacion', selector: row => row.Met_Propagacion },
    { name: 'Frascos Iniciales', selector: row => row.Fc_Iniciales },
    { name: 'Bacterias', selector: row => row.Fc_Bacterias },
    { name: 'Hongos', selector: row => row.Fc_Hongos },
    { name: 'Sin Desarrollo', selector: row => row.Fs_Desarrollo },
    { name: 'BR', selector: row => row.Fd_BR },
    { name: 'RA', selector: row => row.Fd_RA },
    { name: 'CA', selector: row => row.Fd_CA },
    { name: 'MOR', selector: row => row.Fd_MOR },
    { name: 'GER', selector: row => row.Fd_GER },
    { name: 'Num Endurecimiento', selector: row => row.Num_endurecimiento },
    {
      name: 'Producción',
      width: '150px',
      cell: row => (
        <div className="d-flex align-items-center gap-2">
          {row.Produccion && (
            <button
              className="btn btn-sm btn-outline-secondary p-1"
              title="Ver Producción"
              data-bs-toggle="modal"
              data-bs-target="#modalProduccionView"
              onClick={() => setRowToViewProduccion(row.Produccion)}
            >
              <i className="fa-solid fa-eye"></i>
            </button>
          )}
        </div>
      )
    },
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


  // 🔹 useEffect al nivel del componente
  useEffect(() => {
    getAllSup_Plantas();
  }, []);

  const getAllSup_Plantas = async () => {
    try {
      const response = await apiAxios.get('/api/Sup_Plantas');
      setSup_Plantas(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error cargando supervisiones:", error);
    }
  };

  // 🔍 Buscador
  const newListSup_Plantas = Sup_Plantas.filter((sup) => {
    const text = filterText.toLowerCase();
    return (
      sup.Num_lote?.toString().includes(text) ||
      sup.Med_Cultivo?.toLowerCase().includes(text) ||
      sup.Met_Propagacion?.toLowerCase().includes(text) ||
      sup.Produccion?.Tip_produccion.toLowerCase().includes(text)
    );
  });

  const hideModal = () => {
    document.getElementById('btnCloseModal').click();
    getAllSup_Plantas(); // refresca la tabla al cerrar
  };

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-5" style={{ paddingTop: '2rem' }}>

        <div className="row d-flex justify-content-between align-items-center mb-4 gap-3 gap-md-0">
          <div className="col-12 col-md-6 col-lg-4">
            <input
              className="form-control shadow-sm"
              placeholder="Buscar"
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
              onClick={() => setRowToEdit(null)}
            >
              Agregar supervision
            </button>
          </div>
        </div>

        <DataTable
          title="Supervisión"
          columns={columnsTable}
          data={newListSup_Plantas}
          keyField="Id_supervision"
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


        {/* Modal Supervision */}
        <div className="modal fade" id="exampleModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h1 className="modal-title fs-5">
                  {rowToEdit ? "Editar Supervision" : "Agregar Supervision"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="btnCloseModal"
                ></button>
              </div>

              <div className="modal-body">
                <Sup_PlantasForm
                  hideModal={hideModal}
                  refreshList={getAllSup_Plantas}
                  rowToEdit={rowToEdit}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Modal Ver Produccion */}
        <div className="modal fade" id="modalProduccionView" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h1 className="modal-title fs-5">Detalles de Producción</h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body position-relative">
                <div
                  className="position-absolute w-100 h-100 start-0 top-0"
                  style={{ zIndex: 10, backgroundColor: 'rgba(255,255,255,0.3)' }}
                ></div>
                {rowToViewProduccion && (
                  <ProduccionForm
                    rowToEdit={rowToViewProduccion}
                    isViewOnly={true}
                  />
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default CrudSup_Plantas;