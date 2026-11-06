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
    text: "Tu sesión ha expirado, por favor inicia sesión de nuevo.",
    icon: "warning",
    confirmButtonText: "Iniciar sesión",
    confirmButtonColor: "#10b981",
    allowOutsideClick: false,
    allowEscapeKey: false
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
