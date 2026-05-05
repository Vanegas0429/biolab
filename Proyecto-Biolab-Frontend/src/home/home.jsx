// src/home/Home.jsx
import laboratorioImg from "../assets/laboratorio.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userObj = localStorage.getItem('UsuarioLaboratorio');
    if (userObj) {
      try {
        setUser(JSON.parse(userObj));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  return (
    <div className="home-wrapper">
      {/* HERO SECTION */}
      <div
        className="hero-section d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url(${laboratorioImg})`,
          minHeight: "70vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div className="hero-content container fade-in">
          <h1 className="display-1 fw-bold text-uppercase tracking-tighter" style={{ letterSpacing: "-2px" }}>
            {user ? `¡Hola, ${user.nombre.split(' ')[0]}!` : "BIOLAB"}
          </h1>
          <p className="lead mt-3 mb-5 mx-auto opacity-75" style={{ maxWidth: "700px", fontSize: "1.25rem" }}>
            Gestión inteligente de laboratorios para el impulso de la ciencia y la tecnología en el SENA.
          </p>
          
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            {user ? (
              <>
                <Link to="/Reserva" className="btn btn-success btn-lg px-5 py-3 rounded-pill shadow-lg hover-scale">
                  <i className="fa-solid fa-calendar-plus me-2"></i>Nueva Reserva
                </Link>
                <Link to="/Reserva" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill hover-scale">
                  <i className="fa-solid fa-list-check me-2"></i>Mis Solicitudes
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg hover-scale">
                  Ingresar al Sistema
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill hover-scale">
                  Crear Cuenta
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Subtle animated wave or decoration */}
        <div className="hero-decoration"></div>
      </div>

      {/* QUICK STATS / INFO */}
      <div className="container mt-n5 position-relative" style={{ marginTop: "-50px", zIndex: 10 }}>
        <div className="row g-4 justify-content-center">
          {[
            { icon: "flask", title: "Control Total", desc: "Monitoreo en tiempo real de recursos.", color: "#10b981" },
            { icon: "microscope", title: "Equipos", desc: "Catálogo completo y disponibilidad.", color: "#3b82f6" },
            { icon: "clipboard-check", title: "Eficiencia", desc: "Procesos de reserva optimizados.", color: "#8b5cf6" }
          ].map((stat, i) => (
            <div className="col-md-4 col-lg-3" key={i}>
              <Link to={stat.title === "Equipos" ? "/Equipo" : "#"} className="text-decoration-none">
                <div className="card border-0 shadow-lg p-4 text-center hover-up h-100" style={{ borderTop: `4px solid ${stat.color}` }}>
                  <div className="icon-circle mb-3 mx-auto" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                    <i className={`fas fa-${stat.icon} fs-3`}></i>
                  </div>
                  <h5 className="fw-bold text-dark">{stat.title}</h5>
                  <p className="text-muted small mb-0">{stat.desc}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <div className="container my-5 py-5">
        <div className="row align-items-center mb-5">
          <div className="col-md-6 pe-lg-5 mb-4 mb-md-0">
            <h6 className="text-primary text-uppercase fw-bold ls-2 mb-3">Sobre la plataforma</h6>
            <h2 className="display-5 fw-bold mb-4">Innovación tecnológica en el laboratorio</h2>
            <p className="text-muted mb-4" style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
              BIOLAB es la solución integral diseñada para optimizar cada aspecto de la gestión de laboratorios. 
              Desde la reserva de espacios hasta el seguimiento de materiales y equipos de alta precisión.
            </p>
            <ul className="list-unstyled mb-5">
              <li className="mb-3 d-flex align-items-center">
                <i className="fa-solid fa-circle-check text-success me-3"></i>
                <span>Gestión de materiales y reactivos en tiempo real</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="fa-solid fa-circle-check text-success me-3"></i>
                <span>Calendario interactivo de prácticas y visitas</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="fa-solid fa-circle-check text-success me-3"></i>
                <span>Reportes y auditoría de uso de recursos</span>
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <div className="image-stack position-relative">
              <img
                src={laboratorioImg}
                alt="Laboratorio"
                className="img-fluid rounded-4 shadow-2xl position-relative z-index-2 hover-zoom"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-dark text-white py-5 mt-5">
        <div className="container text-center py-4">
          <h2 className="fw-bold mb-4">¿Listo para comenzar tu práctica?</h2>
          <p className="lead opacity-75 mb-5">Únete a los cientos de usuarios que ya optimizan su tiempo con BIOLAB.</p>
          <Link to="/Reserva" className="btn btn-primary btn-lg px-5 rounded-pill shadow-lg">
            Hacer una reserva ahora
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <span className="fw-bold fs-4 ls-2 text-primary">BIOLAB</span>
              <p className="small opacity-50 mt-2 mb-0">Sistema de Gestión de Laboratorios - Centro de Formación SENA</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end gap-3 mb-3">
                <a href="#" className="text-white opacity-75 hover-opacity-100"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-white opacity-75 hover-opacity-100"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-white opacity-75 hover-opacity-100"><i className="fab fa-instagram"></i></a>
              </div>
              <small className="opacity-50">© {new Date().getFullYear()} BIOLAB. Todos los derechos reservados.</small>
            </div>
          </div>
        </div>
      </footer>

      {/* CUSTOM STYLES FOR THIS PAGE */}
      <style>{`
        .ls-2 { letter-spacing: 2px; }
        .hover-scale { transition: transform 0.3s ease; }
        .hover-scale:hover { transform: scale(1.05); }
        .hover-up { transition: all 0.3s ease; }
        .hover-up:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
        .icon-circle { width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .hover-glass:hover { background: rgba(255,255,255,0.05); backdrop-filter: blur(5px); }
        .hover-border-primary:hover { border-color: var(--primary-color) !important; }
        .z-index-2 { z-index: 2; }
        .z-index-3 { z-index: 3; }
        .hero-section h1 { animation: slideUp 0.8s ease-out; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;