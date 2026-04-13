import { Link, useNavigate } from "react-router-dom";
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

  const renderMenuItems = () => {
    if (!isAuth) {
      return (
        <>
          <li className="nav-item">
            <Link className="nav-link" onClick={() => revisarOffCanvas("/Solicitar-reserva")}>Reserva</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" onClick={() => revisarOffCanvas("/login")}>Iniciar sesión</Link>
          </li>
        </>
      );
    }

    return (
      <>
        <li className="nav-item">
          <Link className="nav-link" onClick={() => revisarOffCanvas("/Reserva")}>Reservas</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" onClick={() => revisarOffCanvas("/Sup_Plantas")}>Supervisión Plantas</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" onClick={() => revisarOffCanvas("/Especie")}>Especies</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" onClick={() => revisarOffCanvas("/Produccion")}>Producción</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" onClick={() => revisarOffCanvas("/Equipo")}>Equipos</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" onClick={() => revisarOffCanvas("/Reactivo")}>Reactivos</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" onClick={() => revisarOffCanvas("/Entrada")}>Entradas</Link>
        </li>
        <li className="nav-item">
          <button className="nav-link btn btn-link text-white" onClick={logOut}>Cerrar sesión</button>
        </li>
      </>
    );
  };

  return (
    <>
      <header className="bg-dark text-white py-3 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Botón offcanvas */}
          <button
            className="btn btn-primary d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasScrolling"
            aria-controls="offcanvasScrolling"
          >
            ☰
          </button>

          <div className="d-flex align-items-center gap-3">
            <img src="/logo.png" alt="Logo" style={{ width: 80, height: 80, borderRadius: "50%" }} />
            <div>
              <h2 className="m-0 fw-semibold">SENA</h2>
              <small className="opacity-75">BIOLAB</small>
            </div>
          </div>

          {/* Navbar escritorio */}
          <nav className="navbar navbar-expand-lg bg-dark d-none d-lg-block" data-bs-theme="dark">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">Home</Link>
              <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">{renderMenuItems()}</ul>
              </div>
            </div>
          </nav>
        </div>

        {/* Offcanvas móvil */}
        <div
          className="offcanvas offcanvas-start text-bg-dark"
          tabIndex="-1"
          id="offcanvasScrolling"
          aria-labelledby="offcanvasScrollingLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasScrollingLabel">Menú</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav">{renderMenuItems()}</ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBar;