import React, { useState, useEffect, useMemo } from 'react';
import apiAxios from '../api/axiosConfig';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const rolesDisponibles = ['administrador', 'solicitante', 'pasante', 'gestor'];

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
            fetchUsuarios();
        } catch (error) {
            console.error("Error al actualizar rol:", error);
            Swal.fire('Error', 'No se pudo actualizar el rol', 'error');
        }
    };

    const filteredUsuarios = useMemo(() => {
        return usuarios.filter(u => 
            u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.documento?.toString().includes(searchTerm) ||
            u.telefono?.includes(searchTerm)
        );
    }, [usuarios, searchTerm]);

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

            {/* TABLA ESTILO PREMIUM CON DATATABLE */}
            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                <DataTable
                    columns={[
                        {
                            name: 'USUARIO',
                            sortable: true,
                            grow: 2,
                            cell: row => (
                                <div className="d-flex align-items-center py-3">
                                    <div className="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center fw-bold me-3" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                                        {row.nombre?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark">{row.nombre}</div>
                                        <small className="text-muted">{row.correo}</small>
                                    </div>
                                </div>
                            )
                        },
                        { name: 'DOCUMENTO', selector: row => row.documento, sortable: true, width: '150px' },
                        { name: 'TELÉFONO', selector: row => row.telefono || 'N/A', sortable: true, width: '150px' },
                        {
                            name: 'ROL ACTUAL',
                            sortable: true,
                            width: '250px',
                            cell: row => (
                                <select 
                                    className="form-select form-select-sm border-0 bg-light rounded-pill px-3 shadow-none"
                                    value={row.rol}
                                    onChange={(e) => handleRolChange(row.uuid, e.target.value)}
                                    style={{ fontSize: '0.85rem', fontWeight: '500' }}
                                >
                                    {rolesDisponibles.map(r => (
                                        <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
                                    ))}
                                </select>
                            )
                        }
                    ]}
                    data={filteredUsuarios}
                    pagination
                    highlightOnHover
                    persistTableHead
                    noDataComponent={
                        <div className="text-center py-5 text-muted">
                            <i className="fa-solid fa-user-slash fs-1 mb-3 d-block opacity-25"></i>
                            No se encontraron usuarios.
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default GestionUsuarios;
