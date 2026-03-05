import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiNode from "../api/axiosConfig.js";
import logo from "../assets/logo.png"; // 👈 IMPORTAMOS EL LOGO

const UsuarioLogin = ({ setIsAuth }) => {

  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const gestionarLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await apiNode.post('/api/auth/login', {
        correo,
        contraseña
      });

      const { usuario } = res.data;

      localStorage.setItem('UsuarioLaboratorio', JSON.stringify(usuario));

      setError(null);
      setIsAuth(true);
      navigate('/Reserva');

    } catch (err) {
      console.error(err);
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #ffffff, #ffffff)" }}
    >

      <div 
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "15px" }}
      >

        {/* LOGO */}
        <div className="text-center mb-3">
          <h1 className="text-muted" style={{ fontSize: "50px" }}>
            Iniciar Sesion
          </h1>
          <img 
            src={logo} 
            alt="BIOLAB Logo"
            style={{ width: "120px" }}
          />
          <h4 className="mt-2 text-success fw-bold"></h4>
          <p className="text-muted" style={{ fontSize: "14px" }}>
            Sistema de Gestión de Laboratorio de Biotecnologia Vegetal SENA 
          </p>
        </div>

        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        <form onSubmit={gestionarLogin}>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ingrese su correo"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          <div className="form-check mb-3">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="rememberMe" 
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Recordarme
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-success w-100 fw-bold"
            style={{ borderRadius: "8px" }}
          >
            Iniciar Sesión
          </button>

        </form>

      </div>

    </div>
  );
};

export default UsuarioLogin;