import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import ReservaForm from "./ReservaForm.jsx";

const CrudReserva = () => {
  const [Reserva, setReserva] = useState([]);
  const [Estados, setEstados] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowToEdit, setRowToEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formOpenToken, setFormOpenToken] = useState(0);

  // Modo vista detallada (Ojito)
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Leer usuario actual
  const userObj = localStorage.getItem('UsuarioLaboratorio');
  let loggedUser = null;
  if (userObj) {
    try { loggedUser = JSON.parse(userObj); } catch(e){}
  }

   const toggleBooleano = async (row) => {

    console.log(row.Booleano)

    let estadoNuevo = ''

    if(row.Booleano === 'Activo'){

      estadoNuevo = 'Inactivo'

    }else{
      estadoNuevo = 'Activo'
    }

    console.log(estadoNuevo)
    try {
      await apiAxios.put(`/api/Reserva/${row.Id_Reserva}`, {
        ...row,
        Booleano: estadoNuevo
      });

      fetchReservas();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  }; 

  // 🔹 Cerrar modal
  const hideModal = () => {
    const btn = document.getElementById("closeModal");
    if (btn) btn.click();
    setRowToEdit({});
  };

  // 🔹 Obtener reservas
  const fetchReservas = async () => {
    try {
      setIsLoading(true);
      const response = await apiAxios.get("/api/Reserva");
      const data = response.data;
      const list = Array.isArray(data) ? data : data?.data ?? [];
      
      let filteredList = list;
      if (loggedUser && loggedUser.rol === 'solicitante') {
        filteredList = list.filter(
          (r) => r && (r.Doc_Solicitante === String(loggedUser.documento) || r.Cor_Solicitante === loggedUser.correo)
        );
      }
      
      setReserva((filteredList ?? []).filter(Boolean));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Obtener estados
  const fetchEstados = async () => {
    try {
      const res = await apiAxios.get("/api/Estado");
      setEstados(res.data ?? []);
    } catch (error) {
    }
  };

  const location = useLocation();

  useEffect(() => {
    fetchReservas();
    fetchEstados();
  }, []);

  // Efecto para detectar navegación desde notificaciones
  useEffect(() => {
    if (location.state?.highlightId && Reserva.length > 0) {
      const idToFind = Number(location.state.highlightId);
      const found = Reserva.find(r => Number(r.Id_Reserva) === idToFind);
      if (found) {
        onView(found);
        // Limpiar el estado para que no se reabra al recargar o navegar de nuevo
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, Reserva]);

  // 🔹 Crear nueva reserva
  const onCreate = () => {
    setRowToEdit({});
    setIsViewOnly(false);
    setFormOpenToken((prev) => prev + 1);
  };

  // 🔹 Editar reserva
  const onEdit = (row) => {
    setRowToEdit({ ...(row ?? {}) });
    setIsViewOnly(false);
    setFormOpenToken((prev) => prev + 1);
  };

  // 🔹 Ver reserva (Ojito)
  const onView = (row) => {
    setRowToEdit({ ...(row ?? {}) });
    setIsViewOnly(true);
    setFormOpenToken((prev) => prev + 1);
  };

  // 🔹 Columnas de la tabla
  const columnsTable = useMemo(
    () => [
      { name: "Id_Reserva", selector: (row) => row?.Id_Reserva ?? "", sortable: true },
      { name: "Tipo", selector: (row) => row?.Tip_Reserva ?? "", sortable: true },
      { name: "Estado Reserva", selector: (row) => row?.Des_Estado ?? "", sortable: true },
      { name: "Motivo R/C", selector: (row) => row?.Mot_RecCan ?? "", sortable: true },
      { name: "Solicitante", selector: (row) => row?.Nom_Solicitante ?? "", sortable: true },
      { name: "Documento", selector: (row) => row?.Doc_Solicitante ?? "", sortable: true },
      { name: "Correo", selector: (row) => row?.Cor_Solicitante ?? "", sortable: true },
      { name: "Teléfono", selector: (row) => row?.Tel_Solicitante ?? "", sortable: true },
      { name: "Aprendices", selector: (row) => row?.Can_Aprendices ?? "", sortable: true },
      { name: "Fecha", selector: (row) => row?.Fec_Reserva ?? "", sortable: true },
      { name: "Hora", selector: (row) => row?.Hor_Reserva ?? "", sortable: true },
      { name: "Ficha", selector: (row) => row?.Num_Ficha ?? "", sortable: true },
      {
      name: 'Estado',
      cell: row => {
        if (loggedUser?.rol === 'solicitante') {
          return <span className={`badge ${row.Booleano === 'Activo' ? 'bg-success' : 'bg-danger'}`}>{row.Booleano}</span>;
        }
        return (
          <button
            className={`btn btn-sm ${row.Booleano =='Activo' ? 'btn-success' : 'btn-danger'}`}
            onClick={() => toggleBooleano(row)}
            disabled={['Finalizado', 'Rechazado', 'Cancelado'].includes(row.Des_Estado)}
          >
            {row.Booleano}
          </button>
        );
      }
    },
      {
        name: "Acciones",
        width: "120px",
        cell: (row) => (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              data-bs-toggle="modal"
              data-bs-target="#modalReserva"
              onClick={() => onView(row)}
              title="Ver detalles"
            >
              <i className="fa-solid fa-eye"></i>
            </button>
            {loggedUser?.rol !== 'solicitante' && (
              <button
                type="button"
                className="btn btn-sm btn-info"
                data-bs-toggle="modal"
                data-bs-target="#modalReserva"
                onClick={() => onEdit(row)}
                title="Editar"
              >
                <i className="fa-solid fa-pencil"></i>
              </button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  // 🔹 Filtro de búsqueda
  const filteredItems = useMemo(() => {
    const t = filterText.toLowerCase().trim();
    if (!t) return Reserva;

    return (Reserva ?? []).filter((row) => {
      const values = [
        row.Id_Reserva,
        row.Tip_Reserva,
        row.Des_Estado,
        row.Mot_RecCan,
        row.Nom_Solicitante,
        row.Doc_Solicitante,
        row.Cor_Solicitante,
        row.Tel_Solicitante,
        row.Can_Aprendices,
        row.Fec_Reserva,
        row.Hor_Reserva,
        row.Num_Ficha,
        row.Booleano,
      ]
        .filter((v) => v !== null && v !== undefined)
        .join(" ")
        .toLowerCase();

      return values.includes(t);
    });
  }, [Reserva, filterText]);

  const modalTitle = isViewOnly 
    ? "Detalles de Reserva" 
    : rowToEdit?.Id_Reserva ? "Editar Reserva" : "Nueva Reserva";

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-5" style={{ paddingTop: '2rem' }}>
        <div className="row d-flex justify-content-between align-items-center mb-4 gap-3 gap-md-0">
          <div className="col-12 col-md-6 col-lg-4">
            <input
              className="form-control shadow-sm"
              placeholder="Buscar..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-auto text-md-end text-center">
            <button
              type="button"
              className="btn btn-primary px-4 shadow-sm"
              data-bs-toggle="modal"
              data-bs-target="#modalReserva"
              onClick={onCreate}
            >
              Nueva Reserva
            </button>
          </div>
        </div>

        {/* Tabla */}
        <DataTable
          title="Lista de Reservas"
          columns={columnsTable}
          data={filteredItems}
          pagination
          progressPending={isLoading}
          highlightOnHover
          striped
          persistTableHead
          noDataComponent="No hay registros"
          conditionalRowStyles={[
            {
              when: (row) => row.Booleano === "Activo",
              style: {
                backgroundColor: "#ffffff",
                color: "#000000",
              },
            },
            {
              when: (row) => row.Booleano === "Inactivo",
              style: {
                backgroundColor: "#aeadad",
                color: "#6c757d",
              },
            },
          ]}
        />
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="modalReserva"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body position-relative">
              {isViewOnly && (
                <div 
                  className="position-absolute w-100 h-100 start-0 top-0" 
                  style={{ zIndex: 10, backgroundColor: 'rgba(255,255,255,0.3)' }}
                ></div>
              )}
              <ReservaForm
                key={`${rowToEdit?.Id_Reserva ?? "new"}-${formOpenToken}`}
                hideModal={async () => {
                  hideModal();
                  await fetchReservas();
                }}
                rowToEdit={rowToEdit}
                estados={Estados}
                isViewOnly={isViewOnly}
              />
            </div>

            <div className="modal-footer">
              <button
                id="closeModal"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrudReserva;