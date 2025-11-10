import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import CrudUsoEquipos from './UsoEquipos/CrudUsoEquipos.jsx'
import UsoEquipoForm from './UsoEquipos/UsoEquiposForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <CrudUsoEquipos />
    <UsoEquipoForm />
  </StrictMode>,
)
