import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Swal from 'sweetalert2';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import apiAxios from '../api/axiosConfig.js';
import './Calendario.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, view, onView, onNavigate }) => {
  const goToBack = () => onNavigate('PREV');
  const goToNext = () => onNavigate('NEXT');
  const goToToday = () => onNavigate('TODAY');

  return (
    <div className="rbc-toolbar d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-4 bg-white rounded-4 shadow-sm border border-light">
      <div className="d-flex gap-2 mb-3 mb-md-0">
        <button 
          className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm nav-btn-calendar" 
          onClick={goToBack} 
          type="button"
          title="Anterior"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button 
          className="btn btn-primary px-4 rounded-pill shadow-sm fw-bold" 
          onClick={goToToday} 
          type="button"
        >
          Hoy
        </button>
        <button 
          className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm nav-btn-calendar" 
          onClick={goToNext} 
          type="button"
          title="Siguiente"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="mb-3 mb-md-0">
        <h3 className="fw-bold text-dark text-capitalize mb-0" style={{ letterSpacing: '-1px' }}>
          {label}
        </h3>
      </div>

      <div className="btn-group p-1 bg-light rounded-pill shadow-inner">
        {[
          { id: 'month', label: 'Mes' },
          { id: 'week', label: 'Semana' },
          { id: 'day', label: 'Día' },
          { id: 'agenda', label: 'Agenda' }
        ].map(v => (
          <button
            key={v.id}
            type="button"
            className={`btn btn-sm px-3 rounded-pill border-0 fw-semibold transition-all ${view === v.id ? 'btn-primary shadow-sm' : 'text-muted'}`}
            onClick={() => onView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await apiAxios.get('/api/Reserva');
      const reservas = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
      
      const mappedEvents = reservas
        .filter(r => r.Booleano === 'Activo' && r.Des_Estado !== 'Rechazado' && r.Des_Estado !== 'Cancelado')
        .map(reserva => {
          const dateStr = `${reserva.Fec_Reserva}T${reserva.Hor_Reserva}`;
          const startDate = new Date(dateStr);
          const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

          return {
            title: `${reserva.Tip_Reserva} - ${reserva.Nom_Solicitante}`,
            start: startDate,
            end: endDate,
            allDay: false,
            resource: reserva,
            estado: reserva.Des_Estado
          };
        });

      setEvents(mappedEvents);
    } catch (error) {
      console.error('Error cargando reservas para el calendario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    if (event.estado === 'Solicitado') backgroundColor = 'linear-gradient(135deg, #f59e0b, #d97706)';
    if (event.estado === 'Aprobado') backgroundColor = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    if (event.estado === 'En proceso') backgroundColor = 'linear-gradient(135deg, #06b6d4, #0891b2)';
    if (event.estado === 'Finalizado') backgroundColor = 'linear-gradient(135deg, #10b981, #059669)';

    return {
      style: {
        background: backgroundColor,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
        padding: '2px 8px',
        fontWeight: '500',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontSize: '0.8rem'
      }
    };
  };

  return (
    <div className="container-fluid py-4 fade-in" style={{ minHeight: '90vh' }}>
      <div className="d-flex align-items-center justify-content-center gap-3 mb-5 text-center flex-column flex-md-row">
        <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-lg" style={{ width: '60px', height: '60px' }}>
          <i className="fa-regular fa-calendar-check fs-3"></i>
        </div>
        <div>
          <h1 className="display-6 fw-bold mb-0" style={{ color: 'var(--secondary-color)', letterSpacing: '-1px' }}>Agenda BIOLAB</h1>
          <p className="text-muted mb-0">Gestión visual de reservas y recursos.</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-grow text-primary" role="status"></div>
        </div>
      ) : (
        <div className="calendar-container bg-white p-2 rounded-4 shadow-lg border-0">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={(v) => setView(v)}
            date={date}
            onNavigate={(d) => setDate(d)}
            style={{ height: '75vh' }}
            messages={{
              noEventsInRange: "No hay reservas en este periodo.",
              showMore: total => `+ ${total} adicionales`
            }}
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: CustomToolbar
            }}
            onSelectEvent={async (e) => {
              try {
                const resId = e.resource.Id_Reserva;
                Swal.fire({
                  title: 'Cargando detalles...',
                  allowOutsideClick: false,
                  didOpen: () => Swal.showLoading()
                });

                const response = await apiAxios.get(`/api/Reserva/${resId}`);
                const data = response.data || {};
                const r = data.reserva || {};
                
                const equipos = data.equipos || [];
                const materiales = data.materiales || [];
                const reactivos = data.reactivos || [];

                Swal.fire({
                  title: `<span class="fw-bold text-primary">${r.Tip_Reserva || 'Reserva'}</span>`,
                  width: '600px',
                  html: `
                    <div class="text-start p-2" style="font-size: 0.9rem;">
                      <div class="row mb-3 bg-light p-3 rounded-3 shadow-sm mx-0">
                        <div class="col-6">
                          <p class="mb-1 text-muted small">SOLICITANTE</p>
                          <h6 class="fw-bold mb-0">${r.Nom_Solicitante || 'N/A'}</h6>
                          <p class="small text-secondary mb-0">CC: ${r.Doc_Solicitante || 'N/A'}</p>
                        </div>
                        <div class="col-6 text-end">
                          <p class="mb-1 text-muted small">ESTADO ACTUAL</p>
                          <span class="badge ${e.estado === 'Finalizado' ? 'bg-success' : 'bg-primary'} px-3 py-2 rounded-pill">${e.estado || 'N/A'}</span>
                        </div>
                      </div>

                      <div class="row mb-3">
                        <div class="col-6">
                          <p class="mb-1 text-muted small"><i class="fa-solid fa-calendar-day me-2"></i>FECHA</p>
                          <p class="fw-semibold">${r.Fec_Reserva || 'N/A'}</p>
                        </div>
                        <div class="col-6">
                          <p class="mb-1 text-muted small"><i class="fa-solid fa-clock me-2"></i>HORA</p>
                          <p class="fw-semibold">${r.Hor_Reserva || 'N/A'}</p>
                        </div>
                        <div class="col-6">
                          <p class="mb-1 text-muted small"><i class="fa-solid fa-users me-2"></i>APRENDICES</p>
                          <p class="fw-semibold">${r.Can_Aprendices || 0}</p>
                        </div>
                        <div class="col-6">
                          <p class="mb-1 text-muted small"><i class="fa-solid fa-hashtag me-2"></i>FICHA</p>
                          <p class="fw-semibold">${r.Num_Ficha || 'N/A'}</p>
                        </div>
                      </div>

                      <hr>

                      <div class="mb-3">
                        <h6 class="fw-bold text-secondary mb-2"><i class="fa-solid fa-toolbox me-2"></i>RECURSOS ASIGNADOS</h6>
                        <div class="d-flex flex-wrap gap-2">
                          ${equipos.length > 0 ? `<span class="badge bg-outline-primary border border-primary text-primary px-3 py-2"><i class="fa-solid fa-microscope me-2"></i>${equipos.length} Equipos</span>` : ''}
                          ${materiales.length > 0 ? `<span class="badge bg-outline-info border border-info text-info px-3 py-2"><i class="fa-solid fa-box me-2"></i>${materiales.length} Materiales</span>` : ''}
                          ${reactivos.length > 0 ? `<span class="badge bg-outline-warning border border-warning text-warning px-3 py-2"><i class="fa-solid fa-flask me-2"></i>${reactivos.length} Reactivos</span>` : ''}
                          ${equipos.length === 0 && materiales.length === 0 && reactivos.length === 0 ? '<p class="text-muted small italic">No hay recursos vinculados.</p>' : ''}
                        </div>
                      </div>

                      <div class="bg-dark text-white p-3 rounded-3 mt-4">
                        <div class="d-flex justify-content-between align-items-center">
                          <span><i class="fa-solid fa-phone me-2"></i>${r.Tel_Solicitante || 'N/A'}</span>
                          <span><i class="fa-solid fa-envelope me-2"></i>${r.Cor_Solicitante || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  `,
                  showCloseButton: true,
                  confirmButtonText: 'Cerrar',
                  confirmButtonColor: '#6c757d',
                  customClass: {
                    popup: 'rounded-4 border-0 shadow-lg'
                  }
                });
              } catch (error) {
                console.error("Error cargando detalles:", error);
                Swal.fire('Error', 'No se pudieron cargar los detalles de la reserva', 'error');
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Calendario;
