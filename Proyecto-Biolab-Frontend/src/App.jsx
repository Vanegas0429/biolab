import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import CrudPractica from './Practica/CrudPractica'
import CrudReserva from './Reserva/CrudReserva'
import NavBar from './navBar'
import Home from './home/home'

function App() {
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/Practica' element={<CrudPractica />}></Route>
      <Route path='/Reserva' element={<CrudReserva />}></Route>
    </Routes>
    </>
  )
  }
export default App