import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiNode from "../api/axiosConfig.js";
import logo from "../assets/logo.png";

const UsuarioRegistro = () => {
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const gestionarRegistro = async (e) => {
    e.preventDefault();

    try {
      await apiNode.post("/api/auth", {
        nombre,
        documento,
        correo,
        contraseña
      });

      setSuccess(true);
      setError(null);

    } catch (err) {
      setError(err.response?.data?.msg || "Error al registrar usuario");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-start"
      style={{ minHeight: "calc(100vh - 90px)", paddingTop: "30px" }}
    >
      <div
        className="card shadow p-3"
        style={{ maxWidth: "500px", width: "100%", borderRadius: "15px" }}
      >

        {/* HEADER */}
        <div className="text-center mb-3">
          <h2 className="text-muted">Registrarse</h2>
          <img src={logo} alt="logo" style={{ width: "100px" }} />
          <p className="text-muted small">
            Sistema de Gestión de Laboratorio SENA
          </p>
        </div>

        {/* ALERTAS */}
        {success && (
          <div className="alert alert-success text-center">
            <strong>Usuario creado correctamente</strong>
            <br />
            <button
              className="btn btn-success mt-2 w-100"
              onClick={() => navigate("/login")}
            >
              Ir a iniciar sesión
            </button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        {!success && (
          <form onSubmit={gestionarRegistro}>

            {/* FILA 1 */}
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Documento</label>
                <input
                  type="text"
                  className="form-control"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3"> <label className="form-label">Correo electrónico</label>
            <input 
            type="email"
             className="form-control"
              value={correo} onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ingrese su correo" 
              required 
              /> 
              </div> 
              
              <div className="mb-3"> <label className="form-label">Contraseña</label> 
              <input type="password" 
              className="form-control" value={contraseña} onChange={(e) => setContraseña(e.target.value)} 
              placeholder="Mínimo 8 caracteres" 
              required 
              /> 
              </div>

            <button
              type="submit"
              className="btn btn-success w-100 mt-3"
            >
              Registrarse
            </button>

            <div className="text-center mt-2">
              <small>
                ¿Ya tienes cuenta?{" "}
                <span
                  style={{ cursor: "pointer", color: "green" }}
                  onClick={() => navigate("/login")}
                >
                  Inicia sesión
                </span>
              </small>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default UsuarioRegistro;