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

  const hideModal = () => {
    const btn = document.getElementById("closeModal");
    if (btn) btn.click();
    setRowToEdit({});
  };

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

  const onCreate = () => {
    setRowToEdit({});
    setFormOpenToken((prev) => prev + 1);
  };

  const onEdit = (row) => {
    setRowToEdit({ ...(row ?? {}) });
    setFormOpenToken((prev) => prev + 1);
  };

  const columnsTable = useMemo(
    () => [
      { name: "ID", selector: (row) => row?.Id_Reserva ?? "", sortable: true },
      { name: "Tipo", selector: (row) => row?.Tip_Reserva ?? "", sortable: true },
      { name: "Estado", selector: (row) => row?.Des_Estado ?? "", sortable: true },
      { name: "Motivo R/C", selector: (row) => row?.Mot_RecCan ?? "", sortable: true },
      { name: "Solicitante", selector: (row) => row?.Nom_Solicitante ?? "", sortable: true },
      { name: "Documento", selector: (row) => row?.Doc_Solicitante ?? "", sortable: true },
      { name: "Correo", selector: (row) => row?.Cor_Solicitante ?? "", sortable: true },
      { name: "Teléfono", selector: (row) => row?.Tel_Solicitante ?? "", sortable: true },
      { name: "Aprendices", selector: (row) => row?.Can_Aprendices ?? "", sortable: true },
      { name: "Fecha", selector: (row) => row?.Fec_Reserva ?? "", sortable: true },
      { name: "Hora", selector: (row) => row?.Hor_Reserva ?? "", sortable: true },
      { name: "Ficha", selector: (row) => row?.Num_Ficha ?? "", sortable: true },
      { name: "Activo/Inactivo", selector: (row) => row?.Booleano ?? "", sortable: true },
      {
        name: "Acciones",
        cell: (row) => (
          <button
            type="button"
            className="btn btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalReserva"
            onClick={() => onEdit(row)}
            title="Editar"
          >
            ✏️
          </button>
        ),
      },
    ],
    []
  );

  const filteredItems = useMemo(() => {
    const t = filterText.toLowerCase().trim();
    if (!t) return Reserva;

    return (Reserva ?? []).filter((row) => {
      const r = row ?? {};
      const values = [
        r.Id_Reserva,
        r.Tip_Reserva,
        r.Des_Estado,
        r.Mot_RecCan,
        r.Nom_Solicitante,
        r.Doc_Solicitante,
        r.Cor_Solicitante,
        r.Tel_Solicitante,
        r.Can_Aprendices,
        r.Fec_Reserva,
        r.Hor_Reserva,
        r.Num_Ficha,
        r.Booleano,
      ]
        .filter((v) => v !== null && v !== undefined)
        .join(" ")
        .toLowerCase();

      return values.includes(t);
    });
  }, [Reserva, filterText]);

  const modalTitle = rowToEdit?.Id_Reserva ? "Editar reserva" : "Nueva reserva";

  return (
    <>
      <div className="container mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Reservas</h4>

          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalReserva"
            onClick={onCreate}
          >
            Nueva reserva
          </button>
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Buscar..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <DataTable
          columns={columnsTable}
          data={filteredItems}
          pagination
          progressPending={isLoading}
          highlightOnHover
          striped
          persistTableHead
          noDataComponent="No hay registros"
        />
      </div>

      <div className="modal fade" id="modalReserva" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
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
              <button id="closeModal" type="button" className="btn btn-secondary" data-bs-dismiss="modal">
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