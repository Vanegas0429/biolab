import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiAxios from './api/axiosConfig.js';

import NavBar from './navBar';
import Home from './home/home';
import UsuarioLogin from './home/UsuarioLogin';
import UsuarioRegistro from './home/UsuarioRegister';

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

// Componente de ruta protegida por roles
const ProtectedRoute = ({ isAuth, userRol, allowedRoles, children }) => {
  if (!isAuth) return <Navigate to="/login" replace />;
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
    setIsAuth(false);
    setUserRol(null);
    navigate('/');
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
            .slice(0, 5);
          setNotificaciones(recents);
          setUnreadCount(recents.length);
        } catch (error) {
          console.error("Error cargando notificaciones:", error);
        }
      };
      fetchNotificaciones();
    }
  }, [isAuth, userRol]);

  if (isLoading) return <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>Cargando...</div>;

  // Roles con acceso completo (admin)
  const ADMIN_ROLES = ['administrador', 'gerente', 'instructor_gerente', 'instructor', 'gestor'];

  return (
    <>
      <NavBar isAuth={isAuth} logOut={logOut} userRol={userRol} />
      
      {/* HEADER INTEGRADO */}
      {location.pathname !== "/" && (
        <div className="container-fluid pt-3 pb-2 position-relative" style={{ animation: "fadeIn 0.5s ease-in-out" }}>
          {/* Centro: Logo y Título */}
          <div className="d-flex justify-content-center align-items-center">
            <img 
              src="/logo.png" 
              alt="Logo BIOLAB" 
              style={{ width: 90, height: 90, borderRadius: "50%", boxShadow: '0 8px 20px rgba(0,0,0,0.2)', marginRight: '25px', objectFit: 'cover' }} 
            />
            <div className="d-flex flex-column justify-content-center">
              <span className="m-0 fw-bold lh-1" style={{ fontSize: '3rem', letterSpacing: '6px', color: 'var(--primary-color)' }}>BIOLAB</span>
            </div>
          </div>

          {/* Derecha: Perfil y Notificaciones */}
          {userProfile && (
            <div className="position-absolute end-0 top-50 translate-middle-y pe-4 d-flex align-items-center gap-4 mt-2">
              {/* Campana Notificaciones */}
              {userRol !== 'solicitante' && (
                <div className="dropdown">
                  <div className="position-relative" style={{ cursor: 'pointer' }} data-bs-toggle="dropdown" aria-expanded="false" onClick={() => setUnreadCount(0)}>
                    <i className="fa-regular fa-bell fs-4 text-secondary"></i>
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2" style={{ minWidth: '300px' }}>
                    <li><h6 className="dropdown-header">Notificaciones</h6></li>
                    {notificaciones.length === 0 ? (
                      <li><span className="dropdown-item-text text-muted small">No tienes notificaciones nuevas.</span></li>
                    ) : (
                      notificaciones.map((notif, idx) => (
                        <li key={idx}>
                          <div className="dropdown-item d-flex flex-column" onClick={() => navigate('/Reserva')} style={{ cursor: 'pointer' }}>
                            <span className="fw-bold" style={{ fontSize: '0.85rem' }}>Nueva Reserva: {notif.Tip_Reserva}</span>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{notif.Nom_Solicitante} - {notif.Fec_Reserva}</span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}

              {/* Perfil */}
              <div className="dropdown">
                <div className="d-flex align-items-center gap-2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="d-none d-md-flex flex-column text-end">
                    <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{userProfile.nombre}</span>
                    <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>{userProfile.rol}</small>
                  </div>
                  <div className="bg-primary text-white d-flex justify-content-center align-items-center rounded-circle shadow-sm" style={{ width: '45px', height: '45px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {userProfile.nombre ? userProfile.nombre.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                  <li><h6 className="dropdown-header">Perfil</h6></li>
                  <li><span className="dropdown-item-text text-muted small"><i className="fa-regular fa-id-card me-2"></i>{userProfile.documento}</span></li>
                  <li><span className="dropdown-item-text text-muted small"><i className="fa-regular fa-envelope me-2"></i>{userProfile.correo}</span></li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <Routes>
        {/* Rutas públicas */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={isAuth ? <Navigate to='/Reserva' replace /> : <UsuarioLogin setIsAuth={setIsAuth} setUserRol={setUserRol} />} />
        <Route path='/register' element={<UsuarioRegistro />} />
        <Route path='/sin-acceso' element={<SinAcceso />} />

        {/* Ruta de Reserva - Accesible a todos los roles autenticados */}
        <Route path='/Reserva' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={null}>
            <CrudReserva userRol={userRol} />
          </ProtectedRoute>
        } />

        {/* Rutas solo para roles admin */}
        <Route path='/Especie' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudEspecie />
          </ProtectedRoute>
        } />
        <Route path='/Sup_Plantas' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudSup_Plantas />
          </ProtectedRoute>
        } />
        <Route path='/Produccion' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudProduccion />
          </ProtectedRoute>
        } />
        <Route path='/Reactivo' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudReactivos />
          </ProtectedRoute>
        } />
        <Route path='/Entrada' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudEntrada />
          </ProtectedRoute>
        } />
        <Route path='/Equipo' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={[...ADMIN_ROLES, 'solicitante']}>
            <CrudEquipos userRol={userRol} />
          </ProtectedRoute>
        } />
        <Route path='/Material' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudMaterial />
          </ProtectedRoute>
        } />
        <Route path='/Actividad' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudActividad />
          </ProtectedRoute>
        } />
        <Route path='/ActividadEquipo' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudActividadEquipo />
          </ProtectedRoute>
        } />
        <Route path='/ActividadMaterial' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudActividadMaterial />
          </ProtectedRoute>
        } />
        <Route path='/ActividadReactivo' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudActividadReactivo />
          </ProtectedRoute>
        } />
        <Route path='/Practica' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <CrudPractica />
          </ProtectedRoute>
        } />
        <Route path='/registroAdmin' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={['administrador']}>
            <UsuarioRegistroAdmin />
          </ProtectedRoute>
        } />
        
        <Route path='/Calendario' element={
          <ProtectedRoute isAuth={isAuth} userRol={userRol} allowedRoles={ADMIN_ROLES}>
            <Calendario />
          </ProtectedRoute>
        } />

        {/* Redirigir cualquier ruta desconocida */}
        <Route path='*' element={<Navigate to={isAuth ? '/Reserva' : '/login'} replace />} />
      </Routes>
    </>
  );
}

export default App;