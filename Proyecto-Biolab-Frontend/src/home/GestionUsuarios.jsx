import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import apiAxios from '../api/axiosConfig';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

// ─── Modal de confirmación de cambio de rol ───────────────────────────────────
const ModalConfirmRol = ({ pendingChange, onConfirm, onCancel }) => {
    if (!pendingChange) return null;
    const { usuario, nuevoRol } = pendingChange;

    const overlayStyle = {
        position: 'fixed', inset: 0, zIndex: 10000005,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)',
        animation: 'fadeInOverlay 0.2s ease',
        pointerEvents: 'auto'
    };
    const cardStyle = {
        background: '#fff', borderRadius: '24px', padding: '32px 28px',
        maxWidth: '440px', width: '90%', boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        textAlign: 'center', animation: 'slideInModal 0.25s ease',
        pointerEvents: 'auto', position: 'relative', zIndex: 10000006
    };

    return (
        <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <style>{`
                @keyframes fadeInOverlay { from { opacity:0 } to { opacity:1 } }
                @keyframes slideInModal { from { transform:translateY(-20px);opacity:0 } to { transform:translateY(0);opacity:1 } }
            `}</style>
            <div style={cardStyle}>
                {/* Ícono */}
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#059669,#10b981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 18px', boxShadow: '0 6px 20px rgba(5,150,105,0.35)'
                }}>
                    <i className="fa-solid fa-user-gear" style={{ color: '#fff', fontSize: '1.6rem' }}></i>
                </div>

                {/* Título */}
                <h5 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    ¿Cambiar rol de usuario?
                </h5>

                {/* Descripción */}
                <p style={{ color: '#475569', fontSize: '14px', marginBottom: '18px' }}>
                    ¿Deseas cambiar el rol asignado a <strong>{usuario.nombre}</strong>?
                </p>

                {/* Badges */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    background: '#f8fafc', padding: '8px 20px',
                    borderRadius: '50px', border: '1px solid #e2e8f0', marginBottom: '24px'
                }}>
                    <span style={{
                        background: '#64748b', color: '#fff', borderRadius: '50px',
                        padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600
                    }}>{usuario.rol.toUpperCase()}</span>
                    <i className="fa-solid fa-arrow-right" style={{ color: '#94a3b8', fontSize: '0.8rem' }}></i>
                    <span style={{
                        background: '#059669', color: '#fff', borderRadius: '50px',
                        padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600
                    }}>{nuevoRol.toUpperCase()}</span>
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onCancel(); }}
                        style={{
                            flex: 1, padding: '11px 0', borderRadius: '50px', border: '1.5px solid #cbd5e1',
                            background: '#f8fafc', color: '#475569', fontWeight: 600,
                            fontSize: '0.92rem', cursor: 'pointer', transition: 'all 0.2s',
                            pointerEvents: 'auto'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onConfirm(); }}
                        style={{
                            flex: 1, padding: '11px 0', borderRadius: '50px', border: 'none',
                            background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff',
                            fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(5,150,105,0.4)', transition: 'all 0.2s',
                            pointerEvents: 'auto'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <i className="fa-solid fa-check me-2"></i>Sí, cambiar
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingChange, setPendingChange] = useState(null); // { usuario, nuevoRol }
    const selectsRef = useRef({});  // Guarda referencias DOM de cada select

    const rolesDisponibles = ['administrador', 'solicitante', 'pasante', 'gestor', 'instructor'];

    const fetchUsuarios = async (isSilent = false) => {
        try {
            if (!isSilent && usuarios.length === 0) setLoading(true);
            const response = await apiAxios.get('/api/auth/usuarios');
            setUsuarios(response.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();

        // Auto-refresh silencioso en segundo plano cada 10 segundos
        const interval = setInterval(() => {
            if (pendingChange) return; // No refrescar si hay modal abierto
            fetchUsuarios(true);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // Cuando el usuario selecciona un rol diferente en el <select>
    const handleRolChangeIntent = useCallback((row, nuevoRol, selectEl) => {
        if (!row || row.rol === nuevoRol) return;

        // Revertir el select visualmente de inmediato, ANTES de cualquier async
        if (selectEl) selectEl.value = row.rol;

        // Guardar el cambio pendiente → abre el modal de confirmación
        setPendingChange({ usuario: row, nuevoRol, selectEl });
    }, []);

    // Confirmar cambio de rol
    const handleConfirm = useCallback(async () => {
        if (!pendingChange) return;
        const { usuario, nuevoRol } = pendingChange;
        setPendingChange(null); // Cerrar modal inmediatamente

        try {
            await apiAxios.patch(`/api/auth/usuarios/${usuario.uuid}/rol`, { rol: nuevoRol });

            // Actualizar estado local con el nuevo rol
            setUsuarios(prev =>
                prev.map(u => u.uuid === usuario.uuid ? { ...u, rol: nuevoRol } : u)
            );

            Swal.fire({
                title: '¡Rol actualizado!',
                text: `El rol de ${usuario.nombre} ha sido cambiado a ${nuevoRol.toUpperCase()}.`,
                icon: 'success',
                timer: 2500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Error al actualizar rol:", error);
            Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar el rol.', 'error');
        }
    }, [pendingChange]);

    // Cancelar: el select ya fue revertido visualmente en handleRolChangeIntent
    const handleCancel = useCallback(() => {
        setPendingChange(null);
    }, []);

    const filteredUsuarios = useMemo(() => {
        return usuarios.filter(u =>
            u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <>
            {/* Modal de confirmación (fuera del flujo del DataTable) */}
            <ModalConfirmRol
                pendingChange={pendingChange}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />

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

                {/* TABLA */}
                <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                    <DataTable
                        columns={[
                            {
                                name: 'USUARIO',
                                sortable: true,
                                grow: 2,
                                cell: row => (
                                    <div className="d-flex align-items-center py-3">
                                        <div className="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center fw-bold me-3"
                                            style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                                            {row.nombre?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark">{row.nombre}</div>
                                            <small className="text-muted">{row.correo}</small>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                name: 'TELÉFONO',
                                selector: row => row.telefono || 'N/A',
                                sortable: true,
                                width: '150px'
                            },
                            {
                                name: 'ROL ACTUAL',
                                sortable: true,
                                width: '250px',
                                cell: row => (
                                    <select
                                        // La key fuerza re-render solo cuando el rol en el estado cambia
                                        key={`select-${row.uuid}-${row.rol}`}
                                        className="form-select form-select-sm border-0 bg-light rounded-pill px-3 shadow-none"
                                        defaultValue={row.rol}
                                        onChange={(e) => {
                                            // Capturar el elemento y el valor ANTES de que React lo recicle
                                            const el = e.target;
                                            const valor = el.value;
                                            handleRolChangeIntent(row, valor, el);
                                        }}
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
        </>
    );
};

export default GestionUsuarios;
