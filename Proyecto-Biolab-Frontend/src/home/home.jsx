// src/home/Home.jsx
import laboratorioImg from "../assets/laboratorio.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const userObj = localStorage.getItem('UsuarioLaboratorio');
    if (userObj) setIsAuth(true);
  }, []);

  return (
    <>
      {/* HERO */}
      <div
        className="hero-section d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${laboratorioImg})`,
        }}
      >
        <div className="fade-in">
          <h1 className="display-2 fw-bold">BIOLAB</h1>
          <p className="lead mt-3">
            Plataforma avanzada para la gestión de laboratorios
          </p>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="container my-5">

        <div className="row align-items-center mb-5 fade-in">
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <img
              src={laboratorioImg}
              alt="Laboratorio"
              className="img-fluid rounded shadow-lg hover-zoom"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>

          <div className="col-md-6">
            <h2 className="fw-bold text-success mb-3">
              Innovación tecnológica
            </h2>
            <p className="text-muted">
              BIOLAB optimiza la gestión de procesos, recursos y actividades dentro
              del laboratorio mediante una plataforma moderna, segura y eficiente.
            </p>
            <p className="text-muted">
              Diseñado para mejorar la organización, el control y la productividad
              en entornos académicos y científicos.
            </p>
            {isAuth && (
              <div className="text-center mt-4">
                <Link to="/Reserva" className="btn btn-success btn-lg px-5 rounded-pill shadow">
                  <i className="fa-solid fa-calendar-check me-2"></i>Haz tu reserva
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CARDS */}
        <div className="row text-center">

          {[
            { icon: "flask", title: "Control total", desc: "Gestión integral del laboratorio" },
            { icon: "boxes", title: "Inventario", desc: "Materiales y equipos organizados" },
            { icon: "chart-line", title: "Optimización", desc: "Procesos más eficientes" },
            { icon: "shield-alt", title: "Seguridad", desc: "Control de accesos y datos" },
          ].map((item, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card-modern p-4 h-100">
                <i className={`fas fa-${item.icon} fs-1 text-success mb-3`}></i>
                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-muted small">{item.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* FRASE */}
      <div className="bg-dark text-white text-center py-3 fade-in">
        <h4 className="fw-light">
          Tecnología que impulsa la ciencia y la innovación
        </h4>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center py-3">
        <small>© {new Date().getFullYear()} BIOLAB - SENA</small>
      </footer>
    </>
  );
};

export default Home;