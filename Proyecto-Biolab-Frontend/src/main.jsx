import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'

import CrudReactivos from './Reactivos/CrudReactivos.jsx'
import ReactivosForm from './Reactivos/ReactivosForm.jsx'

import CrudFuncionarios from './Funcionario/CrudFuncionarios.jsx'
import FuncionarioForm from './Funcionario/FuncionarioForm.jsx'

import CrudEquipos from './Equipos/CrudEquipos.jsx'
import EquiposForm from './Equipos/EquiposForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <CrudReactivos/>
    <ReactivosForm/>
    <CrudFuncionarios/>
    <FuncionarioForm/>
    <CrudEquipos/>
    <EquiposForm/>
  </StrictMode>,
)