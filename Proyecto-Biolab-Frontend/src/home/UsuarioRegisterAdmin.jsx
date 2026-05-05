import { useState } from "react";
import apiNode from "../api/axiosConfig.js";
import logo from "../assets/logo.png";

const UsuarioRegistroAdmin = () => {
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol, setRol] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const gestionarRegistro = async (e) => {
    e.preventDefault();

    try {
      await apiNode.post("/api/auth", {
        nombre,
        documento,
        telefono,
        correo,
        contraseña,
        rol
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
            ✅Usuario creado correctamente
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

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

            <div className="mb-3"> 
              <label className="form-label">Teléfono</label>
              <input 
                type="text"
                className="form-control"
                value={telefono} 
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ingrese el número de teléfono" 
                required 
              /> 
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

            {/* ROL */}
            <div className="mb-2">
              <label className="form-label">Rol</label>
              <select
                className="form-control"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
              >
                <option value="">Selecciona uno</option>
                <option value="instructor">Instructor</option>
                <option value="pasante">Pasante</option>
                <option value="gestor">Gestor</option>
              </select>
            </div>

            <button className="btn btn-success w-100 mt-3">
              Registrar
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default UsuarioRegistroAdmin;