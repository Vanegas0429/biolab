import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiAxios from './api/axiosConfig.js';

import NavBar from './navBar';
import Home from './home/home';
import UsuarioLogin from './home/UsuarioLogin';
import UsuarioRegistro from './home/UsuarioRegister';
import UsuarioForgot from './home/UsuarioForgot';


// CRUDs protegidos
import CrudPractica from './Practica/CrudPractica';
import CrudEspecie from './Especies/CrudEspecies';
import CrudSup_Plantas from './Sup_Plantas/CrudSup_Plantas';
import CrudProduccion from './Produccion/CrudProduccion';
import CrudEquipos from './Equipos/CrudEquipos';
import CrudEntrada from './Entrada/CrudEntrada';
import CrudReactivos from './Reactivos/CrudReactivos';
import CrudReserva from './Reserva/CrudReserva';
import CrudMaterial from './Material/CrudMaterial';
import CrudActividad from './Actividad/CrudActividad';
import CrudActividadEquipo from './ActividadEquipo/CrudActvidadEquipo';
import CrudActividadMaterial from './ActividadMaterial/CrudActividadMaterial';
import CrudActividadReactivo from './ActividadReactivo/CrudActividadReactivo';
import UsuarioRegistroAdmin from './home/UsuarioRegisterAdmin';
import Calendario from './Calendario/Calendario.jsx';
import GestionUsuarios from './home/GestionUsuarios';

// Componente de ruta protegida por roles
const ProtectedRoute = ({ isAuth, userRol, allowedRoles, children }) => {
  if (!isAuth) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(userRol)) return <Navigate to="/sin-acceso" replace />;
  return children;
};

// Página de acceso denegado
const SinAcceso = () => (
  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', gap: '1rem' }}>
    <i className="fa-solid fa-lock" style={{ fontSize: '4rem', color: 'var(--primary-color)' }}></i>
    <h2 className="fw-bold">Acceso denegado</h2>
    <p className="text-muted">No tienes permisos para ver esta página.</p>
  </div>
);

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRol, setUserRol] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const logOut = () => {
    localStorage.removeItem('UsuarioLaboratorio');
    window.location.href = '/';
  };

  useEffect(() => {
    const stored = localStorage.getItem('UsuarioLaboratorio');
    if (!stored) { setIsAuth(false); setIsLoading(false); return; }

    try {
      const user = JSON.parse(stored);
      if (!user.token) { setIsAuth(false); setIsLoading(false); return; }
      setIsAuth(true);
      setUserRol(user.rol);
      setUserProfile(user);
    } catch {
      localStorage.removeItem('UsuarioLaboratorio');
      setIsAuth(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuth && userRol !== 'solicitante') {
      const fetchNotificaciones = async () => {
        try {
          const response = await apiAxios.get('/api/Reserva');
          const data = response.data;
          const list = Array.isArray(data) ? data : data?.data ?? [];
          const recents = list
            .filter(r => r.Des_Estado === 'Solicitado' || r.Des_Estado === 'En proceso')
            .slice(0, 20);
          setNotificaciones(recents);
          setUnreadCount(recents.length);
        } catch (error) {
          console.error("Error cargando notificaciones:", error);
        }
      };
      fetchNotificaciones();
    }
  }, [isAuth, userRol]);

  useEffect(() => {
    if (isAuth) {
      document.body.classList.add('has-sidebar');
    } else {
      document.body.classList.remove('has-sidebar');
    }
  }, [isAuth]);

  if (isLoading) return <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>Cargando...</div>;

  // Roles con acceso a la gestión operativa (MiddelWare X)
  const STAFF_ROLES = ['administrador', 'gestor', 'pasante'];

  return (
    <>
      {isAuth && <NavBar isAuth={isAuth} logOut={logOut} userRol={userRol} />}
      
      {/* HEADER INTEGRADO */}
      {location.pathname !== "/" && (
        <div className="container-fluid px-3 px-md-4 py-2 main-header" style={{ animation: "fadeIn 0.5s ease-in-out", zIndex: 3000000 }}>
          <div className="d-flex align-items-center justify-content-between w-100">

            {/* Izquierda: Logo y Título */}
            <div className="d-flex align-items-center gap-2">
              <img src="/logo.png" alt="Logo BIOLAB" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
              <span className="d-none d-sm-inline fw-bold fs-4 lh-1" style={{ color: 'var(--primary-color)', letterSpacing: '2px' }}>BIOLAB</span>
            </div>

            {/* Derecha: Perfil y Notificaciones */}
            {isAuth && userProfile && (
              <div className="d-flex align-items-center gap-2 gap-md-3">
                {/* Campana Notificaciones */}
                {userRol !== 'solicitante' && (
                  <div className="dropdown">
                    <div className="position-relative" style={{ cursor: 'pointer' }} data-bs-toggle="dropdown" aria-expanded="false" onClick={() => setUnreadCount(0)}>
                      <i className="fa-regular fa-bell fs-5 text-secondary"></i>
                      {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-0" style={{ minWidth: '300px', overflow: 'hidden', zIndex: 100000 }}>
                      <li><h6 className="dropdown-header border-bottom p-3">Notificaciones</h6></li>
                      <div className="custom-scroll" style={{ maxHeight: '350px', overflowY: 'auto', overflowX: 'hidden' }}>
                        {notificaciones.length === 0 ? (
                          <li><span className="dropdown-item-text text-muted small p-3">No tienes notificaciones nuevas.</span></li>
                        ) : (
                          notificaciones.map((notif, idx) => (
                            <li key={idx} className="border-bottom last-child-border-0">
                              <div className="dropdown-item d-flex flex-column p-3" onClick={() => navigate('/Reserva', { state: { highlightId: notif.Id_Reserva } })} style={{ cursor: 'pointer', whiteSpace: 'normal' }}>
                                <span className="fw-bold text-primary" style={{ fontSize: '0.85rem' }}>Nueva Reserva: {notif.Tip_Reserva}</span>
                                <span className="text-dark mt-1" style={{ fontSize: '0.8rem' }}>{notif.Nom_Solicitante}</span>
                                <span className="text-muted mt-1" style={{ fontSize: '0.75rem' }}><i className="fa-regular fa-calendar me-1"></i>{notif.Fec_Reserva}</span>
                              </div>
                            </li>
                          ))
                        )}
                      </div>
                    </ul>
                  </div>
                )}

                {/* Perfil */}
                <div className="dropdown">
                  <div className="d-flex align-items-center gap-2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="d-none d-md-flex flex-column text-end">
                      <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{userProfile.nombre}</span>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>{userProfile.rol}</small>
                    </div>
                    <div className="bg-primary text-white d-flex justify-content-center align-items-center rounded-circle shadow-sm flex-shrink-0" style={{ width: '40px', height: '40px', fontSize: '1rem', fontWeight: 'bold' }}>
                      {userProfile.nombre ? userProfile.nombre.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                    <li><h6 className="dropdown-header">Perfil</h6></li>
                    <li><span className="dropdown-item-text text-muted small"><i className="fa-regular fa-id-card me-2"></i>{userProfile.documento}</span></li>
                    <li><span className="dropdown-item-text text-muted small"><i className="fa-solid fa-phone me-2"></i>{userProfile.telefono || 'Sin teléfono'}</span></li>
                    <li><span className="dropdown-item-text text-muted small"><i className="fa-regular fa-envelope me-2"></i>{userProfile.correo}</span></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Routes>
        {/* Rutas públicas */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={isAuth ? <Navigate to='/' replace /> : <UsuarioLogin setIsAuth={setIsAuth} setUserRol={setUserRol} setUserProfile={setUserProfile} />} />
        <Route path='/Forgot' element={<UsuarioForgot />} />
        <Route path='/register' element={<UsuarioRegistro />} />
        <Route path='/sin-acceso' element={<SinAcceso />} />

        {/* Ruta de Reserva - Accesible a todos los roles autenticados */}
        <Route path='/Reserva' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={null}>
            <CrudReserva userRol={userRol} />
          </ProtectedRoute>
        } />

        {/* Rutas solo para roles operativos (MiddelWare X) */}
        <Route path='/Especie' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudEspecie />
          </ProtectedRoute>
        } />
        <Route path='/Sup_Plantas' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudSup_Plantas />
          </ProtectedRoute>
        } />
        <Route path='/Produccion' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudProduccion />
          </ProtectedRoute>
        } />
        <Route path='/Reactivo' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudReactivos />
          </ProtectedRoute>
        } />
        <Route path='/Entrada' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudEntrada />
          </ProtectedRoute>
        } />
        <Route path='/Equipo' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={[...STAFF_ROLES, 'solicitante']}>
            <CrudEquipos userRol={userRol} />
          </ProtectedRoute>
        } />
        <Route path='/Material' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudMaterial />
          </ProtectedRoute>
        } />
        <Route path='/Actividad' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudActividad />
          </ProtectedRoute>
        } />
        <Route path='/ActividadEquipo' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudActividadEquipo />
          </ProtectedRoute>
        } />
        <Route path='/ActividadMaterial' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudActividadMaterial />
          </ProtectedRoute>
        } />
        <Route path='/ActividadReactivo' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudActividadReactivo />
          </ProtectedRoute>
        } />
        <Route path='/Practica' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <CrudPractica />
          </ProtectedRoute>
        } />
        <Route path='/registroAdmin' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={['administrador']}>
            <UsuarioRegistroAdmin />
          </ProtectedRoute>
        } />
        <Route path='/usuarios' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={['administrador']}>
            <GestionUsuarios />
          </ProtectedRoute>
        } />
        
        <Route path='/Calendario' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={STAFF_ROLES}>
            <Calendario />
          </ProtectedRoute>
        } />

        {/* Redirigir cualquier ruta desconocida */}
        <Route path='*' element={<Navigate to={isAuth ? '/Reserva' : '/'} replace />} />
      </Routes>
    </>
  );
}

export default App;