import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from "react-data-table-component";
import Sup_PlantasForm from "./Sup_PlantasForm.jsx";


const CrudSup_Plantas = () => {

  const [Sup_Plantas, setSup_Plantas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowToEdit, setRowToEdit] = useState(null);

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
    { name: 'Id_Supervision', selector: row => row.Id_supervision },
    { name: 'Numero de Lote', selector: row => row.Num_lote },
    { name: 'Frascos Iniciales', selector: row => row.Fc_Iniciales },
    { name: 'Fc_Bacterias', selector: row => row.Fc_Bacterias },
    { name: 'Fc_Hongos', selector: row => row.Fc_Hongos },
    { name: 'Frascos Sin Desarrollo', selector: row => row.Fs_Desarrollo },
    { name: 'Fd_BR', selector: row => row.Fd_BR },
    { name: 'Fd_RA', selector: row => row.Fd_RA },
    { name: 'Fd_CA', selector: row => row.Fd_CA },
    { name: 'Fd_MOR', selector: row => row.Fd_MOR },
    { name: 'Fd_GER', selector: row => row.Fd_GER },
    { name: 'Num_endurecimiento', selector: row => row.Num_endurecimiento },
    { name: 'Med_Cultivo', selector: row => row.Med_Cultivo },
    { name: 'Met_Propagacion', selector: row => row.Met_Propagacion },
    { name: 'Producción', selector: row => row.Produccion?.Tip_produccion},
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
      <div className="container mt-5">

        <div className="row d-flex justify-content-between mb-3">
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


        {/* Modal */}
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
                  id="closeModal"
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

      </div>
    </>
  )
}

export default CrudSup_Plantas;