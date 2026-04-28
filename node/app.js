import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/db.js';

// Rutas
import ActividadRoutes from './routes/ActividadRoutes.js'
import ActividadEquipoRoutes from './routes/ActividadEquipoRoutes.js'
import ActividadMaterialRoutes from './routes/ActividadMaterialRoutes.js'
import ActividadReactivoRoutes from './routes/ActividadReactivoRoutes.js'
import EquipoRoutes from './routes/EquipoRoutes.js';
import ReactivosRoutes from './routes/ReactivosRoutes.js';
import sup_plantasRoutes from './routes/sup_plantasRoutes.js';
import ReservaReactivoRoutes from './routes/ReservaReactivoRoutes.js';
import ReservaEquipoRoutes from './routes/ReservaEquipoRoutes.js';
import ReservaActividadRoutes from './routes/ReservaActividadRoutes.js';
import ReservaMaterialRoutes from './routes/ReservaMaterialRoutes.js';
import ReservaEstadoRoutes from './routes/ReservaEstadoRoutes.js';
import EstadoRoutes from './routes/EstadoRoutes.js';
import ReservaRoutes from './routes/ReservaRoutes.js';
import ProduccionRoutes from './routes/ProduccionRoutes.js';
import EspeciesRoutes from './routes/EspeciesRoutes.js';
import PracticaRoutes from './routes/PracticaRoutes.js';
import EntradaRoutes from './routes/EntradaRoutes.js'
import UsuarioRouter from './routes/UsuarioRoutes.js';
import MaterialRoutes from './routes/MaterialRoutes.js'

// Modelos
import PracticaModel from './models/PracticaModel.js';
import ReservaModel from './models/ReservaModel.js';
import ReservaEstadoModel from './models/ReservaEstadoModel.js';
import EstadoModel from './models/EstadoModel.js';
import EntradaModel from './models/EntradaModel.js';
import ReactivosModel from './models/ReactivosModel.js';
import ProduccionModel from './models/ProduccionModel.js';
import EspeciesModel from './models/EspeciesModel.js';
import Sup_plantasModel from './models/sup_plantasModel.js';
import ActividadEquipoModel from './models/ActividadEquipoModel.js';
import ActividadModel from './models/ActividadModel.js';
import EquipoModel from './models/EquipoModel.js';
import ActividadMaterialModel from './models/ActividadMaterialModel.js';
import MaterialModel from './models/MaterialModel.js';
import ActividadReactivoModel from './models/ActividadReactivoModel.js';
import ReservaActividadModel from './models/ReservaActividadModel.js';
import ReservaEquipoModel from './models/ReservaEquipoModel.js';
import ReservaMaterialModel from './models/ReservaMaterialModel.js';
import ReservaReactivoModel from './models/ReservaReactivoModel.js';

// Configuración
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas API
app.use('/api/Equipo', EquipoRoutes);
app.use('/api/Reactivo', ReactivosRoutes);
app.use('/api/Sup_Plantas', sup_plantasRoutes);
app.use('/api/Produccion', ProduccionRoutes);
app.use('/api/Especie', EspeciesRoutes);
app.use('/api/Reserva', ReservaRoutes);
app.use('/api/Practica', PracticaRoutes)
app.use('/api/Entrada', EntradaRoutes)
app.use('/api/Material', MaterialRoutes)
app.use('/api/Actividad', ActividadRoutes)
app.use('/api/ActividadEquipo', ActividadEquipoRoutes)
app.use('/api/ActividadMaterial', ActividadMaterialRoutes)
app.use('/api/ActividadReactivo', ActividadReactivoRoutes)
app.use('/api/ReservaActividad', ReservaActividadRoutes)
app.use('/api/ReservaEquipo', ReservaEquipoRoutes)
app.use('/api/ReservaEstado', ReservaEstadoRoutes)
app.use('/api/ReservaMaterial', ReservaMaterialRoutes)
app.use('/api/ReservaReactivo', ReservaReactivoRoutes)
app.use('/api/Estado', EstadoRoutes);
app.use('/api/auth', UsuarioRouter);
app.use('/uploads', express.static('public/uploads'));

// Conexión a BD
try {
    await db.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
} catch (error) {
    console.error('Error al conectar la base de datos: ', error);
    process.exit(1);
}

// Ruta base
app.get('/', (req, res) => {
    res.send('API de gestion de BD');
});

// ==========================================
// DEFINICIÓN DE RELACIONES (FOREIGN KEYS)
// ==========================================

// Especie -> Produccion
ProduccionModel.belongsTo(EspeciesModel, { foreignKey: 'Id_especie', as: 'Especie'});
EspeciesModel.hasMany(ProduccionModel, { foreignKey: 'Id_especie', as: 'Producciones'});

// Produccion -> Sup_Plantas
Sup_plantasModel.belongsTo(ProduccionModel, { foreignKey: 'Id_produccion', as: 'Produccion'});
ProduccionModel.hasMany(Sup_plantasModel, { foreignKey: 'Id_produccion', as: 'SupPlantas'});

// Reactivos -> Entrada
EntradaModel.belongsTo(ReactivosModel, { foreignKey: 'Id_reactivo', as: 'Reactivo'});
ReactivosModel.hasMany(EntradaModel, { foreignKey: 'Id_reactivo', as: 'Entradas'});

// Actividad -> ActividadEquipo
ActividadEquipoModel.belongsTo(ActividadModel, { foreignKey: 'Id_Actividad', as: 'Actividad'});
ActividadModel.hasMany(ActividadEquipoModel, { foreignKey: 'Id_Actividad', as: 'ActividadEquipos'});

// Equipo -> ActividadEquipo
ActividadEquipoModel.belongsTo(EquipoModel, { foreignKey: 'id_equipo', as: 'Equipo'});
EquipoModel.hasMany(ActividadEquipoModel, { foreignKey: 'id_equipo', as: 'ActividadEquipos'});

// Actividad -> ActividadMaterial
ActividadMaterialModel.belongsTo(ActividadModel, { foreignKey: 'Id_Actividad', as: 'Actividad'});
ActividadModel.hasMany(ActividadMaterialModel, { foreignKey: 'Id_Actividad', as: 'ActividadMateriales'});

// Material -> ActividadMaterial
ActividadMaterialModel.belongsTo(MaterialModel, { foreignKey: 'Id_Material', as: 'Material'});
MaterialModel.hasMany(ActividadMaterialModel, { foreignKey: 'Id_Material', as: 'ActividadMateriales'});

// Actividad -> ActividadReactivo
ActividadReactivoModel.belongsTo(ActividadModel, { foreignKey: 'Id_Actividad', as: 'Actividad'});
ActividadModel.hasMany(ActividadReactivoModel, { foreignKey: 'Id_Actividad', as: 'ActividadReactivos'});

// Reactivos -> ActividadReactivo
ActividadReactivoModel.belongsTo(ReactivosModel, { foreignKey: 'Id_Reactivo', as: 'Reactivo'});
ReactivosModel.hasMany(ActividadReactivoModel, { foreignKey: 'Id_Reactivo', as: 'ActividadReactivos'});

// Reserva -> Recursos (Relaciones Muchos a Muchos con tablas intermedias)
ReservaEquipoModel.belongsTo(ReservaModel, { foreignKey: 'Id_Reserva', as: 'Reserva' });
ReservaModel.hasMany(ReservaEquipoModel, { foreignKey: 'Id_Reserva', as: 'ReservaEquipos' });
ReservaEquipoModel.belongsTo(EquipoModel, { foreignKey: 'Id_Equipo', as: 'Equipo' });
EquipoModel.hasMany(ReservaEquipoModel, { foreignKey: 'Id_Equipo', as: 'ReservaEquipos' });

ReservaMaterialModel.belongsTo(ReservaModel, { foreignKey: 'Id_Reserva', as: 'Reserva' });
ReservaModel.hasMany(ReservaMaterialModel, { foreignKey: 'Id_Reserva', as: 'ReservaMateriales' });
ReservaMaterialModel.belongsTo(MaterialModel, { foreignKey: 'Id_Material', as: 'Material' });
MaterialModel.hasMany(ReservaMaterialModel, { foreignKey: 'Id_Material', as: 'ReservaMateriales' });

ReservaReactivoModel.belongsTo(ReservaModel, { foreignKey: 'Id_Reserva', as: 'Reserva' });
ReservaModel.hasMany(ReservaReactivoModel, { foreignKey: 'Id_Reserva', as: 'ReservaReactivos' });
ReservaReactivoModel.belongsTo(ReactivosModel, { foreignKey: 'Id_Reactivo', as: 'Reactivo' });
ReactivosModel.hasMany(ReservaReactivoModel, { foreignKey: 'Id_Reactivo', as: 'ReservaReactivos' });

// Reserva -> Actividades
ReservaActividadModel.belongsTo(ReservaModel, { foreignKey: 'Id_Reserva', as: 'Reserva' });
ReservaModel.hasMany(ReservaActividadModel, { foreignKey: 'Id_Reserva', as: 'ReservaActividades' });
ReservaActividadModel.belongsTo(ActividadModel, { foreignKey: 'Id_Actividad', as: 'Actividad' });
ActividadModel.hasMany(ReservaActividadModel, { foreignKey: 'Id_Actividad', as: 'ReservaActividades' });

// Reserva -> Estados
ReservaEstadoModel.belongsTo(ReservaModel, { foreignKey: 'Id_Reserva', as: 'Reserva' });
ReservaModel.hasMany(ReservaEstadoModel, { foreignKey: 'Id_Reserva', as: 'ReservaEstados' });
ReservaEstadoModel.belongsTo(EstadoModel, { foreignKey: 'Id_Estado', as: 'Estado' });
EstadoModel.hasMany(ReservaEstadoModel, { foreignKey: 'Id_Estado', as: 'ReservaEstados' });

// Practica -> Reserva
PracticaModel.belongsTo(ReservaModel, { foreignKey: 'Id_Reserva', as: 'Reserva' });
ReservaModel.hasMany(PracticaModel, { foreignKey: 'Id_Reserva', as: 'Practicas' });

// Sincronización de la base de datos (aplica las relaciones físicamente)
try {
    await db.sync({ alter: true });
    console.log('Base de datos sincronizada con todas las relaciones.');
} catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
}

// Servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server up running in http://localhost:${PORT}`);
});


export default app;