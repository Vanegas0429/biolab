import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import CrudReactivos from './Reactivos/CrudReactivos.jsx'
import ReactivosForm from './Reactivos/ReactivosForm.jsx'

import CrudFuncionarios from './Funcionario/CrudFuncionarios.jsx'
import FuncionarioForm from './Funcionario/FuncionarioForm.jsx'

import CrudEquipos from './Equipos/CrudEquipos.jsx'
import EquiposForm from './Equipos/EquiposForm.jsx'

import CrudCronograma from './Cronogramas/CrudCronograma.jsx'
import CronogramaForm from './Cronogramas/CronogramaForm.jsx'

import CrudLotes from './Lotes/CrudLotes.jsx'
import LotesForm from './Lotes/LotesForm.jsx'

import CrudInsumos from './Insumos/CrudInsumos.jsx'
import InsumosForm from './Insumos/InsumosForm.jsx'

import CrudPlantas from './Plantas/CrudPlantas.jsx'
import PlantasForm from './Plantas/PlantasForm.jsx'

import CrudUsoEquipos from './UsoEquipos/CrudUsoEquipos.jsx'
import UsoEquipoForm from './UsoEquipos/UsoEquiposForm.jsx'

import CrudSup_Plantas from './Sup_Plantas/CrudSup_Plantas.jsx'
import Sup_PlantasForm from './Sup_Plantas/Sup_PlantasForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <CrudReactivos/>
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
    <CrudPlantas/>
    <PlantasForm/> */}
    <CrudUsoEquipos/>
    {/* <UsoEquipoForm/> 
    <CrudSup_Plantas/>
    <Sup_PlantasForm /> */}
  </StrictMode>,
)