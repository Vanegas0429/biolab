import axios from "axios";
import Swal from "sweetalert2";

const apiNode = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

// Bandera para evitar abrir múltiples alertas simultáneas si varias peticiones fallan a la vez
let isSessionExpiredAlertOpen = false;

// agregar token automáticamente en cada petición
apiNode.interceptors.request.use((config) => {
  try {
    const rawUser = localStorage.getItem("UsuarioLaboratorio");
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (error) {
    console.error("Error al obtener token de localStorage:", error);
  }

  return config;
});

// Interceptar respuestas para detectar expiración de sesión (401)
apiNode.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const url = error.config?.url || "";
    const isAuthRoute = url.includes("/login") || url.includes("/register") || url.includes("/Forgot") || url.includes("/RestablecerPassword");

    if (status === 401 && !isAuthRoute) {
      const stored = localStorage.getItem("UsuarioLaboratorio");

      // Si había una sesión activa guardada, avisar y redirigir
      if (stored && !isSessionExpiredAlertOpen) {
        isSessionExpiredAlertOpen = true;
        localStorage.removeItem("UsuarioLaboratorio");

        Swal.fire({
          title: "Sesión expirada",
          text: "Tu sesión ha caducado por límite de tiempo. Por favor, vuelve a iniciar sesión para continuar.",
          icon: "warning",
          confirmButtonText: "Ir a Iniciar Sesión",
          confirmButtonColor: "#059669",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          isSessionExpiredAlertOpen = false;
          window.location.href = "/login";
        });
      }
    }

    return Promise.reject(error);
  }
);

export default apiNode;