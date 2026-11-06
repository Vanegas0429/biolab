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

const ActividadMaterialForm = ({ hideModal, refreshList, rowToEdit }) => {

    const [Estado, setEstado] = useState("Activo");
    const [textFormButton, setTextFormButton] = useState('Enviar');

    const [Actividades, setActividades] = useState([]);
    const [Id_Actividad, setId_Actividad] = useState('');
    const [Materiales, setMateriales] = useState([]);
    const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
    const [filtroMaterial, setFiltroMaterial] = useState('');

    // 🔹 Cargar Actividades y Materiales
    useEffect(() => {
        getActividad();
        getMaterial();
    }, []);

    const getActividad = async () => {
        try {
            const res = await apiAxios.get('/api/Actividad');
            setActividades(res.data || []);
        } catch (error) {
            console.log("No se pudo cargar Actividades");
        }
    };

    const getMaterial = async () => {
        try {
            const res = await apiAxios.get('/api/Material');
            setMateriales(res.data || []);
        } catch (error) {
            console.log("No se pudo cargar Materiales");
        }
    };

    // 🔹 Cargar datos si es edición
    useEffect(() => {
        if (rowToEdit) {
            setId_Actividad(rowToEdit.Id_Actividad || '');
            const selectedMat = rowToEdit.materialesList ? rowToEdit.materialesList.map(m => m.Id_Material) : [];
            setMaterialesSeleccionados(selectedMat);
            setEstado(rowToEdit.Estado || 'Activo');
            setTextFormButton('Actualizar');
        } else {
            setId_Actividad('');
            setMaterialesSeleccionados([]);
            setFiltroMaterial('');
            setEstado('Activo');
            setTextFormButton('Enviar');
        }
    }, [rowToEdit]);

    const handleCheckboxChange = (id) => {
        setMaterialesSeleccionados(prev => 
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    // Filtrar materiales activos y por texto de búsqueda
    const materialesActivos = useMemo(() => {
        return Materiales.filter(m => m.Estado === 'Activo');
    }, [Materiales]);

    const materialesFiltrados = useMemo(() => {
        if (!filtroMaterial.trim()) return materialesActivos;
        const q = normalizeText(filtroMaterial);
        return materialesActivos.filter(m => 
            normalizeText(m.Nom_Material).includes(q) || 
            normalizeText(m.clasificacion).includes(q)
        );
    }, [materialesActivos, filtroMaterial]);

    // 🔹 CREAR
    const crearActividadMaterial = async () => {
        const promises = materialesSeleccionados.map(id_mat => {
            return apiAxios.post('/api/ActividadMaterial', {
                Id_Actividad: Number(Id_Actividad),
                Id_Material: Number(id_mat),
                Estado
            });
        });
        return Promise.all(promises);
    };

    // 🔹 ACTUALIZAR
    const actualizarActividadMaterial = async () => {
        const initialMat = rowToEdit.materialesList || [];
        const initialIds = initialMat.map(m => m.Id_Material);
        
        const toCreate = materialesSeleccionados.filter(id => !initialIds.includes(id));
        const toDelete = initialMat.filter(m => !materialesSeleccionados.includes(m.Id_Material));

        const promises = [];

        for (const id_mat of toCreate) {
            promises.push(apiAxios.post('/api/ActividadMaterial', {
                Id_Actividad: Number(Id_Actividad),
                Id_Material: Number(id_mat),
                Estado
            }));
        }

        for (const mat of toDelete) {
            promises.push(apiAxios.delete(`/api/ActividadMaterial/${mat.Id_ActividadMaterial}`));
        }

        return Promise.all(promises);
    };

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Id_Actividad || materialesSeleccionados.length === 0) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios y selecciona al menos un material",
                icon: "error"
            });
            return;
        }

        try {
            if (rowToEdit) {
                await actualizarActividadMaterial();
                MySwal.fire({
                    title: "Actualizado",
                    text: "Actividad Material actualizada",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await crearActividadMaterial();
                MySwal.fire({
                    title: "Registrado",
                    text: "Actividad Materiales creados correctamente",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            refreshList && refreshList();
            hideModal && hideModal();

        } catch (error) {
            console.error("Error al guardar Actividad Material:", error.response ? error.response.data : error.message);
            MySwal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar la Actividad Material",
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

            {/* Materiales con Checkboxes y Buscador */}
            <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-bold m-0">Materiales (Múltiple):</label>
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                        {materialesSeleccionados.length} seleccionado(s)
                    </span>
                </div>

                {/* Barra de búsqueda de materiales */}
                <div className="input-group input-group-sm mb-2 shadow-sm">
                    <span className="input-group-text bg-white border-end-0 rounded-start-pill text-muted px-3">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 rounded-end-pill px-2"
                        placeholder="Buscar material por nombre..."
                        value={filtroMaterial}
                        onChange={(e) => setFiltroMaterial(e.target.value)}
                    />
                    {filtroMaterial && (
                        <button
                            type="button"
                            className="btn btn-sm btn-light border border-start-0 rounded-end-pill text-muted px-2"
                            onClick={() => setFiltroMaterial('')}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>

                {/* Lista de materiales */}
                <div className="border rounded-4 p-3 bg-light shadow-sm custom-scroll" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {materialesFiltrados.map(m => (
                        <div className="form-check my-1" key={m.Id_Material}>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                value={m.Id_Material} 
                                id={`mat-${m.Id_Material}`}
                                checked={materialesSeleccionados.includes(m.Id_Material)}
                                onChange={() => handleCheckboxChange(m.Id_Material)}
                            />
                            <label className="form-check-label user-select-none" htmlFor={`mat-${m.Id_Material}`}>
                                <span>{m.Nom_Material}</span>
                                {m.clasificacion && (
                                    <small className="text-muted ms-2">({m.clasificacion})</small>
                                )}
                            </label>
                        </div>
                    ))}
                    {materialesFiltrados.length === 0 && (
                        <div className="text-center text-muted py-3 small">
                            <i className="fa-solid fa-circle-exclamation me-1"></i>
                            {materialesActivos.length === 0 ? "No hay materiales activos disponibles." : `No se encontraron materiales para "${filtroMaterial}".`}
                        </div>
                    )}
                </div>
                <small className="text-muted d-block mt-1 ps-2">
                    Mostrando {materialesFiltrados.length} de {materialesActivos.length} materiales activos
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

export default ActividadMaterialForm;
