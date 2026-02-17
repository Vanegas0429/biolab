import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { BrowserRouter } from 'react-router-dom'

// Componentes
import CrudEquipos from './Equipos/CrudEquipos.jsx'

import CrudReservaReactivo from './ReservaReactivo/CrudReservaReactivo.jsx'
import ReservaReactivoForm from './ReservaReactivo/ReservaReactivoForm.jsx'

import CrudReservaEquipo from './ReservaEquipo/CrudReservaEquipo.jsx'
import ReservaEquipoForm from './ReservaEquipo/ReservaEquipoForm.jsx'

import CrudReservaActividad from './ReservaActividad/CrudReservaActividad.jsx'
import ReservaActividadForm from './ReservaActividad/ReservaActividadForm.jsx'

import CrudReservaMaterial from './ReservaMaterial/CrudReservaMaterial.jsx'
import ReservaMaterialForm from './ReservaMaterial/ReservaMaterialForm.jsx'

import CrudReservaEstado from './ReservaEstado/CrudReservaEstado.jsx'
import ReservaEstadoForm from './ReservaEstado/ReservaEstadoForm.jsx'

// Si tienes App.jsx, descomenta esta línea
// import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Si tienes App.jsx */}
    {/* <App /> */}

    {/* Tus componentes */}
    <CrudEquipos/>
    {/* Puedes activar otros cuando los necesites */}
    {/* <CrudReservaReactivo /> */}
    {/* <ReservaReactivoForm /> */}
    {/* <CrudReservaEquipo /> */}
    {/* <ReservaEquipoForm /> */}
    {/* <CrudReservaActividad /> */}
    {/* <ReservaActividadForm /> */}
    {/* <CrudReservaMaterial /> */}
    {/* <ReservaMaterialForm /> */}
    {/* <CrudReservaEstado /> */}
    {/* <ReservaEstadoForm /> */}
  </StrictMode>,
)
