import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from 'react-data-table-component';
import FuncionariosForm from './FuncionarioForm.jsx';

const CrudFuncionarios = () => {
  const [Funcionarios, setFuncionarios] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowToEdit, setRowToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllFuncionarios();

    // Auto-refresh cada 15 segundos
    const interval = setInterval(() => {
      getAllFuncionarios();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getAllFuncionarios = async () => {
    try {
      const response = await apiAxios.get('/api/Funcionario');
      setFuncionarios(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando funcionarios:", error);
      setLoading(false);
    }
  };

  const hideModal = () => {
    const btn = document.getElementById('closeModalFuncionario');
    if (btn) btn.click();
    setRowToEdit(null);
  };

  const newListFuncionarios = Funcionarios.filter((uso) => {
    const textToSearch = filterText.toLowerCase();
    return (
      (uso.Nombre || '').toLowerCase().includes(textToSearch) ||
      (uso.Apellido || '').toLowerCase().includes(textToSearch) ||
      (uso.Correo || '').toLowerCase().includes(textToSearch)
    );
  });

  const columnsTable = [
    { name: 'NOMBRE', selector: row => `${row.Nombre} ${row.Apellido}`, sortable: true, grow: 2 },
    { name: 'TELÉFONO', selector: row => row.Telefono || 'N/A', sortable: true, width: '150px' },
    { name: 'CORREO', selector: row => row.Correo, sortable: true, grow: 2 },
    { name: 'CARGO', selector: row => row.Cargo_Funcionario || 'N/A', sortable: true, width: '180px' },
    {
      name: 'ACCIONES',
      center: true,
      width: '120px',
      cell: (row) => (
        <button
          className="btn-action btn-action-edit"
          onClick={() => setRowToEdit(row)}
          data-bs-toggle="modal"
          data-bs-target="#modalFuncionario"
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
              <i className="fa-solid fa-user-tie fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Gestión de Funcionarios</h2>
              <p className="text-muted mb-0 small">Administración de instructores y personal del laboratorio.</p>
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
              placeholder="Buscar funcionario..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalFuncionario"
            onClick={() => setRowToEdit(null)}
          >
            <i className="fa-solid fa-plus me-2"></i>Nuevo Funcionario
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={columnsTable}
          data={newListFuncionarios}
          keyField="Id_Funcionario"
          pagination
          highlightOnHover
          noDataComponent={
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-user-xmark fs-1 mb-3 d-block opacity-25"></i>
              No se encontraron funcionarios.
            </div>
          }
        />
      </div>

      {/* Modal formulario */}
      <div className="modal fade" id="modalFuncionario" tabIndex="-1">
        <div className="modal-dialog modal-lg border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                {rowToEdit ? "Editar Funcionario" : "Agregar Nuevo Funcionario"}
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" id="closeModalFuncionario"></button>
            </div>
            <div className="modal-body p-4">
              <FuncionariosForm
                hideModal={hideModal}
                refreshList={getAllFuncionarios}
                rowToEdit={rowToEdit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudFuncionarios;