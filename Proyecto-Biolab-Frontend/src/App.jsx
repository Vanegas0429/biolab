import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import CrudPractica from './Practica/CrudPractica'
import CrudReserva from './Reserva/CrudReserva'
import NavBar from './navBar'
import Home from './home/home'
import CrudEspecie from './Especies/CrudEspecies'
import CrudSup_Plantas from './Sup_Plantas/CrudSup_Plantas'
import CrudProduccion from './Produccion/CrudProduccion'
import CrudEquipos from './Equipos/CrudEquipos'

function App() {
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/Practica' element={<CrudPractica />}></Route>
      <Route path='/Reserva' element={<CrudReserva />}></Route>
      <Route path='/Especie' element={<CrudEspecie />}></Route>
      <Route path='/Sup_Plantas' element={<CrudSup_Plantas />}></Route>
      <Route path='/Produccion' element={<CrudProduccion />}></Route>
      <Route path='/Equipo' element={<CrudEquipos />}></Route>
    </Routes>
    </>
  )
  }
export default App