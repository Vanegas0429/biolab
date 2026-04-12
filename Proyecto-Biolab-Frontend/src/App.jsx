import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import CrudPractica from './Practica/CrudPractica'
import CrudReservaEstado from './ReservaEstado/CrudReservaEstado'
import CrudReserva from './Reserva/CrudReserva'
import CrudReservaEquipo from './ReservaEquipo/CrudReservaEquipo'
import CrudActividad from './Actividad/CrudActividad'
import Home from './home/home'

function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/Practica' element={<CrudPractica />}></Route>
      <Route path='/Reserva' element={<CrudReserva />} ></Route>
      <Route path="/ReservaEstado" element={<CrudReservaEstado />} ></Route>
      <Route path='/ReservaEquipo' element={<CrudReservaEquipo/>}></Route>
      <Route path='/Actividad' element={<CrudActividad/>}></Route>
    </Routes>

    </>
  )
}

export default App