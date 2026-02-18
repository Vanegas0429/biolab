import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from "react-data-table-component";
import EquiposForm from "./EquiposForm";

const CrudEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");

  const [modoEdicion, setModoEdicion] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState(null);

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

  const handleNuevo = () => {
    setModoEdicion(false);
    setEquipoEditando(null);
  };

  const handleEditar = (equipo) => {
    setModoEdicion(true);
    setEquipoEditando(equipo);
  };

  const handleEliminar = async (id_equipo) => {
    const confirmacion = confirm("¿Seguro que deseas eliminar este equipo?");
    if (!confirmacion) return;

    try {
      await apiAxios.delete(`/api/Equipo/${id_equipo}`);
      alert("Equipo eliminado correctamente");
      getAllEquipos();
    } catch (error) {
      console.error("Error eliminando equipo:", error);
      alert("No se pudo eliminar");
    }
  };

  const equiposFiltrados = equipos.filter((e) => {
    const t = filterText.toLowerCase();
    return (
      e.nombre?.toLowerCase().includes(t) ||
      e.grupo?.toLowerCase().includes(t) ||
      e.centro_costos?.toLowerCase().includes(t)
    );
  });

  const columnsTable = [
    { name: "Id_Equipo", selector: (row) => row.id_equipo },
    { name: "Nombre", selector: (row) => row.nombre },
    { name: "Marca", selector: (row) => row.marca },
    { name: "Grupo", selector: (row) => row.grupo },
    { name: "Linea", selector: (row) => row.linea },
    { name: "Centro de costos", selector: (row) => row.centro_costos },
    { name: "Subcentro de costos", selector: (row) => row.subcentro_costos },
    { name: "Observaciones", selector: (row) => row.observaciones },

    // IMAGEN
    {
      name: "Imagen",
      cell: (row) =>
        row.img_equipo ? (
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${row.equipo_img}`}
            alt="Equipo"
            width="60"
            height="60"
            style={{
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />
        ) : (
          <span>Sin imagen</span>
        ),
    },

    // BOTONES
    {
      name: "Acciones",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-warning btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalEquipos"
            onClick={() => handleEditar(row)}
          >
            Editar
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleEliminar(row.id_equipo)}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="container mt-5">
        {/* Buscador + Botón */}
        <div className="row d-flex justify-content-between mb-3">
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
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalEquipos"
              onClick={handleNuevo}
            >
              Agregar Equipo
            </button>
          </div>
        </div>

        {/* Tabla */}
        <DataTable
          title="Equipos"
          columns={columnsTable}
          data={equiposFiltrados}
          keyField="id_equipo"
          pagination
          highlightOnHover
          striped
        />

        {/* Modal Único */}
        <div
          className="modal fade"
          id="modalEquipos"
          tabIndex="-1"
          aria-labelledby="modalEquiposLabel"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalEquiposLabel">
                  {modoEdicion ? "Editar Equipo" : "Registrar Equipo"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body">
                <EquiposForm
                  modoEdicion={modoEdicion}
                  equipoEditando={equipoEditando}
                  recargarEquipos={getAllEquipos}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrudEquipos;
