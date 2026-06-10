import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiNode from "../api/axiosConfig.js";
import logo from "../assets/logo.png";

const UsuarioForgot = () => {
    const [correo, setCorreo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const gestionarReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            await apiNode.post("/api/auth/forgot-password", { correo });
            setIsLoading(false);
            setShowModal(true);

        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'No se pudo procesar la solicitud');
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

                {errorMsg && (
                    <div className="alert alert-danger text-center py-2 mb-3">
                        <small>{errorMsg}</small>
                    </div>
                )}

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

            {/* MODAL DE ÉXITO - Revisar correo */}
            {showModal && (
                <>
                    <div 
                        className="modal-backdrop fade show"
                        style={{ zIndex: 1040 }}
                    ></div>
                    <div 
                        className="modal fade show d-block" 
                        tabIndex="-1"
                        style={{ zIndex: 1050 }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                                <div className="modal-body text-center p-5">
                                    <div 
                                        className="d-inline-flex align-items-center justify-content-center mb-4"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #d4edda, #c3e6cb)"
                                        }}
                                    >
                                        <i className="fa-solid fa-envelope-circle-check fa-2x" style={{ color: "#28a745" }}></i>
                                    </div>
                                    <h4 className="fw-bold mb-3" style={{ color: "var(--primary-color)" }}>
                                        ¡Revisa tu correo!
                                    </h4>
                                    <p className="text-muted mb-4">
                                        Hemos enviado las instrucciones de recuperación a <strong>{correo}</strong>. 
                                        Revisa tu bandeja de entrada y sigue los pasos indicados.
                                    </p>
                                    <button 
                                        className="btn btn-primary w-100 py-2 rounded-pill shadow-sm"
                                        onClick={() => {
                                            setShowModal(false);
                                            navigate("/Login");
                                        }}
                                    >
                                        <i className="fa-solid fa-right-to-bracket me-2"></i>
                                        Iniciar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UsuarioForgot;
