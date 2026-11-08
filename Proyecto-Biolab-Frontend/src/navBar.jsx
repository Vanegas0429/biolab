import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NavBar = ({ isAuth, logOut, userRol }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    const userObj = localStorage.getItem('UsuarioLaboratorio');
    if (userObj) {
      try {
        setUser(JSON.parse(userObj));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [isAuth]);

  // Sincronizar clase en body cuando cambie el colapso
  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    localStorage.setItem('sidebarCollapsed', collapsed);
  }, [collapsed]);

  const toggleCollapse = (e) => {
    if (e) e.stopPropagation();
    setCollapsed(prev => !prev);
  };

  const navigateTo = (ruta) => {
    setIsOpen(false);
    setTimeout(() => navigate(ruta), 150);
  };

  const NavItem = ({ icon, label, path, sub = false }) => (
    <li className={`nav-item${sub && !collapsed ? ' ms-3' : ''}`}>
      <Link
        className={`nav-link px-3 py-2 ${sub ? 'sub-link' : ''}`}
        onClick={() => navigateTo(path)}
        title={collapsed ? label : ''}
      >
        <i className={`${icon} ${collapsed ? '' : 'me-3'} w-20px text-center`} style={{ minWidth: '20px', flexShrink: 0 }}></i>
        {!collapsed && <span className="sidebar-label">{label}</span>}
      </Link>
    </li>
  );

  const SectionTitle = ({ children }) => (
    !collapsed ? (
      <li className="nav-item mt-3 px-3 text-uppercase text-secondary fw-bold sidebar-section-title" style={{ fontSize: '0.68rem', letterSpacing: '1.5px', color: '#94a3b8' }}>
        {children}
      </li>
    ) : (
      <li className="nav-item mt-2 px-2">
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '6px 0' }}></div>
      </li>
    )
  );

  const renderMenuItems = () => {
    if (!isAuth) return null;

    return (
      <>
        {userRol !== 'solicitante' && (
          <NavItem icon="fa-solid fa-clipboard-check" label="Gestión de Reservas" path="/GestionReservas" />
        )}
        <NavItem icon="fa-solid fa-calendar-days" label="Mis Reservas" path="/Reserva" />

        {/* Plantas */}
        <SectionTitle>Plantas</SectionTitle>
        <NavItem icon="fa-solid fa-seedling" label="Especies" path="/Especie" />
        {userRol !== 'solicitante' && (
          <NavItem icon="fa-solid fa-industry" label="Producciones" path="/Produccion" />
        )}

        {/* Inventario */}
        <SectionTitle>Inventario</SectionTitle>
        <NavItem icon="fa-solid fa-microscope" label="Equipos" path="/Equipo" />
        <NavItem icon="fa-solid fa-flask" label="Reactivos" path="/Reactivo" />
        {userRol !== 'solicitante' && (
          <NavItem icon="fa-solid fa-box-open" label="Entradas Reactivos" path="/Entrada" sub />
        )}
        <NavItem icon="fa-solid fa-boxes-stacked" label="Materiales" path="/Material" />
        {userRol !== 'solicitante' && (
          <NavItem icon="fa-solid fa-boxes-packing" label="Entradas Materiales" path="/EntradaMaterial" sub />
        )}

        {/* Actividades */}
        {userRol !== 'solicitante' && (
          <>
            <SectionTitle>Actividades</SectionTitle>
            <NavItem icon="fa-solid fa-clipboard-list" label="Actividades" path="/Actividad" />
            <NavItem icon="fa-solid fa-microscope" label="Act-Equipos" path="/ActividadEquipo" />
            <NavItem icon="fa-solid fa-boxes-stacked" label="Act-Materiales" path="/ActividadMaterial" />
            <NavItem icon="fa-solid fa-flask" label="Act-Reactivos" path="/ActividadReactivo" />
          </>
        )}

        {/* Staff / Admin */}
        {userRol === 'administrador' && (
          <>
            <SectionTitle>Admin</SectionTitle>
            <NavItem icon="fa-solid fa-user-shield" label="Registrar Usuario" path="/registroAdmin" />
            <NavItem icon="fa-solid fa-users-gear" label="Gestión Usuarios" path="/usuarios" />
          </>
        )}

        <hr className="border-secondary opacity-25 my-3" />

        {/* Perfil en Sidebar */}
        {user && !collapsed && (
          <li className="nav-item px-3 mb-3">
            <div className="p-3 rounded-4 border border-secondary d-flex align-items-center gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(6px)' }}>
              <div className="d-flex flex-column text-start flex-grow-1" style={{ overflow: 'hidden' }}>
                <span className="text-white fw-bold text-truncate" style={{ fontSize: '0.9rem' }}>{user.nombre}</span>
                <span className="text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px', color: '#10b981' }}>{userRol || user.rol}</span>
              </div>
              <div
                className="bg-primary text-white d-flex justify-content-center align-items-center rounded-circle shadow flex-shrink-0"
                style={{ width: '38px', height: '38px', fontSize: '1rem', fontWeight: 'bold' }}
              >
                {user.nombre ? user.nombre?.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </li>
        )}

        {user && collapsed && (
          <li className="nav-item px-2 mb-2 d-flex justify-content-center">
            <div
              className="bg-primary text-white d-flex justify-content-center align-items-center rounded-circle shadow"
              style={{ width: '38px', height: '38px', fontSize: '1rem', fontWeight: 'bold' }}
              title={`${user.nombre} (${userRol || user.rol})`}
            >
              {user.nombre ? user.nombre?.charAt(0).toUpperCase() : 'U'}
            </div>
          </li>
        )}

        <li className={`nav-item ${collapsed ? 'px-2 mb-3 d-flex justify-content-center' : 'px-3 mb-4'}`}>
          {collapsed ? (
            <button
              className="btn btn-outline-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: '38px', height: '38px', padding: 0 }}
              onClick={logOut}
              title="Cerrar Sesión"
            >
              <i className="fa-solid fa-power-off"></i>
            </button>
          ) : (
            <button className="btn btn-outline-danger w-100 rounded-pill fw-bold py-2 shadow-sm" onClick={logOut}>
              <i className="fa-solid fa-power-off me-2"></i>Cerrar Sesión
            </button>
          )}
        </li>
      </>
    );
  };

  return (
    <>
      {/* Botón Flotante para Colapsar/Expandir en pantallas grandes (Desktop >= 1200px) */}
      {/* Se ubica fuera de sidebar-glass para que overflow-x:hidden NO lo corte */}
      <button
        type="button"
        className={`sidebar-collapse-btn d-none d-xl-flex ${collapsed ? "is-collapsed" : ""}`}
        onClick={toggleCollapse}
        title={collapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
        aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
      >
        <i className={`fa-solid fa-chevron-${collapsed ? 'right' : 'left'}`}></i>
      </button>

      {/* Botón Flotante (Hamburguesa en móvil < 1200px) */}
      <div
        className="sidebar-trigger shadow-lg"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fa-solid fa-bars fs-4 text-white"></i>
      </div>

      {/* Overlay oscuro en móvil */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Panel Lateral (Sidebar) */}
      <nav
        className={`sidebar-glass shadow-lg ${isOpen ? "open" : ""} ${collapsed ? "sidebar-collapsed-panel" : ""}`}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="d-flex flex-column h-100 p-3">

          {/* Header del Sidebar */}
          <div className={`d-flex align-items-center gap-2 mb-4 mt-1 ${collapsed ? 'justify-content-center' : ''}`}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: 38, height: 38, borderRadius: "50%", boxShadow: '0 4px 10px rgba(0,0,0,0.3)', objectFit: 'cover', flexShrink: 0 }}
            />
            {!collapsed && (
              <div className="d-flex flex-column text-white">
                <span className="m-0 fw-bold fs-5 lh-1" style={{ letterSpacing: '1px', color: 'var(--accent-color)' }}>SENA</span>
                <small className="opacity-75" style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#e2e8f0' }}>BIOLAB</small>
              </div>
            )}
          </div>

          {/* Opciones del Menú */}
          <ul className="navbar-nav flex-column gap-1 mb-auto custom-scroll" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
            <li className="nav-item">
              <Link className="nav-link px-3 py-2" onClick={() => navigateTo("/")} title={collapsed ? "Inicio" : ""}>
                <i className={`fa-solid fa-house ${collapsed ? '' : 'me-3'} w-20px text-center`} style={{ minWidth: '20px', flexShrink: 0 }}></i>
                {!collapsed && <span className="sidebar-label">Inicio</span>}
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
