import express from 'express'
import cors from 'cors'
import db from './database/db.js'
import FuncionarioRoutes from './routes/FuncionarioRoutes.js'
import EquipoRoutes from './routes/EquipoRoutes.js'
import ReactivosRoutes from './routes/ReactivosRoutes.js'
import sup_plantasRoutes from './routes/sup_plantasRoutes.js'
import CronogramaRoutes from './routes/CronogramaRoutes.js'
import PracticaRoutes from './routes/PracticaRoutes.js'
import ReservaRoutes from './routes/ReservaRoutes.js'

import dotenv from 'dotenv'

import PracticaModel from './models/PracticaModel.js'
import ReservaModel from './models/ReservaModel.js'


const app = express()

//Middleware
app.use(express.json())//para leer json en req.body
app.use(cors()) //habilitar CORS

//Rutas
app.use('/api/Funcionario', FuncionarioRoutes)
app.use('/api/Equipo', EquipoRoutes)
app.use('/api/Reactivo', ReactivosRoutes)
app.use('/api/Sup_Planta', sup_plantasRoutes)
app.use('/api/Cronograma', CronogramaRoutes)
app.use('/api/Practica', PracticaRoutes)
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
    res.send('API de gestion de funcionario')
})

dotenv.config() //cargar .env
//servidor
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server up running in http://localhost:${PORT}`)
})

// UNA reserva tiene muchas prácticas
ReservaModel.hasMany(PracticaModel, {
  foreignKey: 'Id_Reserva',
  as: 'Practicas'
});

// UNA práctica pertenece a UNA reserva
PracticaModel.belongsTo(ReservaModel, {
  foreignKey: 'Id_Reserva',
  as: 'Reserva'
});




export default app