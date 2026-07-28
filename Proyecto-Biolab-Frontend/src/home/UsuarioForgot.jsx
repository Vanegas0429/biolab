import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiNode from "../api/axiosConfig.js";
import logo from "../assets/logo.png";

const UsuarioForgot = () => {
    const [correo, setCorreo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const gestionarReset = async (e) => {
        e.preventDefault();
        
        const correoLimpio = correo.trim();
        if (!correoLimpio) {
            setErrorMsg("Por favor ingrese su correo electrónico");
            return;
        }

        setIsLoading(true);
        setErrorMsg("");

        try {
            const response = await apiNode.post("/api/auth/forgot-password", { correo: correoLimpio });
            setIsLoading(false);
            setModalMessage(response.data?.message || "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.");
            setShowModal(true);
        } catch (error) {
            setIsLoading(false);
            // Mensaje controlado ante falla de red o servidor
            setErrorMsg(error.response?.data?.message || "Ocurrió un error al procesar la solicitud. Por favor intente más tarde.");
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
                        Ingrese su correo electrónico registrado para recibir las instrucciones de restablecimiento.
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
                                disabled={isLoading}
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
                        <Link to="/login" className="text-decoration-none small fw-bold text-primary">
                            <i className="fa-solid fa-arrow-left me-2"></i>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </form>
            </div>

            {/* MODAL DE INFORMACIÓN */}
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
                                        Solicitud Recibida
                                    </h4>
                                    <p className="text-muted mb-4">
                                        {modalMessage}
                                    </p>
                                    <button 
                                        className="btn btn-primary w-100 py-2 rounded-pill shadow-sm"
                                        onClick={() => {
                                            setShowModal(false);
                                            navigate("/login");
                                        }}
                                    >
                                        <i className="fa-solid fa-right-to-bracket me-2"></i>
                                        Entendido y Volver al Login
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
