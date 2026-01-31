import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // importar variable del .env

const apiAxios = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiAxios;
