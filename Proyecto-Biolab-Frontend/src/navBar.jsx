import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NavBar = ({ isAuth, logOut, userRol }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userObj = localStorage.getItem('UsuarioLaboratorio');
    if (userObj) {
      try {
        setUser(JSON.parse(userObj));
      } catch (e) {}
    }
  }, [isAuth]);

  const navigateTo = (ruta) => {
    setIsOpen(false);
    setTimeout(() => navigate(ruta), 150);
  };

  const renderMenuItems = () => {
    if (!isAuth) {
      return (
        <>
          <li className="nav-item">
            <Link className="nav-link px-3 py-2" onClick={() => navigateTo("/login")}>
              <i className="fa-solid fa-user me-3 w-20px text-center"></i>Iniciar sesión
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link px-3 py-2" onClick={() => navigateTo("/register")}>
              <i className="fa-solid fa-user-plus me-3 w-20px text-center"></i>Registrarse
            </Link>
          </li>
        </>
      );
    }

    return (
      <>
        <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/Reserva")}><i className="fa-solid fa-calendar-days me-3 w-20px text-center"></i>Reservas</Link></li>

        {/* Solo administradores ven Plantas */}
        {userRol !== 'solicitante' && (
          <>
            <li className="nav-item mt-3 px-3 text-uppercase text-secondary fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Plantas</li>
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/Sup_Plantas")}><i className="fa-solid fa-leaf me-3 w-20px text-center"></i>Supervisión</Link></li>
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/Especie")}><i className="fa-solid fa-seedling me-3 w-20px text-center"></i>Especies</Link></li>
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/Produccion")}><i className="fa-solid fa-industry me-3 w-20px text-center"></i>Producciones</Link></li>
          </>
        )}

        {/* SUBMENÚ INVENTARIO */}
        <li className="nav-item mt-3 px-3 text-uppercase text-secondary fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Inventario</li>
        <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/Equipo")}><i className="fa-solid fa-microscope me-3 w-20px text-center"></i>Equipos</Link></li>
        {userRol !== 'solicitante' && (
          <>
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/Material")}><i className="fa-solid fa-boxes-stacked me-3 w-20px text-center"></i>Materiales</Link></li>
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/Reactivo")}><i className="fa-solid fa-flask me-3 w-20px text-center"></i>Reactivos</Link></li>
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/Entrada")}><i className="fa-solid fa-box-open me-3 w-20px text-center"></i>Entradas</Link></li>
          </>
        )}

        {/* SUBMENÚ ACTIVIDADES */}
        {userRol !== 'solicitante' && (
          <>
            <li className="nav-item mt-3 px-3 text-uppercase text-secondary fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Actividades</li>
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/Actividad")}><i className="fa-solid fa-clipboard-list me-3 w-20px text-center"></i>Actividades</Link></li>
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/ActividadEquipo")}><i className="fa-solid fa-microscope me-3 w-20px text-center"></i>Act-Equipos</Link></li>
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/ActividadMaterial")}><i className="fa-solid fa-boxes-stacked me-3 w-20px text-center"></i>Act-Materiales</Link></li>
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/ActividadReactivo")}><i className="fa-solid fa-flask me-3 w-20px text-center"></i>Act-Reactivos</Link></li>
          </>
        )}

        {/* ADMIN */}
        {['administrador', 'gerente', 'instructor_gerente', 'instructor', 'gestor'].includes(userRol) && (
          <>
            <li className="nav-item mt-3 px-3 text-uppercase text-secondary fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Admin</li>
            {userRol === 'administrador' && (
              <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/registroAdmin")}><i className="fa-solid fa-user-shield me-3 w-20px text-center"></i>Registrar Usuario</Link></li>
            )}
            <li className="nav-item"><Link className="nav-link px-3 py-2" onClick={() => navigateTo("/Calendario")}><i className="fa-solid fa-calendar-check me-3 w-20px text-center"></i>Calendario</Link></li>
          </>
        )}

        <hr className="border-secondary opacity-25 my-3" />
        
        {/* PERFIL ACTUAL */}
        {user && (
          <li className="nav-item px-3 mb-3">
            <div className="p-3 rounded border border-secondary d-flex align-items-center gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <div className="d-flex flex-column text-start flex-grow-1" style={{ overflow: 'hidden' }}>
                <span className="text-white fw-bold text-truncate" style={{ fontSize: '1rem' }}>{user.nombre}</span>
                <span className="text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px', color: '#cbd5e1' }}>{user.rol}</span>
              </div>
              <div 
                className="bg-primary text-white d-flex justify-content-center align-items-center rounded-circle shadow-sm flex-shrink-0"
                style={{ width: '40px', height: '40px', fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </li>
        )}


        <li className="nav-item px-3 mb-4">
          <button className="btn btn-outline-danger w-100 rounded-pill fw-bold py-2 shadow-sm" onClick={logOut}>
            <i className="fa-solid fa-power-off me-2"></i>Cerrar Sesión
          </button>
        </li>
      </>
    );
  };

  return (
    <>
      {/* Botón Flotante (Hamburguesa) */}
      <div
        className="sidebar-trigger shadow-lg"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fa-solid fa-bars fs-4 text-white"></i>
      </div>

      {/* Overlay oscuro */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Panel Lateral (Sidebar) */}
      <nav
        className={`sidebar-glass shadow-lg ${isOpen ? "open" : ""}`}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="d-flex flex-column h-100 p-4">

          {/* Header del Sidebar */}
          <div className="d-flex align-items-center gap-3 mb-5 mt-2">
            <img src="/logo.png" alt="Logo" style={{ width: 50, height: 50, borderRadius: "50%", boxShadow: '0 4px 10px rgba(0,0,0,0.3)', objectFit: 'cover' }} />
            <div className="d-flex flex-column text-white">
              <span className="m-0 fw-bold fs-4 lh-1" style={{ letterSpacing: '1px', color: 'var(--primary-color)' }}>SENA</span>
              <small className="opacity-75" style={{ fontSize: '0.85rem', letterSpacing: '3px', color: '#e2e8f0' }}>BIOLAB</small>
            </div>
          </div>

          {/* Opciones del Menú */}
          <ul className="navbar-nav flex-column gap-1 mb-auto">
            <li className="nav-item">
              <Link className="nav-link px-3 py-2" onClick={() => navigateTo("/")}>
                <i className="fa-solid fa-house me-3 w-20px text-center"></i>Inicio
              </Link>
            </li>
            {renderMenuItems()}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;