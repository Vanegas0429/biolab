import express from 'express'
import cors from 'cors'
import db from './database/db.js'
import FuncionarioRoutes from './routes/FuncionarioRoutes.js'
import EquipoRoutes from './routes/EquipoRoutes.js'
import InsumusRoutes from './routes/InsumosRoutes.js'
import LotesRoutes from './routes/LotesRoutes.js'
import PlantaRoutes from './routes/PlantaRoutes.js'
import ReactivosRoutes from './routes/ReactivosRoutes.js'
import sup_plantasRoutes from './routes/sup_plantasRoutes.js'
import UsoEquipoRoutes from './routes/UsoEquipoRoutes.js'
import CronogramaRoutes from './routes/CronogramaRoutes.js'
import ReservaReactivoRoutes from './routes/ReservaReactivoRoutes.js'
import ReservaEquipoRoutes from './routes/ReservaEquipoRoutes.js'
import ReservaActividadRoutes from './routes/ReservaActividadRoutes.js'
import ReservaMaterialRoutes from './routes/ReservaMaterialRoutes.js'
import ReservaEstadoRoutes from './routes/ReservaEstadoRoutes.js'
import EstadoRoutes from './routes/EstadoRoutes.js'
import ReservaRoutes from './routes/ReservaRoutes.js'
import dotenv from 'dotenv'


const app = express()

//Middleware
app.use(express.json())//para leer json en req.body
app.use(cors()) //habilitar CORS

//Rutas
app.use('/api/Funcionario', FuncionarioRoutes)
app.use('/api/Equipo', EquipoRoutes)
app.use('/api/Insumo', InsumusRoutes)
app.use('/api/Lote', LotesRoutes)
app.use('/api/Planta', PlantaRoutes)
app.use('/api/Reactivo', ReactivosRoutes)
app.use('/api/Sup_Planta', sup_plantasRoutes)
app.use('/api/Uso_Equipo', UsoEquipoRoutes)
app.use('/api/Cronograma', CronogramaRoutes)
app.use('/api/ReservaReactivo', ReservaReactivoRoutes)
app.use('/api/ReservaEquipo', ReservaEquipoRoutes)
app.use('/api/ReservaActividad', ReservaActividadRoutes)
app.use('/api/ReservaMaterial', ReservaMaterialRoutes)
app.use('/api/ReservaEstado', ReservaEstadoRoutes)
app.use('/api/Estado', EstadoRoutes)
app.use('/api/Reserva', ReservaRoutes)

//conexion a la base de datos
try{
    await db.authenticate()
    console.log('Conexion a la base de datos establecida')
}catch(error){
    console.error('Error al conectar a la base de datos:', error)
    process.exit(1) //finaliza la app si no conecta
}

app.get('/', (req, res) => {
    res.send('API de gestion de BD')
})

dotenv.config() //cargar .env
//servidor
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server up running in http://localhost:${PORT}`)
})
export default app