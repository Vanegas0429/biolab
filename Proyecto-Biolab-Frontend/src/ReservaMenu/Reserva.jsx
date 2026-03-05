// src/Reserva/Reserva.jsx
import CrudReserva from "./CrudReserva"; // Tabla completa
import ReservaForm from "./ReservaForm"; // Formulario público

const Reserva = ({ isAuth }) => {
  return (
    <div className="container mt-4">
      {isAuth ? <CrudReserva /> : <ReservaForm />}
    </div>
  );
};

export default Reserva;