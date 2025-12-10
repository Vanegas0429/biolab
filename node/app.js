import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './database/db.js'

// Rutas
import FuncionarioRoutes from './routes/FuncionarioRoutes.js'
import EquipoRoutes from './routes/EquipoRoutes.js'
import ReactivosRoutes from './routes/ReactivosRoutes.js'
import sup_plantasRoutes from './routes/sup_plantasRoutes.js'
import CronogramaRoutes from './routes/CronogramaRoutes.js'
import PracticaRoutes from './routes/PracticaRoutes.js'
import ReservaRoutes from './routes/ReservaRoutes.js'

// Modelos
import PracticaModel from './models/PracticaModel.js'
import ReservaModel from './models/ReservaModel.js'

// Configuración
dotenv.config()

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())

// Rutas API
app.use('/api/Funcionario', FuncionarioRoutes)
app.use('/api/Equipo', EquipoRoutes)
app.use('/api/Reactivo', ReactivosRoutes)
app.use('/api/Sup_Planta', sup_plantasRoutes)
app.use('/api/Cronograma', CronogramaRoutes)
app.use('/api/Practica', PracticaRoutes)
app.use('/api/Reserva', ReservaRoutes)

// Conexión a BD
try {
    await db.authenticate()
    console.log('Conexión a la base de datos')
} catch (error) {
    console.error('Error al conectar la base de datos: ', error)
    process.exit(1)
}

// Ruta base
app.get('/', (req, res) => {
    res.send('Hola Mundo ADSO')
})

// Relaciones
ReservaModel.hasMany(PracticaModel, {
  foreignKey: 'Id_Reserva',
  as: 'Practicas'
})

PracticaModel.belongsTo(ReservaModel, {
  foreignKey: 'Id_Reserva',
  as: 'Reserva'
})

// Servidor
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server up running in http://localhost:${PORT}`)
})

export default app