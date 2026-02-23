import axios from "axios";

const apiAxios = axios.create({
  baseURL: "http://localhost:8000",
});

export default apiAxios;
