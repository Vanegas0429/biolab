import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from 'react-data-table-component';
import EstadoForm from './EstadoForm.jsx';

const CrudEstado = () => {
  const [Estado, setEstado] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowToEdit, setRowToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEstado();

    // Auto-refresh cada 15 segundos
    const interval = setInterval(() => {
      getAllEstado();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getAllEstado = async () => {
    try {
      const response = await apiAxios.get('/api/Estado');
      setEstado(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando estados:", error);
      setLoading(false);
    }
  };

  const hideModal = () => {
    const btn = document.getElementById('closeModalEstado');
    if (btn) btn.click();
    setRowToEdit(null);
  };

  const newListEstado = Estado.filter((uso) => {
    const textToSearch = filterText.toLowerCase();
    return (uso.Tip_Estado || '').toLowerCase().includes(textToSearch);
  });

  const columnsTable = [
    { name: 'ESTADO', selector: row => row.Tip_Estado, sortable: true, grow: 2 },
    {
      name: 'ACCIONES',
      center: true,
      width: '120px',
      cell: (row) => (
        <button
          className="btn-action btn-action-edit"
          onClick={() => setRowToEdit(row)}
          data-bs-toggle="modal"
          data-bs-target="#modalEstado"
          title="Editar"
        >
          <i className="fa-solid fa-pencil"></i>
        </button>
      )
    }
  ];

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4 fade-in">
      {/* HEADER */}
      <div className="row mb-4 align-items-center g-3">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '50px', height: '50px' }}>
              <i className="fa-solid fa-list-check fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Gestión de Estados</h2>
              <p className="text-muted mb-0 small">Administración de estados de solicitudes y reservas.</p>
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
              placeholder="Buscar estado..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalEstado"
            onClick={() => setRowToEdit(null)}
          >
            <i className="fa-solid fa-plus me-2"></i>Nuevo Estado
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={columnsTable}
          data={newListEstado}
          keyField="Id_Estado"
          pagination
          highlightOnHover
          noDataComponent={
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-folder-xmark fs-1 mb-3 d-block opacity-25"></i>
              No se encontraron estados.
            </div>
          }
        />
      </div>

      {/* Modal formulario */}
      <div className="modal fade" id="modalEstado" tabIndex="-1">
        <div className="modal-dialog modal-md border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                {rowToEdit ? "Editar Estado" : "Agregar Nuevo Estado"}
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" id="closeModalEstado"></button>
            </div>
            <div className="modal-body p-4">
              <EstadoForm
                hideModal={hideModal}
                refreshList={getAllEstado}
                rowToEdit={rowToEdit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudEstado;