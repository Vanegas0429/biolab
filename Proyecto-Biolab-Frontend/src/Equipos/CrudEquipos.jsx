import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from "react-data-table-component";
import EquiposForm from "./EquiposForm";

const CrudEquipos = () => {

  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowToEdit, setRowToEdit] = useState([]);

  useEffect(() => {
    getAllEquipos();
  }, []);

  const getAllEquipos = async () => {
    try {
      const response = await apiAxios.get("/api/Equipo");
      setEquipos(response.data);
    } catch (error) {
      console.error("Error cargando equipos:", error);
    }
  };

  const hideModal = () => {
    document.getElementById("closeModal").click();
  };

  const toggleEstado = async (row) => {
    try {
      await apiAxios.put(`/api/Equipo/${row.id_equipo}`, {
        ...row,
        estado: !row.estado
      });

      getAllEquipos();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const equiposFiltrados = equipos.filter((e) =>
    e.nombre?.toLowerCase().includes(filterText.toLowerCase()) ||
    e.grupo?.toLowerCase().includes(filterText.toLowerCase()) ||
    e.centro_costos?.toLowerCase().includes(filterText.toLowerCase())
  );

  const columnsTable = [
    { name: "Id_Equipo", selector: row => row.id_equipo },
    { name: "Nombre", selector: row => row.nombre },
    { name: "Marca", selector: row => row.marca },
    { name: "Grupo", selector: row => row.grupo },
    { name: "Linea", selector: row => row.linea },
    { name: "Centro Costos", selector: row => row.centro_costos },
    {
  name: "Imagen",
  cell: row => (
    row.equipo_img ? (
      <img
        src={`http://localhost:8000/uploads/${row.img_equipo}`}
        alt="Equipo"
        style={{
          width: "60px",
          height: "60px",
          objectFit: "cover",
          borderRadius: "5px"
        }}
      />
    ) : (
      <span>Sin imagen</span>
    )
  )
},

    {
      name: 'Estado',
      cell: row => (
        <button
          className={`btn btn-sm ${row.estado ? 'btn-success' : 'btn-danger'}`}
          onClick={() => toggleEstado(row)}
        >
          {row.estado ? 'Activo' : 'Inactivo'}
        </button>
      )
    },

    {
      name: "Acciones",
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
              Agregar Equipo
            </button>
          </div>
        </div>

        <DataTable
          title="Equipos"
          columns={columnsTable}
          data={equiposFiltrados}
          keyField="id_equipo"
          pagination
          highlightOnHover
          striped
          conditionalRowStyles={[
            {
              when: row => row.estado,
              style: {
                backgroundColor: "#ffffff",
                color: "#000000"
              }
            },
            {
              when: row => !row.estado,
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
                  {rowToEdit ? "Editar Equipo" : "Agregar Equipo"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="closeModal"
                ></button>
              </div>

              <div className="modal-body">
                <EquiposForm
                  hideModal={hideModal}
                  refreshList={getAllEquipos}
                  rowToEdit={rowToEdit}
                />
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  )
};

export default CrudEquipos;