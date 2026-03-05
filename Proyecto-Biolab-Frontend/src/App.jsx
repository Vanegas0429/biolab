import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import NavBar from './navBar';
import Home from './home/home';
import UsuarioLogin from './home/UsuarioLogin';
import ReservaForm from './Reserva/ReservaForm';

// CRUDs protegidos
import CrudPractica from './Practica/CrudPractica';
import CrudEspecie from './Especies/CrudEspecies';
import CrudSup_Plantas from './Sup_Plantas/CrudSup_Plantas';
import CrudProduccion from './Produccion/CrudProduccion';
import CrudEquipos from './Equipos/CrudEquipos';
import CrudEntrada from './Entrada/CrudEntrada';
import CrudReactivos from './Reactivos/CrudReactivos';
import CrudReserva from './Reserva/CrudReserva';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem('UsuarioLaboratorio');
    setIsAuth(false);
    navigate('/');
  };

  useEffect(() => {
    const stored = localStorage.getItem('UsuarioLaboratorio');
    if (!stored) return setIsAuth(false), setIsLoading(false);

    try {
      const user = JSON.parse(stored);
      if (!user.token) return setIsAuth(false), setIsLoading(false);
      setIsAuth(true);
    } catch {
      localStorage.removeItem('UsuarioLaboratorio');
      setIsAuth(false);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <>
      <NavBar isAuth={isAuth} logOut={logOut} />
      <Routes>
        {/* Home siempre visible */}
        <Route path='/' element={<Home />} />

        {/* Reserva pública */}
        <Route path='/Reserva' element={<ReservaForm />} />

        {/* Login */}
        <Route path='/login' element={<UsuarioLogin setIsAuth={setIsAuth} />} />

        {/* CRUDs protegidos */}
        {isAuth && (
          <>
            <Route path='/Reserva' element={<CrudReserva />} />
            <Route path='/Practica' element={<CrudPractica />} />
            <Route path='/Especie' element={<CrudEspecie />} />
            <Route path='/Sup_Plantas' element={<CrudSup_Plantas />} />
            <Route path='/Produccion' element={<CrudProduccion />} />
            <Route path='/Reactivo' element={<CrudReactivos />} />
            <Route path='/Entrada' element={<CrudEntrada />} />
            <Route path='/Equipo' element={<CrudEquipos />} />
          </>
        )}

        {/* Redirección por defecto si no autenticado */}
        {!isAuth && <Route path='*' element={<Navigate to="/" />} />}
      </Routes>
    </>
  );
}

export default App;