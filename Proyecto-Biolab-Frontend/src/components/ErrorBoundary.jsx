import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger p-4 text-center">
          <i className="fa-solid fa-triangle-exclamation fs-1 mb-3 text-danger"></i>
          <h5 className="fw-bold">Ocurrió un error inesperado</h5>
          <p className="small text-muted mb-3">
            {this.state.error?.message || "No se pudo cargar el formulario."}
          </p>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-pill px-4"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
