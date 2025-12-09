import { useState } from 'react'

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import CrudPractica from './Practica/CrudPractica'

function App() {
  

  return (
    <>
    <Routes>
      <Route path='/Practica' element={<CrudPractica />}></Route>
    </Routes>

    </>
  )
}

export default App
