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
    try { loggedUser = JSON.parse(userObj); } catch (e) { }
  }

  const toggleBooleano = async (row) => {
    const estadoNuevo = row.Booleano === 'Activo' ? 'Inactivo' : 'Activo';

    const result = await Swal.fire({
      title: `¿${estadoNuevo === 'Activo' ? 'Activar' : 'Inactivar'} reserva?`,
      text: `Reserva ID: ${row.Id_Reserva} - ${row.Nom_Solicitante}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/Reserva/${row.Id_Reserva}`, {
        ...row,
        Booleano: estadoNuevo
      });
      fetchReservas();
      Swal.fire({
        title: 'Estado actualizado',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
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
      console.error("Error cargando reservas:", error);
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
      console.error("Error cargando estados:", error);
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
    <div className="container-fluid py-4 fade-in">
      {/* HEADER */}
      <div className="row mb-4 align-items-center g-3">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '50px', height: '50px' }}>
              <i className="fa-solid fa-calendar-check fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Mis Reservas</h2>
              <p className="text-muted mb-0 small">Control y seguimiento de solicitudes de espacio y recursos.</p>
            </div>
          </div>
        </div>
        <div className="col-md-auto d-flex gap-2">
          <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border" style={{ width: '300px' }}>
            <span className="input-group-text border-0 bg-transparent ps-3">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 py-2 shadow-none bg-transparent"
              placeholder="Buscar reserva..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalReserva"
            onClick={onCreate}
          >
            <i className="fa-solid fa-plus me-2"></i>Nueva Solicitud
          </button>
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM CON DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={[
            { name: "ID_RESERVA", selector: (row) => row?.Id_Reserva ?? "", sortable: true, width: '110px' },
            { name: "TIPO", selector: (row) => row?.Tip_Reserva ?? "", sortable: true, width: '120px' },
            {
              name: 'ESTADO RES...',
              selector: (row) => row?.Des_Estado ?? "",
              sortable: true,
              width: '150px',
              cell: row => {
                const status = row.Des_Estado;
                let badgeClass = 'bg-secondary';
                if (status === 'Aprobado') badgeClass = 'bg-success';
                else if (status === 'Rechazado' || status === 'Cancelado') badgeClass = 'bg-danger';
                else if (status === 'En proceso') badgeClass = 'bg-warning text-dark';
                else if (status === 'Solicitado') badgeClass = 'bg-info text-dark';

                return <span className={`badge ${badgeClass} rounded-pill`}>{status}</span>;
              }
            },
            { name: "MOTIVO R/C", selector: (row) => row?.Mot_RecCan ?? "", sortable: true, width: '150px' },
            { name: "SOLICITANTE", selector: (row) => row?.Nom_Solicitante ?? "", sortable: true, width: '180px' },
            { name: "FECHA", selector: (row) => row?.Fec_Reserva ?? "", sortable: true, width: '120px' },
            { name: "HORA", selector: (row) => row?.Hor_Reserva ?? "", sortable: true, width: '120px' },
            { name: "FICHA", selector: (row) => row?.Num_Ficha ?? "", sortable: true, width: '120px' },
            {
              name: "ACCIONES",
              center: "true",
              width: '120px',
              cell: (row) => (
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn-action"
                    style={{ background: '#64748b', color: 'white' }}
                    data-bs-toggle="modal"
                    data-bs-target="#modalReserva"
                    onClick={() => onView(row)}
                    title="Ver detalles"
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredItems}
          pagination
          progressPending={isLoading}
          highlightOnHover
          persistTableHead
          noDataComponent="No hay registros"
          conditionalRowStyles={[
            {
              when: (row) => row.Booleano === "Inactivo",
              style: {
                backgroundColor: "#f8fafc",
                color: "#94a3b8",
                opacity: 0.8
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
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">{modalTitle}</h5>
              <button
                type="button"
                className="btn-close btn-close-white shadow-none"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body position-relative p-4">

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
            <div className="modal-footer border-0">
              <button
                id="closeModal"
                type="button"
                className="btn btn-secondary rounded-pill px-4"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudReserva;