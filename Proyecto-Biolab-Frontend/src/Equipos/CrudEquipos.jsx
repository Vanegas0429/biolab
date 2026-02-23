import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from "react-data-table-component";
import EquiposForm from "./EquiposForm";

const CrudEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState(null);
  const [modalKey, setModalKey] = useState(0);

  // Obtener los datos del usuario para extraer el token
  const userStored = localStorage.getItem('UsuarioLaboratorio');
  const user = userStored ? JSON.parse(userStored) : null;

  useEffect(() => {
    getAllEquipos();
  }, []);

  const getAllEquipos = async () => {
    try {
      // Se agrega el encabezado Authorization con el token Bearer
      const response = await apiAxios.get("/api/Equipo", {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      setEquipos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNuevo = () => {
    setModoEdicion(false);
    setEquipoEditando(null);
    setModalKey((k) => k + 1);
  };

  const handleEditar = (equipo) => {
    setModoEdicion(true);
    setEquipoEditando(equipo);
    setModalKey((k) => k + 1);
  };

  // CAMBIO DE ESTADO
  const handleCambiarEstado = async (id_equipo) => {
    if (!id_equipo) return alert("ID no encontrado");

    try {
<<<<<<< Updated upstream
      await apiAxios.delete(`/api/Equipo/${id_equipo}`);
=======
      // Se agrega el token también en la petición de borrado
      await apiAxios.delete(`/api/Equipo/${id_equipo}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      alert("Equipo eliminado correctamente");
>>>>>>> Stashed changes
      getAllEquipos();
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("No se pudo cambiar el estado");
    }
  };

<<<<<<< Updated upstream


=======
  // --- El resto de tu lógica de filtrado y renderizado permanece igual ---
>>>>>>> Stashed changes
  const equiposFiltrados = equipos.filter((e) => {
    const t = filterText.toLowerCase();
    return (
      e.nombre?.toLowerCase().includes(t) ||
      e.grupo?.toLowerCase().includes(t) ||
      e.centro_costos?.toLowerCase().includes(t)
    );
  });

  const columnsTable = [
    { name: "ID", selector: (row) => row.id_equipo, width: "80px" },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Marca", selector: (row) => row.marca },
    { name: "Grupo", selector: (row) => row.grupo },
    { name: "Linea", selector: (row) => row.linea },
<<<<<<< Updated upstream

    // NUEVA COLUMNA ESTADO
    {
      name: "Estado",
      cell: (row) => (
        <span className={`badge ${row.estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
          {row.estado}
        </span>
      ),
    },

=======
    { name: "Centro de costos", selector: (row) => row.centro_costos },
    { name: "Subcentro de costos", selector: (row) => row.subcentro_costos },
    { name: "Observaciones", selector: (row) => row.observaciones },
    {
      name: "Imagen",
      cell: (row) =>
        row.equipo_img ? ( // Corregido el nombre del campo según tu tabla
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${row.equipo_img}`}
            alt="Equipo"
            width="60"
            height="60"
            style={{ objectFit: "cover", borderRadius: "10px", border: "1px solid #ddd" }}
          />
        ) : (
          <span>Sin imagen</span>
        ),
    },
>>>>>>> Stashed changes
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
            className={`btn btn-sm ${row.estado === "Activo" ? "btn-danger" : "btn-success"}`}
            onClick={() => handleCambiarEstado(row.id_equipo)}
          >
            {row.estado === "Activo" ? "Desactivar" : "Activar"}
          </button>

        </div>
      ),
    },
  ];

  return (
<<<<<<< Updated upstream
    <div className="container mt-5">
      <div className="row d-flex justify-content-between mb-3">
        <div className="col-4">
          <input
            className="form-control"
            placeholder="Buscar..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
=======
    <>
      <div className="container mt-5">
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      <DataTable
        title="Gestión de Equipos"
        columns={columnsTable}
        data={equiposFiltrados}
        keyField="id_equipo"
        pagination
        highlightOnHover
        striped
      />

      <div className="modal fade" id="modalEquipos" tabIndex="-1" key={modalKey}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {modoEdicion ? "Editar Equipo" : "Registrar Equipo"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <EquiposForm
                modoEdicion={modoEdicion}
                equipoEditando={equipoEditando}
                recargarEquipos={getAllEquipos}
              />
=======
        <DataTable
          title="Equipos"
          columns={columnsTable}
          data={equiposFiltrados}
          keyField="id_equipo"
          pagination
          highlightOnHover
          striped
        />

        <div className="modal fade" id="modalEquipos" tabIndex="-1" aria-labelledby="modalEquiposLabel">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalEquiposLabel">
                  {modoEdicion ? "Editar Equipo" : "Registrar Equipo"}
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <EquiposForm
                  modoEdicion={modoEdicion}
                  equipoEditando={equipoEditando}
                  recargarEquipos={getAllEquipos}
                  token={user?.token} // Pasamos el token al formulario para sus peticiones
                />
              </div>
>>>>>>> Stashed changes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudEquipos;