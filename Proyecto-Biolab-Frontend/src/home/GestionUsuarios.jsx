import React, { useState, useEffect } from 'react';
import apiAxios from '../api/axiosConfig';
import Swal from 'sweetalert2';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const rolesDisponibles = ['administrador', 'solicitante', 'pasante', 'gestor', 'instructor', 'gerente', 'instructor_gerente'];

    const fetchUsuarios = async () => {
        try {
            const response = await apiAxios.get('/api/auth/usuarios');
            setUsuarios(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleRolChange = async (id, nuevoRol) => {
        try {
            await apiAxios.patch(`/api/auth/usuarios/${id}/rol`, { rol: nuevoRol });
            Swal.fire({
                title: '¡Actualizado!',
                text: 'El rol del usuario ha sido modificado con éxito.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            fetchUsuarios(); // Recargar lista
        } catch (error) {
            console.error("Error al actualizar rol:", error);
            Swal.fire('Error', 'No se pudo actualizar el rol', 'error');
        }
    };

    const filteredUsuarios = usuarios.filter(u => 
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.documento.toString().includes(searchTerm) ||
        u.telefono?.includes(searchTerm)
    );

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid py-4 fade-in">
            {/* HEADER */}
            <div className="row mb-4 align-items-center g-3">
                <div className="col">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '50px', height: '50px' }}>
                            <i className="fa-solid fa-users-gear fs-4"></i>
                        </div>
                        <div>
                            <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>Gestión de Usuarios</h2>
                            <p className="text-muted mb-0 small">Administra los roles y accesos del personal de laboratorio.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-auto">
                    <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border" style={{ width: '350px' }}>
                        <span className="input-group-text border-0 bg-transparent ps-3">
                            <i className="fa-solid fa-magnifying-glass text-muted"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 py-2 shadow-none bg-transparent" 
                            placeholder="Buscar por nombre, correo, tel..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* TABLA ESTILO PREMIUM CON CABECERA OSCURA */}
            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr style={{ background: 'var(--secondary-color)', color: 'white' }}>
                                <th className="px-4 py-3 border-0 fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>USUARIO</th>
                                <th className="py-3 border-0 fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>DOCUMENTO</th>
                                <th className="py-3 border-0 fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>TELÉFONO</th>
                                <th className="py-3 border-0 fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>CORREO</th>
                                <th className="py-3 border-0 fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>ROL ACTUAL</th>
                                <th className="px-4 py-3 border-0 text-end fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map((u) => (
                                <tr key={u.uuid} className="last-child-border-0">
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm border border-white border-2" style={{ width: '42px', height: '42px', fontWeight: 'bold', fontSize: '1rem' }}>
                                                {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{u.nombre}</div>
                                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.6rem' }}>UUID: {u.uuid ? u.uuid.substring(0,8) : 'N/A'}...</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-secondary fw-medium">{u.documento}</td>
                                    <td className="py-3 text-secondary">{u.telefono || <span className="badge bg-light text-muted border fw-normal">N/A</span>}</td>
                                    <td className="py-3 text-secondary" style={{ fontSize: '0.9rem' }}>{u.correo}</td>
                                    <td className="py-3">
                                        <span className={`badge rounded-pill px-3 py-2 ${u.rol === 'administrador' ? 'bg-danger text-white' : 'bg-primary-subtle text-primary border border-primary-subtle'}`} style={{ fontSize: '0.75rem', textTransform: 'capitalize', fontWeight: '600' }}>
                                            {u.rol.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="d-inline-block" style={{ width: '180px' }}>
                                            <select 
                                                className="form-select form-select-sm rounded-pill border-light-subtle shadow-sm px-3"
                                                value={u.rol}
                                                onChange={(e) => handleRolChange(u.uuid, e.target.value)}
                                                style={{ cursor: 'pointer', fontSize: '0.85rem', backgroundPosition: 'right 0.75rem center' }}
                                            >
                                                {rolesDisponibles.map(r => (
                                                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1).replace('_', ' ')}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsuarios.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        <i className="fa-solid fa-user-slash fs-1 mb-3 d-block opacity-25"></i>
                                        No se encontraron usuarios que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GestionUsuarios;
