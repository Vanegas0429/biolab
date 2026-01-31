import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// import CrudReactivos from './Reactivos/CrudReactivos.jsx'
// import ReactivosForm from './Reactivos/ReactivosForm.jsx'

// import CrudFuncionarios from './Funcionario/CrudFuncionarios.jsx'
// import FuncionarioForm from './Funcionario/FuncionarioForm.jsx'

// import CrudEquipos from './Equipos/CrudEquipos.jsx'
// import EquiposForm from './Equipos/EquiposForm.jsx'

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <CrudReactivos/>
    <ReactivosForm/>
    <CrudFuncionarios/>
    <FuncionarioForm/>
    <CrudEquipos/>
    <EquiposForm/>
    <CrudReservaReactivo/>
    <ReservaReactivoForm/>
    <CrudReservaEquipo />
    <ReservaEquipoForm />
    <CrudReservaActividad />
    <ReservaActividadForm />
    <CrudReservaMaterial />
    <ReservaMaterialForm /> */}
    <CrudReservaEstado />
    <ReservaEstadoForm />
  </StrictMode>,
)