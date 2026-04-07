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

    console.log(row.estado)

    let estadoNuevo = ''

    if(row.estado === 'Activo'){

      estadoNuevo = 'Inactivo'

    }else{
      estadoNuevo = 'Activo'
    }

    console.log(estadoNuevo)
    try {
      await apiAxios.put(`/api/Equipo/${row.id_equipo}`, {
        ...row,
        estado: estadoNuevo
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
    {
  name: "Imagen",
  cell: row => (
    row.img_equipo ? (
      <img
        src={`http://localhost:8000/uploads/${row.img_equipo}`}
        alt="Equipo"
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          borderRadius: "5px"
        }}
      />
    ) : (
      <span>Sin imagen</span>
    )
  )
},
    { name: "Nombre", selector: row => row.nombre },
    { name: "Marca", selector: row => row.marca },
    { name: "Grupo", selector: row => row.grupo },
    { name: "Linea", selector: row => row.linea },
    { name: "Centro Costos", selector: row => row.centro_costos },

    {
      name: 'Estado',
      cell: row => (
        <button
          className={`btn btn-sm ${row.estado =='Activo' ? 'btn-success' : 'btn-danger'}`}
          onClick={() => toggleEstado(row)}
        >
          {row.estado}
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
              when: row => row.estado === "Activo",
              style: {
                backgroundColor: "#ffffff", // fila blanca
                color: "#000000"            // texto negro
              }
            },
            {
              when: row => row.estado === "Inactivo",
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