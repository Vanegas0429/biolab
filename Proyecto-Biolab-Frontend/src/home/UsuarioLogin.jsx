import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiNode from "../api/axiosConfig.js";
import logo from "../assets/logo.png"; 

const UsuarioLogin = ({ setIsAuth, setUserRol, setUserProfile }) => {

  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const gestionarLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiNode.post("/api/auth/login", { correo, contraseña });
      const { usuario } = res.data;

      localStorage.setItem("UsuarioLaboratorio", JSON.stringify(usuario));
      apiNode.defaults.headers.common["Authorization"] = `Bearer ${usuario.token}`;

      setIsAuth(true);
      if (setUserRol) setUserRol(usuario.rol);
      if (setUserProfile) setUserProfile(usuario);

      // Redirigir según rol
      if (usuario.rol === 'solicitante') {
        navigate("/");
      } else {
        navigate("/Reserva");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Correo o contraseña incorrectos");
    }
  };

  return (
    <div 
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      <div 
        className="card shadow-lg p-5 fade-in"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        {/* LOGO */}
        <div className="text-center mb-4">
          <img 
            src={logo} 
            alt="BIOLAB Logo"
            className="mb-3"
            style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "50%", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
          />
          <h2 className="fw-bold mb-1" style={{ color: "var(--primary-color)", letterSpacing: "2px" }}>BIOLAB</h2>
          <p className="text-muted small">
            Sistema de Gestión de Laboratorio SENA
          </p>
        </div>

        {error && (
          <div className="alert alert-danger text-center shadow-sm py-2">
            <small>{error}</small>
          </div>
        )}

        <form onSubmit={gestionarLogin}>
          <div className="mb-4">
            <label className="form-label text-secondary fw-semibold small">Correo electrónico</label>
            <input
              type="email"
              className="form-control shadow-sm"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ej. usuario@sena.edu.co"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary fw-semibold small">Contraseña</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control shadow-sm border-end-0"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary border-start-0 bg-white"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{ borderColor: "#dee2e6" }}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-muted`}></i>
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">

            <div className="form-check mb-0">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="rememberMe" 
              />
              <label className="form-check-label text-muted small" htmlFor="rememberMe">
                Recordar mis datos
              </label>
            </div>
            <a 
              href="/Forgot" 
              className="text-decoration-none small fw-bold text-primary"
              onClick={(e) => {
                e.preventDefault();
                navigate("/Forgot");
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 shadow-sm"
          >
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsuarioLogin;