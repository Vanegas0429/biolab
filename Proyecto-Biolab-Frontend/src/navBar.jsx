import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as bootstrap from "bootstrap";

const NavBar = ({ isAuth, logOut }) => {
  const navigate = useNavigate();

  const revisarOffCanvas = (ruta) => {
    const offcanvasElement = document.getElementById("offcanvasScrolling");
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);

    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
    setTimeout(() => navigate(ruta), 150);
  };

  //  Activar dropdowns manualmente
  useEffect(() => {
    const dropdownElementList = document.querySelectorAll(".dropdown-toggle");
    dropdownElementList.forEach((el) => {
      new bootstrap.Dropdown(el);
    });
  }, []);

  const renderMenuItems = () => {
    if (!isAuth) {
      return (
        <>
          <li className="nav-item">
            <button className="nav-link btn btn-link text-white" onClick={() => revisarOffCanvas("/login")}>
              Iniciar sesión
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-link text-white" onClick={() => revisarOffCanvas("/register")}>
              Registrarse
            </button>
          </li>
        </>
      );
    }

    return (
      <>
        <li className="nav-item">
          <button className="nav-link btn btn-link text-white" onClick={() => revisarOffCanvas("/Reserva")}>
            Reservas
          </button>
        </li>

        {/*  SUBMENÚ Plantas */}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
            Plantas
          </a>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/Sup_Plantas")}>
                Supervision
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/Especie")}>
                Especies
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/Produccion")}>
                Producciones
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/Entrada")}>
                Entradas
              </button>
            </li>
          </ul>
        </li>

        {/*  SUBMENÚ INVENTARIO */}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
            Inventario
          </a>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/Equipo")}>
                Equipos
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/Material")}>
                Materiales
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/Reactivo")}>
                Reactivos
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/Entrada")}>
                Entradas
              </button>
            </li>
          </ul>
        </li>

        {/*  SUBMENÚ ACTIVIDADES */}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
            Actividades
          </a>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/Actividad")}>
                Actividades
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/ActividadEquipo")}>
                Act-Equipos
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/ActividadMaterial")}>
                Act-Materiales
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => revisarOffCanvas("/ActividadReactivo")}>
                Act-Reactivos
              </button>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <Link className="nav-link" onClick={() => revisarOffCanvas("/registroAdmin")}>Registrar Usuario</Link>
        </li>

        <li className="nav-item">
          <button className="nav-link btn btn-link text-white" onClick={logOut}>
            Cerrar sesión
          </button>
        </li>
      </>
    );
  };

  return (
    <>
      <header className="bg-dark text-white py-3 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">

          {/* Botón móvil */}
          <button
            className="btn btn-primary d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasScrolling"
          >
            ☰
          </button>

          {/* Logo */}
          <div className="d-flex align-items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: 80, height: 80, borderRadius: "50%" }}
            />
            <div>
              <h2 className="m-0 fw-semibold">SENA</h2>
              <small className="opacity-75">BIOLAB</small>
            </div>
          </div>

          {/* Navbar escritorio */}
          <nav className="navbar navbar-expand-lg bg-dark d-none d-lg-block" data-bs-theme="dark">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">Home</Link>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav">
                  {renderMenuItems()}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* Offcanvas móvil */}
        <div
          className="offcanvas offcanvas-start text-bg-dark"
          id="offcanvasScrolling"
          tabIndex="-1"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Menú</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav">
              {renderMenuItems()}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBar;