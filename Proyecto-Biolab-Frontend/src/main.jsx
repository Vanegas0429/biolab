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

// import CrudUsoEquipos from './UsoEquipos/CrudUsoEquipos.jsx'
// import UsoEquipoForm from './UsoEquipos/UsoEquiposForm.jsx'

// import CrudSup_Plantas from './Sup_Plantas/CrudSup_Plantas.jsx'
// import Sup_PlantasForm from './Sup_Plantas/Sup_PlantasForm.jsx'

// import CrudReserva from './Reserva/CrudReserva.jsx'
// import ReservaForm from './Reserva/ReservaForm.jsx'

// import CrudPractica from './Practica/CrudPractica.jsx'
// import PracticaForm from './Practica/PracticaForm.jsx'

import { BrowserRouter} from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <CrudReactivos/>
    <ReactivosForm/>
    <CrudFuncionarios/>
    <FuncionarioForm/>
    <CrudEquipos/>
    <EquiposForm/>
    <CrudUsoEquipos/>
    <UsoEquiposForm/> 
    <CrudSup_Plantas/>
    <Sup_PlantasForm /> */}
    {/* <CrudPractica/> */}
    {/* <CrudReserva/> */}
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>,
)