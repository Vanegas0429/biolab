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

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
          // Asumimos formato YYYY-MM-DD y HH:mm
          const dateStr = `${reserva.Fec_Reserva}T${reserva.Hor_Reserva}`;
          const startDate = new Date(dateStr);
          
          // Por defecto las reservas duran 2 horas
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
    let backgroundColor = '#3174ad';
    if (event.estado === 'Solicitado') backgroundColor = '#f0ad4e';
    if (event.estado === 'Aprobado') backgroundColor = '#0275d8';
    if (event.estado === 'En proceso') backgroundColor = '#5bc0de';
    if (event.estado === 'Finalizado') backgroundColor = '#5cb85c';

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="container-fluid mt-4 fade-in" style={{ height: '80vh' }}>
      <h2 className="mb-4 text-center fw-bold" style={{ color: 'var(--primary-color)' }}>
        <i className="fa-regular fa-calendar-days me-2"></i>Calendario de Reservas
      </h2>
      
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm p-3 h-100 border-0 rounded-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            defaultDate={new Date()}
            views={['month', 'week', 'day', 'agenda']}
            style={{ height: '100%' }}
            messages={{
              next: "Sig",
              previous: "Ant",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              date: "Fecha",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "No hay eventos en este rango.",
              showMore: total => `+ ${total} más`
            }}
            eventPropGetter={eventStyleGetter}
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
