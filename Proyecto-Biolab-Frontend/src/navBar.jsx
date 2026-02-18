import { Link, useNavigate } from "react-router-dom";
import * as bootstrap from "bootstrap";

const NavBar = () => {

  const navigate = useNavigate();

  const revisarOffCanvas = (ruta) => {
    const offcanvasElement = document.getElementById("offcanvasScrolling");
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);

    if (bsOffcanvas) {
      document.getElementById('botonCerrarOffCanvas').click();
    }

    setTimeout(() => {
      navigate(ruta);
    }, 150);
  };

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header className="bg-dark text-white py-3 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">

          {/* Botón menú móvil */}
          <button
            className="btn btn-primary d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasScrolling"
            aria-controls="offcanvasScrolling"
          >
            ☰
          </button>

          {/* LOGO + NOMBRE */}
          <div className="d-flex align-items-center gap-3">

            {/* LOGO CON IMAGEN */}
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
              }}
            />

            <div>
              <h2 className="m-0 fw-semibold">SENA</h2>
              <small className="opacity-75">BIOLAB</small>
            </div>
          </div>

          {/* NAVBAR ESCRITORIO */}
          <nav
            className="navbar navbar-expand-lg bg-dark d-none d-lg-block"
            data-bs-theme="dark"
          >
            <div className="container-fluid">

              <Link className="navbar-brand" to="/">Home</Link>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">

                  <li className="nav-item">
                    <Link className="nav-link" to="/Reserva">Reservas</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/Practica">Practicas</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/Sup_Plantas">Supervsion Plantas</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/Especie">Especies</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/Produccion">Producciones</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/Equipo">Equipos</Link>
                  </li>

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Opciones
                    </a>

                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">Acción</a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">Otra acción</a>
                      </li>
                    </ul>
                  </li>

                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* OFFCANVAS */}
      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabIndex="-1"
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasScrollingLabel">
            Menú
          </h5>

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            id="botonCerrarOffCanvas"
          ></button>
        </div>

        <div className="offcanvas-body">
          <ul className="navbar-nav">

            <li className="nav-item">
              <button
                onClick={() => revisarOffCanvas('/')}
                className="nav-link text-start"
              >
                Home
              </button>
            </li>

            <li className="nav-item">
              <button
                onClick={() => revisarOffCanvas('/Reserva')}
                className="nav-link text-start"
              >
                Reservas
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => revisarOffCanvas('/Practica')}
                className="nav-link text-start"
              >
                Practicas
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => revisarOffCanvas('/Sup_Plantas')}
                className="nav-link text-start"
              >
                Supervision Plantas
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => revisarOffCanvas('/Especie')}
                className="nav-link text-start"
              >
                Especies
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => revisarOffCanvas('/Produccion')}
                className="nav-link text-start"
              >
                Produccion 
              </button>
            </li>

          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
