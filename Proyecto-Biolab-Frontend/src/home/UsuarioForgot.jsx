import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiNode from "../api/axiosConfig.js";
import logo from "../assets/logo.png";
import Swal from 'sweetalert2';

const UsuarioForgot = () => {
    const [correo, setCorreo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const gestionarReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await apiNode.post("/api/auth/forgot-password", { correo });
            
            Swal.fire({
                title: 'Correo Enviado',
                text: 'Se han enviado las instrucciones de recuperación a su correo electrónico.',
                icon: 'success',
                confirmButtonColor: 'var(--primary-color)'
            });
            setIsLoading(false);
            navigate("/Login");

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo procesar la solicitud',
                icon: 'error'
            });
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="container-fluid d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh", padding: "2rem", background: "#f1f5f9" }}
        >
            <div 
                className="card shadow-lg p-5 fade-in"
                style={{ maxWidth: "450px", width: "100%", borderRadius: '24px', border: 'none' }}
            >
                <div className="text-center mb-4">
                    <img 
                        src={logo} 
                        alt="BIOLAB Logo"
                        className="mb-3"
                        style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                    />
                    <h2 className="fw-bold mb-2" style={{ color: "var(--primary-color)" }}>Recuperar Acceso</h2>
                    <p className="text-muted small">
                        Ingrese su correo electrónico para recibir las instrucciones de restablecimiento.
                    </p>
                </div>

                <form onSubmit={gestionarReset}>
                    <div className="mb-4">
                        <label className="form-label text-secondary fw-semibold small">Correo Electrónico</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="fa-solid fa-envelope text-muted"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control border-start-0 shadow-none"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                placeholder="Ej. usuario@sena.edu.co"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary w-100 py-2 mb-3 shadow-sm rounded-pill"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : (
                            <i className="fa-solid fa-paper-plane me-2"></i>
                        )}
                        Enviar Instrucciones
                    </button>

                    <div className="text-center mt-3">
                        <Link to="/Login" className="text-decoration-none small fw-bold text-primary">
                            <i className="fa-solid fa-arrow-left me-2"></i>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsuarioForgot;
