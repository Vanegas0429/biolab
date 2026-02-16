import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { BrowserRouter } from 'react-router-dom'

import CrudEquipos from './Equipos/CrudEquipos.jsx'

// import CrudEquipos from './Equipos/CrudEquipos.jsx'
// import EquiposForm from './Equipos/EquiposForm.jsx'

import CrudReservaReactivo from './ReservaReactivo/CrudReservaReactivo.jsx'
import ReservaReactivoForm from './ReservaReactivo/ReservaReactivoForm.jsx'

import CrudReservaMaterial from './ReservaMaterial/CrudReservaMaterial.jsx'
import ReservaMaterialForm from './ReservaMaterial/ReservaMaterialForm.jsx'

import CrudReservaEstado from './ReservaEstado/CrudReservaEstado.jsx'
import ReservaEstadoForm from './ReservaEstado/ReservaEstadoForm.jsx'

import CrudSup_Plantas from './Sup_Plantas/CrudSup_Plantas.jsx'
import Sup_PlantasForm from './Sup_Plantas/Sup_PlantasForm.jsx'

import CrudEspecies from './Especies/CrudEspecies.jsx'

import CrudProduccion from './Produccion/CrudProduccion.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*<App />
    <CrudReactivos/>
    <ReactivosForm/>
    <CrudFuncionarios/>
    <FuncionarioForm/>
    <CrudEquipos/>
    <EquiposForm/>
    <CrudCronograma/>
    <CronogramaForm/>
    <CrudLotes/>
    <LotesForm/>
    <CrudInsumos/>
    <InsumosForm/>
    <Sup_PlantasForm /> 
    <CrudEspecies/>
    <CrudSup_Plantas/>  
    <ProduccionForm/>
    <CrudProduccion/> */}
    <CrudEspecies/>
  </StrictMode>,
)

