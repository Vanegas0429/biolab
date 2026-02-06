import express from 'express';
import cors from 'cors';
import equipoRoutes from './routes/EquipoRoutes.js';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta para archivos subidos
app.use('/uploads', express.static(path.join(path.resolve(), 'public/uploads')));

// Montar rutas de equipos
app.use('/api/equipos', equipoRoutes);

// Iniciar servidor
app.listen(8000, () => console.log('Servidor corriendo en http://localhost:8000'));
