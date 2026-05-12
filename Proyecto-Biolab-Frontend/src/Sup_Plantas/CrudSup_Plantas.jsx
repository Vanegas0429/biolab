import { useState, useEffect, useMemo } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from "react-data-table-component";
import Sup_PlantasForm from "./Sup_PlantasForm.jsx";
import ProduccionForm from "../Produccion/ProduccionForm.jsx";
import Swal from "sweetalert2";

const CrudSup_Plantas = () => {
  const [Sup_Plantas, setSup_Plantas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowToEdit, setRowToEdit] = useState(null);
  const [rowToViewProduccion, setRowToViewProduccion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAllSup_Plantas = async () => {
    try {
      setIsLoading(true);
      const response = await apiAxios.get("/api/Sup_Plantas?include=Produccion");
      setSup_Plantas(response.data);
    } catch (error) {
      console.error("Error cargando supervisión de plantas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllSup_Plantas();
  }, []);

  const toggleEstado = async (row) => {
    const estadoNuevo = row.Estado === 'Activo' ? 'Inactivo' : 'Activo';
    const result = await Swal.fire({
      title: `¿${estadoNuevo === 'Activo' ? 'Activar' : 'Inactivar'} supervisión?`,
      text: `Lote: ${row.Num_lote}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/Sup_Plantas/${row.Id_supervision}`, { ...row, Estado: estadoNuevo });
      getAllSup_Plantas();
      Swal.fire({ title: 'Estado actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };

  const filteredItems = useMemo(() => {
    const text = filterText.toLowerCase();
    return Sup_Plantas.filter((uso) =>
      uso.Num_lote?.toString().toLowerCase().includes(text) ||
      uso.Med_Cultivo?.toLowerCase().includes(text) ||
      uso.Met_Propagacion?.toLowerCase().includes(text)
    );
  }, [Sup_Plantas, filterText]);

  const hideModal = () => {
    const btn = document.getElementById('closeModal')
    if (btn) btn.click()
  }

  return (
    <div className="container-fluid py-4 fade-in">
      {/* HEADER */}
      <div className="row mb-4 align-items-center g-3">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '50px', height: '50px' }}>
              <i className="fa-solid fa-flask-vial fs-4"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Supervisión de Plantas</h2>
              <p className="text-muted mb-0 small">Seguimiento detallado de desarrollo en medios de cultivo.</p>
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
              placeholder="Buscar supervisión..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => setRowToEdit(null)}
          >
            <i className="fa-solid fa-plus me-2"></i>Nueva Supervisión
          </button>
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM CON DATATABLE */}
      <div className="card border-0 shadow-lg overflow-hidden table-responsive-custom" style={{ borderRadius: '20px' }}>
        <DataTable
          columns={[
            { name: 'ID', selector: row => row?.Id_supervision ?? "N/A", sortable: true, width: '80px' },
            { name: 'LOTE', selector: row => row?.Num_lote ?? "N/A", sortable: true, width: '100px' },
            { name: 'MEDIO CULTIVO', selector: row => row?.Med_Cultivo ?? "N/A", sortable: true, width: '150px' },
            { name: 'MÉTODO PROP...', selector: row => row?.Met_Propagacion ?? "N/A", sortable: true, width: '150px' },
            { name: 'F. INICIAL', selector: row => row?.Fc_Iniciales ?? 0, sortable: true, width: '100px', center: "true" },
            { name: 'BAC', selector: row => row?.Fc_Bacterias ?? 0, sortable: true, width: '80px', center: "true" },
            { name: 'HON', selector: row => row?.Fc_Hongos ?? 0, sortable: true, width: '80px', center: "true" },
            { name: 'S/D', selector: row => row?.Fs_Desarrollo ?? 0, sortable: true, width: '80px', center: "true" },
            { name: 'BR', selector: row => row?.Fd_BR ?? 0, sortable: true, width: '70px', center: "true" },
            { name: 'RA', selector: row => row?.Fd_RA ?? 0, sortable: true, width: '70px', center: "true" },
            { name: 'CA', selector: row => row?.Fd_CA ?? 0, sortable: true, width: '70px', center: "true" },
            { name: 'MOR', selector: row => row?.Fd_MOR ?? 0, sortable: true, width: '70px', center: "true" },
            { name: 'GER', selector: row => row?.Fd_GER ?? 0, sortable: true, width: '70px', center: "true" },
            { name: 'ENDUR.', selector: row => row?.Num_endurecimiento ?? 0, sortable: true, width: '100px', center: "true" },
            {
              name: 'PRODUCCIÓN',
              width: '120px',
              center: "true",
              cell: row => (
                <div className="d-flex align-items-center gap-2">
                  {row.Produccion && (
                    <button
                      className="btn-action"
                      style={{ background: '#f1f5f9', color: '#64748b' }}
                      title="Ver Producción"
                      data-bs-toggle="modal"
                      data-bs-target="#modalProduccionView"
                      onClick={() => setRowToViewProduccion(row.Produccion)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  )}
                </div>
              )
            },
            {
              name: 'ESTADO',
              sortable: true,
              center: "true",
              width: '150px',
              cell: row => (
                <span
                  className={`status-badge ${row.Estado === 'Activo' ? 'status-badge-activo' : 'status-badge-inactivo'}`}
                  onClick={() => toggleEstado(row)}
                  style={{ cursor: 'pointer' }}
                >
                  {row.Estado}
                </span>
              )
            },
            {
              name: 'ACCIONES',
              center: "true",
              width: '120px',
              cell: row => (
                <button
                  className="btn-action btn-action-edit"
                  onClick={() => setRowToEdit(row)}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  title="Editar"
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              )
            }
          ]}
          data={filteredItems}
          pagination
          highlightOnHover
          persistTableHead
          progressPending={isLoading}
          noDataComponent={
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-folder-open fs-1 mb-3 d-block opacity-25"></i>
              No se encontraron registros de supervisión.
            </div>
          }
          conditionalRowStyles={[
            {
              when: row => row.Estado === "Inactivo",
              style: {
                backgroundColor: "#f8fafc",
                color: "#94a3b8",
                opacity: 0.8
              }
            }
          ]}
        />
      </div>

      {/* Modal Formulario */}
      <div className="modal fade" id="exampleModal" tabIndex="-1">
        <div className="modal-dialog modal-lg border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                {rowToEdit ? "Editar Supervisión" : "Agregar Nueva Supervisión"}
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" id="closeModal"></button>
            </div>
            <div className="modal-body p-4">
              <Sup_PlantasForm
                hideModal={hideModal}
                refreshList={getAllSup_Plantas}
                rowToEdit={rowToEdit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ver Producción (Solo Lectura) */}
      <div className="modal fade" id="modalProduccionView" tabIndex="-1">
        <div className="modal-dialog modal-lg border-0">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-secondary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">Detalles de Producción</h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4 position-relative">
              <div className="position-absolute w-100 h-100 start-0 top-0" style={{ zIndex: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
              <ProduccionForm
                rowToEdit={rowToViewProduccion}
                isViewOnly={true}
              />
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudSup_Plantas;