import axios from "axios";

const apiNode = axios.create({
  baseURL: "http://localhost:8000",
});

// 🔥 agregar token automáticamente
apiNode.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("UsuarioLaboratorio"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default apiNode;