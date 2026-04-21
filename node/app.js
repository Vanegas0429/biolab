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
import ReservaEstadoModel from './models/ReservaModel.js';
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

//Especie -> ProduccionModel 
ProduccionModel.belongsTo(EspeciesModel, { foreignKey: 'Id_especie', as: 'Especie'});
EspeciesModel.hasMany(ProduccionModel, { foreignKey: 'Id_especie', as: 'Producciones'});

//Produccion -> Sup_PlantasModel 
Sup_plantasModel.belongsTo(ProduccionModel, { foreignKey: 'Id_produccion', as: 'Produccion'});
ProduccionModel.hasMany(Sup_plantasModel, { foreignKey: 'Id_produccion', as: 'SupPlantas'});

//Reactivos -> EntradaModel 
EntradaModel.belongsTo(ReactivosModel, { foreignKey: 'Id_reactivo', as: 'Reactivo'});
ReactivosModel.hasMany(EntradaModel, { foreignKey: 'Id_reactivo', as: 'Entrada'});

// Actividad -> ActividadEquipo
ActividadEquipoModel.belongsTo(ActividadModel, { foreignKey: 'Id_Actividad', as: 'Actividad'});
ActividadModel.hasMany(ActividadEquipoModel, { foreignKey: 'Id_Actividad', as: 'ActividadEquipos'});

// Equipo -> ActividadEquipo
ActividadEquipoModel.belongsTo(EquipoModel, { foreignKey: 'id_equipo', as: 'Equipo'});
EquipoModel.hasMany(ActividadEquipoModel, { foreignKey: 'id_equipo', as: 'ActividadEquipos'});

// Actividad -> ActividadMaterial
ActividadMaterialModel.belongsTo(ActividadModel, { foreignKey: 'Id_Actividad', as: 'actividad'});
ActividadModel.hasMany(ActividadMaterialModel, { foreignKey: 'Id_Actividad', as: 'ActividadMateriales'});

// Equipo -> ActividadMaterial
ActividadMaterialModel.belongsTo(MaterialModel, { foreignKey: 'Id_Material', as: 'Material'});
MaterialModel.hasMany(ActividadMaterialModel, { foreignKey: 'Id_Material', as: 'ActividadMateriales'});

// Actividad -> ActividadReactivo
ActividadReactivoModel.belongsTo(ActividadModel, { foreignKey: 'Id_Actividad', as: 'actividades'});
ActividadModel.hasMany(ActividadReactivoModel, { foreignKey: 'Id_Actividad', as: 'ActividadReactivos'});

// Equipo -> ActividadReactivo
ActividadReactivoModel.belongsTo(ReactivosModel, { foreignKey: 'Id_Reactivo', as: 'reactivos'});
ReactivosModel.hasMany(ActividadReactivoModel, { foreignKey: 'Id_Reactivo', as: 'ActividadReactivos'});

// Servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server up running in http://localhost:${PORT}`);

});

export default app;