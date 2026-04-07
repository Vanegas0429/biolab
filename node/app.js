import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/db.js';

// Rutas
import FuncionarioRoutes from './routes/FuncionarioRoutes.js';
import EquipoRoutes from './routes/EquipoRoutes.js';
import ReactivosRoutes from './routes/ReactivosRoutes.js';
import sup_plantasRoutes from './routes/sup_plantasRoutes.js';
import CronogramaRoutes from './routes/CronogramaRoutes.js';
import ReservaReactivoRoutes from './routes/ReservaReactivoRoutes.js';
import ReservaEquipoRoutes from './routes/ReservaEquipoRoutes.js';
import ReservaActividadRoutes from './routes/ReservaActividadRoutes.js';
import ReservaMaterialRoutes from './routes/ReservaMaterialRoutes.js';
import ReservaEstadoRoutes from './routes/ReservaEstadoRoutes.js';
import EstadoRoutes from './routes/EstadoRoutes.js';
import ReservaRoutes from './routes/ReservaRoutes.js';
import EquipoModel from './models/EquipoModel.js';
import ProduccionRoutes from './routes/ProduccionRoutes.js';
import EspeciesRoutes from './routes/EspeciesRoutes.js';
import PracticaRoutes from './routes/PracticaRoutes.js';
import EntradaRoutes from './routes/EntradaRoutes.js'

// Modelos
import PracticaModel from './models/PracticaModel.js';
import ReservaModel from './models/ReservaModel.js';
import UsuarioRouter from './routes/UsuarioRoutes.js';
import EntradaModel from './models/EntradaModel.js';
import ReactivosModel from './models/ReactivosModel.js';
import ProduccionModel from './models/ProduccionModel.js';
import EspeciesModel from './models/EspeciesModel.js';
import Sup_plantasModel from './models/sup_plantasModel.js';

// Configuración
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas API
app.use('/api/Funcionario', FuncionarioRoutes);
app.use('/api/Equipo', EquipoRoutes);
app.use('/api/Reactivo', ReactivosRoutes);
app.use('/api/Sup_Plantas', sup_plantasRoutes);
app.use('/api/Cronograma', CronogramaRoutes);
app.use('/api/Produccion', ProduccionRoutes);
app.use('/api/Especie', EspeciesRoutes);
app.use('/api/Reserva', ReservaRoutes);
app.use('/api/Practica', PracticaRoutes)
app.use('/api/auth', UsuarioRouter);
app.use('/api/Entrada', EntradaRoutes)
app.use('/uploads', express.static('public/uploads'));
// Conexión a BD
try {
    await db.authenticate();
    console.log('Conexión a la base de datos');
} catch (error) {
    console.error('Error al conectar la base de datos: ', error);
    process.exit(1);
}

// Ruta base
app.get('/', (req, res) => {
    res.send('API de gestion de BD');
});

// Relaciones
ReservaModel.hasMany(PracticaModel, {
  foreignKey: 'Id_Reserva',
  as: 'Practicas'
});

PracticaModel.belongsTo(ReservaModel, {
  foreignKey: 'Id_Reserva',
  as: 'Reserva'
});

ProduccionModel.belongsTo(EspeciesModel, { foreignKey: 'Id_especie', as: 'Especie'});
EspeciesModel.hasMany(ProduccionModel, { foreignKey: 'Id_especie', as: 'Producciones'});

Sup_plantasModel.belongsTo(ProduccionModel, { foreignKey: 'Id_produccion', as: 'Produccion'});
ProduccionModel.hasMany(Sup_plantasModel, { foreignKey: 'Id_produccion', as: 'SupPlantas'});

EntradaModel.belongsTo(ReactivosModel, { foreignKey: 'Id_reactivo', as: 'Reactivo'});
ReactivosModel.hasMany(EntradaModel, { foreignKey: 'Id_reactivo', as: 'Entrada'});

// Servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server up running in http://localhost:${PORT}`);

});

export default app;