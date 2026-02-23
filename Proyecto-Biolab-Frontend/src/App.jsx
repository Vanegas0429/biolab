
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import equipoRoutes from './routes/EquipoRoutes.js';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta para archivos subidos
app.use('/uploads', express.static(path.join(path.resolve(), 'public/uploads')));

// Montar rutas de equipos
app.use('/api/equipos', equipoRoutes);

// Puerto desde .env o por defecto 8000
const PORT = process.env.PORT || 8000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
=======
// Importamos los componentes necesarios de react-router-dom
// Routes y Route: para definir las rutas
// useNavigate: para redirecciones programáticas
// Navigate: para redirecciones automáticas
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

// Importamos hooks de React
// useEffect: ejecutar lógica al cargar el componente
// useState: manejar estados
import { useEffect, useState } from 'react';

// Importación de los componentes CRUD y vistas
import CrudPractica from './Practica/CrudPractica';
import CrudReserva from './Reserva/CrudReserva';
import NavBar from './navBar';
import Home from './home/home';
import CrudEspecie from './Especies/CrudEspecies';
import CrudSup_Plantas from './Sup_Plantas/CrudSup_Plantas';
import CrudProduccion from './Produccion/CrudProduccion';
import CrudEquipos from './Equipos/CrudEquipos';
import UsuarioLogin from './home/UsuarioLogin';

// Componente principal de la aplicación
function App() {

  // Estado que indica si el usuario está autenticado
  const [isAuth, setIsAuth] = useState(false);

  // Estado para controlar si la app aún está verificando sesión
  const [isLoading, setIsLoading] = useState(true);

  // Hook para redireccionar manualmente
  const navigate = useNavigate();

  // useEffect se ejecuta UNA VEZ al cargar la app
  useEffect(() => {

    // Obtenemos el usuario guardado en localStorage
    const stored = localStorage.getItem('UsuarioLaboratorio');

    // Si no existe información de usuario
    if (!stored) {
      setIsAuth(false);      // No autenticado
      setIsLoading(false);  // Ya terminó la carga
      return;
    }

    try {
      // Intentamos convertir el JSON guardado
      JSON.parse(stored);

      // Si es válido, el usuario está autenticado
      setIsAuth(true);

    } catch (err) {
      // Si el JSON está corrupto, lo eliminamos
      localStorage.removeItem('UsuarioLaboratorio');
      setIsAuth(false);
    }

    // Finalizamos la carga inicial
    setIsLoading(false);

  }, []);

  // Función para cerrar sesión
  const logOut = () => {

    // Eliminamos el usuario del localStorage
    localStorage.removeItem('UsuarioLaboratorio');

    // Actualizamos el estado de autenticación
    setIsAuth(false);

    // Redirigimos al Home o Login
    navigate('/');
  };

  // Mientras se valida la sesión mostramos un loader
  if (isLoading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  // Render principal
  return (
    <>
      {/* 
        Barra de navegación
        Recibe:
        - isAuth: para mostrar botones según sesión
        - logOut: función para cerrar sesión
      */}
      <NavBar isAuth={isAuth} logOut={logOut} />

      {/* Definición de rutas */}
      <Routes>

        {/* Ruta pública Home */}
        <Route path='/' element={<Home />} />

        {/* Ruta pública Login */}
        {/* setIsAuth se pasa para activar sesión desde el login */}
        <Route
          path='/login'
          element={<UsuarioLogin setIsAuth={setIsAuth} />}
        />

        {/* 
          Rutas protegidas
          SOLO se renderizan si isAuth === true
        */}
        {isAuth ? (
          <>
            <Route path='/Practica' element={<CrudPractica />} />
            <Route path='/Reserva' element={<CrudReserva />} />
            <Route path='/Especie' element={<CrudEspecie />} />
            <Route path='/Sup_Plantas' element={<CrudSup_Plantas />} />
            <Route path='/Produccion' element={<CrudProduccion />} />
            <Route path='/Equipo' element={<CrudEquipos />} />
          </>
        ) : (
          // Si el usuario NO está autenticado
          // cualquier ruta lo redirige al login
          <Route path='*' element={<Navigate to="/login" />} />
        )}

      </Routes>
    </>
  );
}

// Exportamos el componente App
export default App;
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import CrudPractica from './Practica/CrudPractica'
import CrudReserva from './Reserva/CrudReserva'
import NavBar from './navBar'
import Home from './home/home'
import CrudEspecie from './Especies/CrudEspecies'
import CrudSup_Plantas from './Sup_Plantas/CrudSup_Plantas'
import CrudProduccion from './Produccion/CrudProduccion'
import CrudEquipos from './Equipos/CrudEquipos'

function App() {
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/Practica' element={<CrudPractica />}></Route>
      <Route path='/Reserva' element={<CrudReserva />}></Route>
      <Route path='/Especie' element={<CrudEspecie />}></Route>
      <Route path='/Sup_Plantas' element={<CrudSup_Plantas />}></Route>
      <Route path='/Produccion' element={<CrudProduccion />}></Route>
      <Route path='/Equipo' element={<CrudEquipos />}></Route>
    </Routes>
    </>
  )
  }
export default App
