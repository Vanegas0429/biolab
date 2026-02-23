import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiNode from "../api/axiosConfig.js";

// Se agrega la prop { setIsAuth } para actualizar el estado global de la app
const UsuarioLogin = ({ setIsAuth }) => { 
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const gestionarLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await apiNode.post('/api/auth/login', {
        correo: correo,
        contraseña: contraseña
      });

      const { usuario } = res.data;

      // Guardar en el storage con el nombre de tu proyecto
      localStorage.setItem('UsuarioLaboratorio', JSON.stringify(usuario));

      // --- LOGICA NUEVA AGREGADA ---
      setError(null);
      setIsAuth(true); // Actualiza el estado de autenticación a TRUE
      navigate('/Equipo'); // Redirige a la ruta protegida de tu flujo
      // -----------------------------

    } catch (err) {
      console.error(err);
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <>
      <div className="container py-3 my-3">
        <div className="col-12 col-md-4 m-auto bg-info p-4 rounded-1">
          
          {/* Uso de && para mostrar error solo si se cumple la condición */}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={gestionarLogin}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Correo electronico
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              <div id="emailHelp" className="form-text">
                Nunca compartiremos su correo electrónico con nadie más.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="exampleCheck1" 
              />
              <label className="form-check-label" htmlFor="exampleCheck1">
                Recuerdame
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UsuarioLogin;