import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import apiNode from "../api/axiosConfig.js";
import logo from "../assets/logo.png";
import Swal from 'sweetalert2';

const ResetPassword = () => {
    const { token } = useParams();
    const [nuevaContraseña, setNuevaContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const gestionarReset = async (e) => {
        e.preventDefault();

        if (nuevaContraseña !== confirmarContraseña) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
                icon: 'error'
            });
            return;
        }

        if (nuevaContraseña.length < 8) {
            Swal.fire({
                title: 'Error',
                text: 'La contraseña debe tener al menos 8 caracteres.',
                icon: 'error'
            });
            return;
        }

        setIsLoading(true);

        try {
            await apiNode.post("/api/auth/reset-password", { 
                token, 
                nuevaContraseña 
            });
            
            Swal.fire({
                title: 'Contraseña Actualizada',
                text: 'Su contraseña ha sido restablecida exitosamente. Ya puede iniciar sesión.',
                icon: 'success',
                confirmButtonColor: 'var(--primary-color)'
            });
            setIsLoading(false);
            navigate("/Login");

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'El enlace es inválido o ha expirado.',
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
                    <h2 className="fw-bold mb-2" style={{ color: "var(--primary-color)" }}>Crear Contraseña</h2>
                    <p className="text-muted small">
                        Ingrese su nueva contraseña.
                    </p>
                </div>

                <form onSubmit={gestionarReset}>
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold small">Nueva Contraseña</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="fa-solid fa-lock text-muted"></i>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control border-start-0 border-end-0 shadow-none"
                                value={nuevaContraseña}
                                onChange={(e) => setNuevaContraseña(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
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

                    <div className="mb-4">
                        <label className="form-label text-secondary fw-semibold small">Confirmar Contraseña</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="fa-solid fa-lock text-muted"></i>
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control border-start-0 border-end-0 shadow-none"
                                value={confirmarContraseña}
                                onChange={(e) => setConfirmarContraseña(e.target.value)}
                                placeholder="Confirme su contraseña"
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary border-start-0 bg-white"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1}
                                style={{ borderColor: "#dee2e6" }}
                            >
                                <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-muted`}></i>
                            </button>
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
                            <i className="fa-solid fa-save me-2"></i>
                        )}
                        Guardar Contraseña
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

export default ResetPassword;
