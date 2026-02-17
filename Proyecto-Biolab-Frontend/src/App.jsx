
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import equipoRoutes from './routes/EquipoRoutes.js';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta para archivos subidos
app.use('/uploads', express.static(path.join(path.resolve(), 'public/uploads')));

// Montar rutas de equipos
app.use('/api/equipos', equipoRoutes);

// Puerto desde .env o por defecto 8000
const PORT = process.env.PORT || 8000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});