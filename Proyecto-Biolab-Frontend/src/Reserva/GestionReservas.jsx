import { useEffect, useMemo, useState } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";
import ReservaForm from "./ReservaForm.jsx";

const GestionReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState("Solicitado"); // Solicitado, En proceso, Finalizado, Cancelado
  const [isLoading, setIsLoading] = useState(false);
  const [rowToEdit, setRowToEdit] = useState({});
  const [formOpenToken, setFormOpenToken] = useState(0);
  const [estados, setEstados] = useState([]);

  const loggedUser = JSON.parse(localStorage.getItem('UsuarioLaboratorio'));

  const fetchReservas = async () => {
    try {
      setIsLoading(true);
      const response = await apiAxios.get("/api/Reserva");
      setReservas(response.data || []);
    } catch (error) {
      console.error("Error cargando reservas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEstados = async () => {
    try {
      const res = await apiAxios.get("/api/Estado");
      setEstados(res.data || []);
    } catch (error) {
      console.error("Error cargando estados:", error);
    }
  };

  useEffect(() => {
    fetchReservas();
    fetchEstados();
  }, []);

  const filteredReservas = useMemo(() => {
    // Primero filtrar por tab
    let list = reservas.filter(r => {
      if (activeTab === "Solicitado") return r.Des_Estado === "Solicitado";
      if (activeTab === "En proceso") return r.Des_Estado === "En proceso" || r.Des_Estado === "Aprobado";
      if (activeTab === "Finalizado") return r.Des_Estado === "Finalizado";
      if (activeTab === "Cancelado") return r.Des_Estado === "Cancelado" || r.Des_Estado === "Rechazado";
      return true;
    });

    // Luego filtrar por texto
    if (filterText.trim()) {
      const t = filterText.toLowerCase();
      list = list.filter(r =>
        String(r.Id_Reserva).includes(t) ||
        r.Nom_Solicitante?.toLowerCase().includes(t) ||
        r.Num_Ficha?.toLowerCase().includes(t)
      );
    }

    return list;
  }, [reservas, activeTab, filterText]);

  const handleStateChange = async (reserva, nuevoEstadoNombre) => {
    const estado = estados.find(e => e.Tip_Estado === nuevoEstadoNombre);
    if (!estado) return;

    if (nuevoEstadoNombre === "Rechazado" || nuevoEstadoNombre === "Cancelado") {
      const { value: motivo } = await Swal.fire({
        title: `Motivo de ${nuevoEstadoNombre === "Rechazado" ? "Rechazo" : "Cancelación"}`,
        input: 'textarea',
        inputLabel: 'Escriba el motivo...',
        inputPlaceholder: 'Escriba aquí...',
        inputAttributes: {
          'aria-label': 'Escriba el motivo'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Atrás',
        confirmButtonColor: '#ef4444',
        inputValidator: (value) => {
          if (!value) {
            return '¡Debe escribir un motivo!'
          }
        }
      });

      if (motivo) {
        try {
          await apiAxios.put(`/api/Reserva/${reserva.Id_Reserva}/estado`, {
            Id_Estado: estado.Id_Estado,
            Mot_RecCan: motivo
          });
          Swal.fire('Actualizado', `Reserva ${nuevoEstadoNombre.toLowerCase()} correctamente`, 'success');
          fetchReservas();
        } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar el estado', 'error');
        }
      }
    } else if (nuevoEstadoNombre === "Finalizado" && Array.isArray(reserva.reactivos) && reserva.reactivos.length > 0) {
      let htmlContent = `<div style="text-align: left;">
        <p class="text-muted small mb-3">Registre la cantidad real utilizada para cada reactivo. Los reactivos sobrantes se devolverán automáticamente al stock.</p>
      `;

      reserva.reactivos.forEach((reac) => {
        htmlContent += `
          <div class="mb-3">
            <label class="form-label fw-bold small mb-1">${reac.Nom_Reactivo} (Pedido: ${reac.Can_Reactivo} ${reac.Uni_Medida || ''})</label>
            <div class="input-group input-group-sm">
              <input 
                type="number" 
                class="form-control swal-reac-input" 
                data-id="${reac.Id_Reactivo}" 
                data-max="${reac.Can_Reactivo}" 
                data-name="${reac.Nom_Reactivo}"
                value="${reac.Can_Reactivo}" 
                min="0" 
                max="${reac.Can_Reactivo}" 
                step="any"
                required
              />
              <span class="input-group-text">${reac.Uni_Medida || ''}</span>
            </div>
          </div>
        `;
      });
      htmlContent += `</div>`;

      const result = await Swal.fire({
        title: 'Finalizar Reserva - Consumo de Reactivos',
        html: htmlContent,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Confirmar y Finalizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'var(--primary-color)',
        preConfirm: () => {
          const inputs = document.querySelectorAll('.swal-reac-input');
          const reactivosUtilizados = [];

          for (let input of inputs) {
            const id = Number(input.getAttribute('data-id'));
            const name = input.getAttribute('data-name');
            const max = Number(input.getAttribute('data-max'));
            const valStr = input.value;

            if (valStr === '') {
              Swal.showValidationMessage(`Por favor ingrese la cantidad utilizada para ${name}`);
              return false;
            }

            const val = Number(valStr);
            if (isNaN(val) || val < 0) {
              Swal.showValidationMessage(`La cantidad para ${name} debe ser un número mayor o igual a 0`);
              return false;
            }

            if (val > max) {
              Swal.showValidationMessage(`La cantidad utilizada para ${name} (${val}) no puede ser mayor que la cantidad pedida (${max})`);
              return false;
            }

            reactivosUtilizados.push({
              Id_Reactivo: id,
              CantidadUtilizada: val
            });
          }

          return reactivosUtilizados;
        }
      });

      if (result.isConfirmed && result.value) {
        try {
          await apiAxios.put(`/api/Reserva/${reserva.Id_Reserva}/estado`, {
            Id_Estado: estado.Id_Estado,
            reactivosUtilizados: result.value
          });
          Swal.fire('Finalizado', 'La reserva ha sido finalizada y los reactivos sobrantes se devolvieron al stock.', 'success');
          fetchReservas();
        } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo finalizar la reserva', 'error');
        }
      }
    } else {
      const result = await Swal.fire({
        title: `¿Cambiar a ${nuevoEstadoNombre}?`,
        text: `La reserva #${reserva.Id_Reserva} pasará a estado ${nuevoEstadoNombre}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'var(--primary-color)'
      });

      if (result.isConfirmed) {
        try {
          await apiAxios.put(`/api/Reserva/${reserva.Id_Reserva}/estado`, {
            Id_Estado: estado.Id_Estado
          });
          Swal.fire('Actualizado', `Estado cambiado a ${nuevoEstadoNombre}`, 'success');
          fetchReservas();
        } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar el estado', 'error');
        }
      }
    }
  };

  const openEditModal = (reserva) => {
    setRowToEdit(reserva);
    setFormOpenToken(prev => prev + 1);
  };

  const openCreateModal = () => {
    setRowToEdit({});
    setFormOpenToken(prev => prev + 1);
  };

  return (
    <div className="container-fluid py-4 fade-in">
      {/* Header & Search */}
      <div className="row mb-4 align-items-center g-3">
        <div className="col-md-6">
          <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border" style={{ maxWidth: '400px' }}>
            <span className="input-group-text border-0 bg-transparent ps-3">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 py-2 shadow-none bg-transparent"
              placeholder="Buscar por ID, nombre o ficha..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 text-md-end">
          <button
            className="btn btn-primary rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalGestionReserva"
            onClick={openCreateModal}
          >
            <i className="fa-solid fa-plus me-2"></i>Nueva Reserva
          </button>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="card border-0 shadow-lg p-4" style={{ borderRadius: '25px', backgroundColor: '#f8fafc !important' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: 'var(--secondary-color)' }}>
              <i className="fa-solid fa-clipboard-check me-2 text-primary"></i>
              Solicitudes Pendientes
            </h2>
            <p className="text-muted small">Gestiona y cambia el estado de cada solicitud</p>
          </div>
          <button className="btn btn-light rounded-pill border shadow-sm btn-sm" onClick={fetchReservas}>
            <i className="fa-solid fa-rotate me-1"></i> Actualizar
          </button>
        </div>

        {/* Tabs */}
        <div className="row g-2 mb-4">
          {[
            { id: 'Solicitado', label: 'Solicitadas', icon: 'fa-paper-plane' },
            { id: 'En proceso', label: 'En Proceso', icon: 'fa-spinner' },
            { id: 'Finalizado', label: 'Finalizadas', icon: 'fa-check-double' },
            { id: 'Cancelado', label: 'Canceladas', icon: 'fa-ban' }
          ].map(tab => (
            <div key={tab.id} className="col-6 col-md-3">
              <button
                className={`btn w-100 py-3 rounded-pill fw-bold transition-all ${activeTab === tab.id ? 'btn-primary shadow' : 'btn-outline-secondary border-dashed'}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ fontSize: '0.9rem', borderStyle: activeTab === tab.id ? 'solid' : 'dashed' }}
              >
                <i className={`fa-solid ${tab.icon} me-2`}></i>
                {tab.label}
              </button>
            </div>
          ))}
        </div>

        {/* Content - Cards */}
        <div className="row g-4">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Cargando solicitudes...</p>
            </div>
          ) : filteredReservas.length === 0 ? (
            <div className="text-center py-5 opacity-50">
              <i className="fa-solid fa-folder-open fs-1 mb-3"></i>
              <p>No hay solicitudes en esta categoría</p>
            </div>
          ) : (
            filteredReservas.map(reserva => (
              <div key={reserva.Id_Reserva} className="col-12">
                <div className="card border shadow-sm hover-shadow transition-all overflow-hidden" style={{ borderRadius: '15px', borderLeft: '5px solid var(--primary-color) !important' }}>
                  <div className="card-header bg-white border-bottom-0 pt-3 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>
                      <span className="text-primary me-2">#{reserva.Id_Reserva}</span>
                      — {reserva.Nom_Solicitante}
                    </h5>
                    <span className={`badge ${reserva.Des_Estado === 'Aprobado' ? 'bg-success' :
                      reserva.Des_Estado === 'En proceso' ? 'bg-warning text-dark' :
                        reserva.Des_Estado === 'Finalizado' ? 'bg-secondary' :
                          (reserva.Des_Estado === 'Rechazado' || reserva.Des_Estado === 'Cancelado') ? 'bg-danger' : 'bg-info'
                      } rounded-pill`}>
                      <i className="fa-solid fa-circle me-1" style={{ fontSize: '0.5rem' }}></i>
                      {reserva.Des_Estado}
                    </span>
                  </div>

                  <div className="card-body px-4 pb-4">
                    <div className="row g-4 mb-4">
                      <div className="col-md-3">
                        <small className="text-muted d-block mb-1"><i className="fa-solid fa-file-lines me-1"></i> Tipo de Resrrva</small>
                        <span className="fw-semibold">{reserva.Tip_Reserva}</span>
                      </div>
                      <div className="col-md-3">
                        <small className="text-muted d-block mb-1"><i className="fa-solid fa-align-left me-1"></i> Nombre del Solictante</small>
                        <span className="fw-semibold">{reserva.Nom_Solicitante}</span>
                      </div>
                      <div className="col-md-2">
                        <small className="text-muted d-block mb-1"><i className="fa-solid fa-hashtag me-1"></i> Ficha</small>
                        <span className="fw-semibold">{reserva.Num_Ficha}</span>
                      </div>
                      <div className="col-md-2">
                        <small className="text-muted d-block mb-1"><i className="fa-solid fa-calendar me-1"></i> Fecha</small>
                        <span className="fw-semibold">{reserva.Fec_Reserva}</span>
                      </div>
                      <div className="col-md-2 text-end">
                        {reserva.Des_Estado === 'Solicitado' && (
                          <button
                            className="btn btn-outline-primary btn-sm rounded-pill"
                            data-bs-toggle="modal"
                            data-bs-target="#modalGestionReserva"
                            onClick={() => openEditModal(reserva)}
                          >
                            <i className="fa-solid fa-pencil me-1"></i> Editar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-light p-3 rounded-4 border">
                      <h6 className="fw-bold mb-3 text-uppercase small letter-spacing-1" style={{ color: '#64748b' }}>
                        <i className="fa-solid fa-boxes-stacked me-2"></i> Recursos Solicitados
                      </h6>

                      <div className="row g-3">
                        {/* Equipos */}
                        <div className="col-md-4">
                          <div className="h-100 p-2 bg-white rounded-3 border-start border-primary border-4 shadow-sm">
                            <h6 className="small fw-bold text-muted mb-2"><i className="fa-solid fa-microscope me-2"></i>EQUIPOS</h6>
                            {reserva.equipos?.length > 0 ? (
                              <div className="list-group list-group-flush">
                                {reserva.equipos.map((e, idx) => (
                                  <div key={idx} className="list-group-item bg-transparent border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                    <span className="small text-truncate me-2" title={e.Nom_Equipo}>{e.Nom_Equipo}</span>
                                    <span className="badge bg-primary-soft text-primary rounded-pill small">{e.Can_Equipos} Unidad</span>
                                  </div>
                                ))}
                              </div>
                            ) : <p className="text-muted small italic mb-0">Ninguno</p>}
                          </div>
                        </div>

                        {/* Materiales */}
                        <div className="col-md-4">
                          <div className="h-100 p-2 bg-white rounded-3 border-start border-success border-4 shadow-sm">
                            <h6 className="small fw-bold text-muted mb-2"><i className="fa-solid fa-boxes-stacked me-2"></i>MATERIALES</h6>
                            {reserva.materiales?.length > 0 ? (
                              <div className="list-group list-group-flush">
                                {reserva.materiales.map((m, idx) => (
                                  <div key={idx} className="list-group-item bg-transparent border-0 px-0 py-1 d-flex justify-content-between align-items-center">
                                    <span className="small text-truncate me-2" title={m.Nom_Material}>{m.Nom_Material}</span>
                                    <span className="badge bg-success-soft text-success rounded-pill small">{m.Can_Materiales} {m.Uni_Medida || 'und'}</span>
                                  </div>
                                ))}
                              </div>
                            ) : <p className="text-muted small italic mb-0">Ninguno</p>}
                          </div>
                        </div>

                        {/* Reactivos */}
                        <div className="col-md-4">
                          <div className="h-100 p-2 bg-white rounded-3 border-start border-info border-4 shadow-sm">
                            <h6 className="small fw-bold text-muted mb-2"><i className="fa-solid fa-flask me-2"></i>REACTIVOS</h6>
                            {reserva.reactivos?.length > 0 ? (
                              <div className="list-group list-group-flush">
                                {reserva.reactivos.map((r, idx) => (
                                  <div key={idx} className="list-group-item bg-transparent border-0 px-0 py-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span className="small text-truncate me-2" title={r.Nom_Reactivo}>{r.Nom_Reactivo}</span>
                                      <span className="badge bg-info-soft text-info rounded-pill small">
                                        {r.Can_Reactivo} {r.Uni_Medida || 'ml/g'}
                                      </span>
                                    </div>
                                    {((r.Reac_Utilizados !== undefined && r.Reac_Utilizados > 0) || (r.Reac_Devueltos !== undefined && r.Reac_Devueltos > 0) || ['Finalizado', 'Cancelado', 'Rechazado'].includes(reserva.Des_Estado)) && (
                                      <div className="mt-1 ps-2 border-start border-2 border-info-subtle small text-muted text-start" style={{ fontSize: '0.85rem' }}>
                                        <div><span className="fw-semibold text-success">Utilizado:</span> {r.Reac_Utilizados ?? 0} {r.Uni_Medida || 'ml/g'}</div>
                                        <div><span className="fw-semibold text-warning">Devuelto:</span> {r.Reac_Devueltos ?? 0} {r.Uni_Medida || 'ml/g'}</div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : <p className="text-muted small italic mb-0">Ninguno</p>}
                          </div>
                        </div>
                      </div>

                      {(!reserva.equipos?.length && !reserva.materiales?.length && !reserva.reactivos?.length) && (
                        <div className="text-center py-2 small text-muted italic">
                          No se solicitaron recursos específicos.
                        </div>
                      )}
                    </div>

                    <div className="mt-4 d-flex gap-2">
                      {reserva.Des_Estado === 'Solicitado' && (
                        <>
                          <button className="btn btn-success rounded-pill px-4" onClick={() => handleStateChange(reserva, "Aprobado")}>
                            <i className="fa-solid fa-check me-2"></i> Aprobar
                          </button>
                          <button className="btn btn-danger rounded-pill px-4" onClick={() => handleStateChange(reserva, "Rechazado")}>
                            <i className="fa-solid fa-xmark me-2"></i> Rechazar
                          </button>
                        </>
                      )}

                      {(reserva.Des_Estado === 'Aprobado') && (
                        <>
                          <button className="btn btn-primary rounded-pill px-4" onClick={() => handleStateChange(reserva, "En proceso")}>
                            <i className="fa-solid fa-play me-2"></i> En Proceso
                          </button>
                          <button className="btn btn-danger rounded-pill px-4" onClick={() => handleStateChange(reserva, "Cancelado")}>
                            <i className="fa-solid fa-ban me-2"></i> Cancelar
                          </button>
                        </>
                      )}

                      {reserva.Des_Estado === 'En proceso' && (
                        <button className="btn btn-success rounded-pill px-4" onClick={() => handleStateChange(reserva, "Finalizado")}>
                          <i className="fa-solid fa-check-double me-2"></i> Finalizar
                        </button>
                      )}

                      {(reserva.Des_Estado === 'Finalizado' || reserva.Des_Estado === 'Cancelado' || reserva.Des_Estado === 'Rechazado') && (
                        <div className="alert alert-secondary py-1 px-3 mb-0 rounded-pill small">
                          <i className="fa-solid fa-info-circle me-2"></i> Solicitud concluida
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para Editar/Crear */}
      <div className="modal fade" id="modalGestionReserva" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold">
                {rowToEdit?.Id_Reserva ? `Editar Reserva #${rowToEdit.Id_Reserva}` : 'Nueva Reserva'}
              </h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              <ReservaForm
                key={`${rowToEdit?.Id_Reserva || 'new'}-${formOpenToken}`}
                hideModal={() => {
                  try {
                    const closeBtn = document.querySelector('#modalGestionReserva .btn-close');
                    if (closeBtn) closeBtn.click();
                  } catch (e) {
                    console.error("Error al cerrar modal:", e);
                  }
                  fetchReservas();
                }}
                rowToEdit={rowToEdit}
                estados={estados}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionReservas;
