import { useState, useEffect, useMemo } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import SearchableSelect from "../components/SearchableSelect.jsx";

const MySwal = withReactContent(Swal);

const normalizeText = (text) => {
    if (!text) return '';
    return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

const ActividadReactivoForm = ({ hideModal, refreshList, rowToEdit }) => {

    const [Estado, setEstado] = useState("Activo");
    const [textFormButton, setTextFormButton] = useState('Enviar');

    const [Actividades, setActividades] = useState([]);
    const [Id_Actividad, setId_Actividad] = useState('');
    const [Reactivos, setReactivos] = useState([]);
    const [reactivosSeleccionados, setReactivosSeleccionados] = useState([]);
    const [filtroReactivo, setFiltroReactivo] = useState('');

    // 🔹 Cargar Actividades y Reactivos
    useEffect(() => {
        getActividad();
        getReactivo();
    }, []);

    const getActividad = async () => {
        try {
            const res = await apiAxios.get('/api/Actividad');
            setActividades(res.data || []);
        } catch (error) {
            console.log("No se pudo cargar Actividades");
        }
    };

    const getReactivo = async () => {
        try {
            const res = await apiAxios.get('/api/Reactivo');
            setReactivos(res.data || []);
        } catch (error) {
            console.log("No se pudo cargar Reactivos");
        }
    };

    // 🔹 Cargar datos si es edición
    useEffect(() => {
        if (rowToEdit) {
            setId_Actividad(rowToEdit.Id_Actividad || '');
            const selectedReact = rowToEdit.reactivosList ? rowToEdit.reactivosList.map(r => r.Id_Reactivo) : [];
            setReactivosSeleccionados(selectedReact);
            setEstado(rowToEdit.Estado || 'Activo');
            setTextFormButton('Actualizar');
        } else {
            setId_Actividad('');
            setReactivosSeleccionados([]);
            setFiltroReactivo('');
            setEstado('Activo');
            setTextFormButton('Enviar');
        }
    }, [rowToEdit]);

    const handleCheckboxChange = (id) => {
        setReactivosSeleccionados(prev => 
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    // Filtrar reactivos activos y por texto de búsqueda
    const reactivosActivos = useMemo(() => {
        return Reactivos.filter(r => r.Estado === 'Activo');
    }, [Reactivos]);

    const reactivosFiltrados = useMemo(() => {
        if (!filtroReactivo.trim()) return reactivosActivos;
        const q = normalizeText(filtroReactivo);
        return reactivosActivos.filter(r => normalizeText(r.Nom_reactivo).includes(q));
    }, [reactivosActivos, filtroReactivo]);

    // 🔹 CREAR
    const crearActividadReactivo = async () => {
        const promises = reactivosSeleccionados.map(id_react => {
            return apiAxios.post('/api/ActividadReactivo', {
                Id_Actividad: Number(Id_Actividad),
                Id_Reactivo: Number(id_react),
                Estado
            });
        });
        return Promise.all(promises);
    };

    // 🔹 ACTUALIZAR
    const actualizarActividadReactivo = async () => {
        const initialReact = rowToEdit.reactivosList || [];
        const initialIds = initialReact.map(r => r.Id_Reactivo);
        
        const toCreate = reactivosSeleccionados.filter(id => !initialIds.includes(id));
        const toDelete = initialReact.filter(r => !reactivosSeleccionados.includes(r.Id_Reactivo));

        const promises = [];

        for (const id_react of toCreate) {
            promises.push(apiAxios.post('/api/ActividadReactivo', {
                Id_Actividad: Number(Id_Actividad),
                Id_Reactivo: Number(id_react),
                Estado
            }));
        }

        for (const react of toDelete) {
            promises.push(apiAxios.delete(`/api/ActividadReactivo/${react.Id_ActividadReactivo}`));
        }

        return Promise.all(promises);
    };

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Id_Actividad || reactivosSeleccionados.length === 0) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios y selecciona al menos un reactivo",
                icon: "error"
            });
            return;
        }

        try {
            if (rowToEdit) {
                await actualizarActividadReactivo();
                MySwal.fire({
                    title: "Actualizado",
                    text: "Actividad Reactivo actualizada",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await crearActividadReactivo();
                MySwal.fire({
                    title: "Registrado",
                    text: "Actividad Reactivos creados correctamente",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            hideModal && hideModal();
            refreshList && refreshList();

        } catch (error) {
            console.error("Error al guardar Actividad Reactivo:", error.response ? error.response.data : error.message);
            MySwal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar la Actividad Reactivo",
                icon: "error"
            });
        }
    };

    return (
        <form onSubmit={gestionarForm} className="row g-3">
            {/* Actividad */}
            <div className="col-md-6">
                <label className="form-label fw-bold">Actividad:</label>
                <SearchableSelect
                    options={Actividades.filter(a => a.Estado === 'Activo').map(e => ({
                        value: e.Id_Actividad,
                        label: e.Nom_Actividad
                    }))}
                    value={Id_Actividad}
                    onChange={val => setId_Actividad(val ? Number(val) : '')}
                    placeholder="Selecciona una actividad"
                    searchPlaceholder="Buscar actividad..."
                    disabled={!!rowToEdit}
                    required
                />
            </div>

            {/* Reactivos con Checkboxes y Buscador */}
            <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-bold m-0">Reactivos (Múltiple):</label>
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                        {reactivosSeleccionados.length} seleccionado(s)
                    </span>
                </div>

                {/* Barra de búsqueda de reactivos */}
                <div className="input-group input-group-sm mb-2 shadow-sm">
                    <span className="input-group-text bg-white border-end-0 rounded-start-pill text-muted px-3">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 rounded-end-pill px-2"
                        placeholder="Buscar reactivo por nombre..."
                        value={filtroReactivo}
                        onChange={(e) => setFiltroReactivo(e.target.value)}
                    />
                    {filtroReactivo && (
                        <button
                            type="button"
                            className="btn btn-sm btn-light border border-start-0 rounded-end-pill text-muted px-2"
                            onClick={() => setFiltroReactivo('')}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>

                {/* Lista de reactivos */}
                <div className="border rounded-4 p-3 bg-light shadow-sm custom-scroll" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {reactivosFiltrados.map(r => (
                        <div className="form-check my-1" key={r.Id_Reactivo}>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                value={r.Id_Reactivo} 
                                id={`react-${r.Id_Reactivo}`}
                                checked={reactivosSeleccionados.includes(r.Id_Reactivo)}
                                onChange={() => handleCheckboxChange(r.Id_Reactivo)}
                            />
                            <label className="form-check-label user-select-none" htmlFor={`react-${r.Id_Reactivo}`}>
                                {r.Nom_reactivo}
                            </label>
                        </div>
                    ))}
                    {reactivosFiltrados.length === 0 && (
                        <div className="text-center text-muted py-3 small">
                            <i className="fa-solid fa-circle-exclamation me-1"></i>
                            {reactivosActivos.length === 0 ? "No hay reactivos activos disponibles." : `No se encontraron reactivos para "${filtroReactivo}".`}
                        </div>
                    )}
                </div>
                <small className="text-muted d-block mt-1 ps-2">
                    Mostrando {reactivosFiltrados.length} de {reactivosActivos.length} reactivos activos
                </small>
            </div>

            {/* Botón */}
            <div className="col-12 mt-4 text-center">
                <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold"
                >
                    <i className={`fa-solid ${rowToEdit ? 'fa-rotate' : 'fa-paper-plane'} me-2`}></i>
                    {textFormButton}
                </button>
            </div>
        </form>
    );
};

export default ActividadReactivoForm;
