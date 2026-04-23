import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
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

  const eventStyleGetter = (event, start, end, isSelected) => {
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
              noEventsInRange: "No hay eventos en este rango."
            }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={e => alert(`Reserva: ${e.title}\nEstado: ${e.estado}\nContacto: ${e.resource.Tel_Solicitante} / ${e.resource.Cor_Solicitante}`)}
          />
        </div>
      )}
    </div>
  );
};

export default Calendario;
