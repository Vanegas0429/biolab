import { useEffect, useMemo, useState } from "react";
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
      setReserva((list ?? []).filter(Boolean));
    } catch (error) {
      console.error(
        "Error consultando reservas:",
        error.response ? error.response.data : error.message
      );
      Swal.fire("Error", "No se pudieron cargar las reservas", "error");
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
      console.error(
        "Error consultando estados:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchReservas();
    fetchEstados();
  }, []);

  // 🔹 Crear nueva reserva
  const onCreate = () => {
    setRowToEdit({});
    setFormOpenToken((prev) => prev + 1);
  };

  // 🔹 Editar reserva
  const onEdit = (row) => {
    setRowToEdit({ ...(row ?? {}) });
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
      cell: row => (
        <button
          className={`btn btn-sm ${row.Booleano =='Activo' ? 'btn-success' : 'btn-danger'}`}
          onClick={() => toggleBooleano(row)}
        >
          {row.Booleano}
        </button>
      )
    },
      {
        name: "Acciones",
        cell: (row) => (
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

  const modalTitle = rowToEdit?.Id_Reserva
    ? "Editar Reserva"
    : "Nueva Reserva";

  return (
    <>
      <div className="container mt-3">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Reservas</h4>

          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalReserva"
            onClick={onCreate}
          >
            Nueva Reserva
          </button>
        </div>

        {/* Buscador */}
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Buscar..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
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

            <div className="modal-body">
              <ReservaForm
                key={`${rowToEdit?.Id_Reserva ?? "new"}-${formOpenToken}`}
                hideModal={async () => {
                  hideModal();
                  await fetchReservas();
                }}
                rowToEdit={rowToEdit}
                estados={Estados}
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