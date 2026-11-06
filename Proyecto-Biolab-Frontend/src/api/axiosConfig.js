import axios from "axios";
import Swal from "sweetalert2";

const apiNode = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

let isSessionAlertOpen = false;

export const handleSessionExpired = () => {
  if (isSessionAlertOpen) return;
  isSessionAlertOpen = true;

  localStorage.removeItem("UsuarioLaboratorio");

  Swal.fire({
    title: "Sesión expirada",
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding:8px 0;">
        <div style="width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,#fef3c7,#fde68a); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(245,158,11,0.25);">
          <i class="fa-solid fa-clock" style="font-size:32px; color:#d97706;"></i>
        </div>
        <p style="color:#475569; font-size:15px; margin:0; line-height:1.5; text-align:center;">
          Tu sesión ha expirado por inactividad.<br>
          <span style="color:#94a3b8; font-size:13px;">Por favor inicia sesión nuevamente para continuar.</span>
        </p>
      </div>
    `,
    confirmButtonText: '<i class="fa-solid fa-right-to-bracket me-2"></i>Iniciar sesión',
    confirmButtonColor: "#059669",
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: `rgba(15,23,42,0.65)`,
    customClass: {
      popup: 'swal-session-popup',
      confirmButton: 'swal-session-btn'
    }
  }).then(() => {
    isSessionAlertOpen = false;
    window.location.href = "/";
  });
};

// Agregar token automáticamente a cada petición
apiNode.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("UsuarioLaboratorio");
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (e) {
    // Ignorar error de parsing
  }

  return config;
});

// Interceptor de respuesta: interceptar 401 para alertar sobre sesión expirada
apiNode.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // No alertar si es el endpoint de login y fallaron las credenciales normales
    const isLoginEndpoint = url.includes("/api/auth/login");

    if (status === 401 && !isLoginEndpoint) {
      handleSessionExpired();
    }

    return Promise.reject(error);
  }
);

export default apiNode;
