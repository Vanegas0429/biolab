import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'
import EntradaForm from "./EntradaForm.jsx"
import Swal from "sweetalert2"

const CrudEntrada = () => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [Entrada, setEntrada] = useState([]);
  const [filterText, setFilterText] = useState("");

  const toggleEstado = async (row) => {
    const estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';

    const result = await Swal.fire({
      title: `¿${estadoNuevo === 'Activo' ? 'Activar' : 'Inactivar'} entrada?`,
      text: `Lote: ${row.Lote}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, ${estadoNuevo === 'Activo' ? 'activar' : 'inactivar'}`,
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/Entrada/${row.Id_Entrada}`, { ...row, Estado: estadoNuevo });
      getAllEntradas();
      Swal.fire({ title: 'Estado actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };

  useEffect(() => { getAllEntradas(); }, []);

  const getAllEntradas = async () => {
    try {
      const response = await apiAxios.get('/api/Entrada');
      setEntrada(response.data ?? []);
    } catch (error) {
      console.error("Error cargando entradas:", error);
    }
  };

  const hideModal = () => { document.getElementById('closeModalBtn').click(); };

  const filteredEntradas = useMemo(() => {
    const text = filterText.toLowerCase();
    return Entrada.filter(e =>
      e.Lote?.toLowerCase().includes(text) ||
      e.Reactivo?.Nom_reactivo?.toLowerCase().includes(text) ||
      e.Uni_Medida?.toLowerCase().includes(text)
    );
  }, [Entrada, filterText]);

  return (
    <div className="container-fluid py-4 fade-in">

      {/* HEADER */}
      <div className="row mb-4 align-items-center g-3">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '50px', height: '50px' }}>
              <i className="fa-solid fa-box-open fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Gestión de Entradas</h2>
              <p className="text-muted mb-0 small">Control de entradas y lotes de reactivos.</p>
            </div>
          </div>
        </div>
        <div className="col-md-auto d-flex gap-2 flex-wrap">
          <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border" style={{ width: '300px' }}>
            <span className="input-group-text border-0 bg-transparent ps-3">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 py-2 shadow-none bg-transparent"
              placeholder="Buscar entrada..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalEntrada"
            onClick={() => setRowToEdit(null)}
          >
            <i className="fa-solid fa-plus me-2"></i>Agregar Entrada
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <div className="table-responsive-custom">
          <DataTable
            columns={[
              { name: 'ID', selector: row => row?.Id_Entrada ?? 'N/A', sortable: true, width: '80px' },
              { name: 'REACTIVO', selector: row => row?.Reactivo?.Nom_reactivo ?? 'N/A', sortable: true, grow: 2 },
              { name: 'LOTE', selector: row => row?.Lote ?? 'N/A', sortable: true, width: '120px' },
              { name: 'CANT. INICIAL', selector: row => row?.Can_Inicial ?? 0, sortable: true, width: '130px', center: "true" },
              { name: 'CANT. SALIDA', selector: row => row?.Can_Salida ?? 0, sortable: true, width: '130px', center: "true" },
              { name: 'UND. MEDIDA', selector: row => row?.Uni_Medida ?? 'N/A', sortable: true, width: '130px' },
              { name: 'F. VENCIMIENTO', selector: row => row?.Fec_Vencimiento ?? 'N/A', sortable: true, width: '150px' },
              {
                name: 'ESTADO',
                center: "true",
                width: '130px',
                cell: row => (
                  <span
                    className={`status-badge ${row.Estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleEstado(row)}
                    title="Clic para cambiar estado"
                  >
                    {row.Estado}
                  </span>
                )
              },
              {
                name: 'ACCIONES',
                center: "true",
                width: '100px',
                cell: row => (
                  <button
                    className="btn-action btn-action-edit"
                    onClick={() => setRowToEdit(row)}
                    data-bs-toggle="modal"
                    data-bs-target="#modalEntrada"
                    title="Editar"
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                )
              }
            ]}
            data={filteredEntradas}
            pagination
            highlightOnHover
            persistTableHead
            conditionalRowStyles={[
              { when: row => row.Estado === 'Inactivo', style: { opacity: 0.5 } }
            ]}
            noDataComponent={
              <div className="text-center py-5 text-muted">
                <i className="fa-solid fa-box-open fs-1 mb-3 d-block opacity-25"></i>
                No se encontraron entradas.
              </div>
            }
          />
        </div>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="modalEntrada" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="modal-header bg-primary text-white py-3 px-4">
              <h5 className="modal-title fw-bold">
                <i className="fa-solid fa-box-open me-2"></i>
                {rowToEdit ? 'Editar Entrada' : 'Agregar Nueva Entrada'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                id="closeModalBtn"
              ></button>
            </div>
            <div className="modal-body p-4">
              <EntradaForm
                hideModal={hideModal}
                refreshList={getAllEntradas}
                rowToEdit={rowToEdit}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CrudEntrada;
