// src/home/Home.jsx

import laboratorioImg from '../assets/laboratorio.png'; // tu imagen en assets

const Home = () => {
  return (
    <div 
      className="container my-5"
    >
      <div className="row align-items-center">

        {/* Columna izquierda: imagen */}
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img 
            src={laboratorioImg} 
            alt="Laboratorio BIOLAB" 
            className="img-fluid rounded shadow" 
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        {/* Columna derecha: texto y formulario */}
        <div className="col-md-6">
          <h1 className="fw-bold text-success">Bienvenido a BIOLAB</h1>
          <p className="lead text-muted">
            Sistema de Gestión de Laboratorio. Aquí puedes reservar tu laboratorio de forma rápida y sencilla.
          </p>

          <div className="card p-4 shadow" style={{ borderRadius: '15px' }}>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;