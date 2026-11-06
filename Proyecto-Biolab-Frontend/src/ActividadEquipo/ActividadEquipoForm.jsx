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

const ActividadEquipoForm = ({ hideModal, refreshList, rowToEdit }) => {

    const [Estado, setEstado] = useState("Activo");
    const [textFormButton, setTextFormButton] = useState('Enviar');

    const [Actividades, setActividades] = useState([]);
    const [Id_Actividad, setId_Actividad] = useState('');
    const [Equipos, setEquipos] = useState([]);
    const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);
    const [filtroEquipo, setFiltroEquipo] = useState('');

    // 🔹 Cargar Actividades y Equipos
    useEffect(() => {
        getActividad();
        getEquipo();
    }, []);

    const getActividad = async () => {
        try {
            const res = await apiAxios.get('/api/Actividad');
            setActividades(res.data || []);
        } catch (error) {
            console.log("No se pudo cargar Actividades");
        }
    };

    const getEquipo = async () => {
        try {
            const res = await apiAxios.get('/api/Equipo');
            setEquipos(res.data || []);
        } catch (error) {
            console.log("No se pudo cargar Equipos");
        }
    };

    // Filtrar equipos activos para obtener nombres únicos
    const uniqueEquipos = useMemo(() => {
        const list = [];
        const seenNames = new Set();
        Equipos.filter(e => e.estado === 'Activo').forEach(e => {
            const nameKey = e.nombre.trim().toLowerCase();
            if (!seenNames.has(nameKey)) {
                seenNames.add(nameKey);
                list.push(e);
            }
        });
        return list;
    }, [Equipos]);

    // Filtrado de equipos por búsqueda
    const equiposFiltrados = useMemo(() => {
        if (!filtroEquipo.trim()) return uniqueEquipos;
        const q = normalizeText(filtroEquipo);
        return uniqueEquipos.filter(e => normalizeText(e.nombre).includes(q));
    }, [uniqueEquipos, filtroEquipo]);

    // 🔹 Cargar datos si es edición
    useEffect(() => {
        if (rowToEdit && Equipos.length > 0) {
            setId_Actividad(rowToEdit.Id_Actividad || '');
            const initialSelectedIds = rowToEdit.equiposList ? rowToEdit.equiposList.map(e => e.Id_Equipo || e.Id_Equipo) : [];
            
            // Expandir a todos los equipos activos con el mismo nombre
            const selectedNames = new Set();
            initialSelectedIds.forEach(id => {
                const eqObj = Equipos.find(eq => (eq.Id_Equipo || eq.Id_Equipo) === id);
                if (eqObj) {
                    selectedNames.add(eqObj.nombre.trim().toLowerCase());
                }
            });

            const expandedEq = Equipos.filter(eq => eq.estado === 'Activo' && selectedNames.has(eq.nombre.trim().toLowerCase()))
                                      .map(eq => eq.Id_Equipo || eq.Id_Equipo);

            setEquiposSeleccionados(expandedEq);
            setEstado(rowToEdit.Estado || 'Activo');
            setTextFormButton('Actualizar');
        } else if (!rowToEdit) {
            setId_Actividad('');
            setEquiposSeleccionados([]);
            setFiltroEquipo('');
            setEstado('Activo');
            setTextFormButton('Enviar');
        }
    }, [rowToEdit, Equipos]);

    const handleCheckboxChangeByName = (nombre) => {
        const matchingIds = Equipos.filter(e => e.nombre.trim().toLowerCase() === nombre.trim().toLowerCase())
                                   .map(e => e.Id_Equipo || e.Id_Equipo);
        
        const anySelected = matchingIds.some(id => equiposSeleccionados.includes(id));
        
        if (anySelected) {
            setEquiposSeleccionados(prev => prev.filter(id => !matchingIds.includes(id)));
        } else {
            setEquiposSeleccionados(prev => {
                const newSelection = [...prev];
                matchingIds.forEach(id => {
                    if (!newSelection.includes(id)) {
                        newSelection.push(id);
                    }
                });
                return newSelection;
            });
        }
    };

    // 🔹 CREAR
    const crearActividadEquipo = async () => {
        const promises = equiposSeleccionados.map(id_eq => {
            return apiAxios.post('/api/ActividadEquipo', {
                Id_Actividad: Number(Id_Actividad),
                Id_Equipo: Number(id_eq),
                Estado
            });
        });
        return Promise.all(promises);
    };

    // 🔹 ACTUALIZAR
    const actualizarActividadEquipo = async () => {
        const initialEq = rowToEdit.equiposList || [];
        const initialIds = initialEq.map(e => e.Id_Equipo || e.Id_Equipo);
        
        const toCreate = equiposSeleccionados.filter(id => !initialIds.includes(id));
        const toDelete = initialEq.filter(e => !equiposSeleccionados.includes(e.Id_Equipo || e.Id_Equipo));

        const promises = [];

        for (const id_eq of toCreate) {
            promises.push(apiAxios.post('/api/ActividadEquipo', {
                Id_Actividad: Number(Id_Actividad),
                Id_Equipo: Number(id_eq),
                Estado
            }));
        }

        for (const eq of toDelete) {
            promises.push(apiAxios.delete(`/api/ActividadEquipo/${eq.Id_ActividadEquipo}`));
        }

        return Promise.all(promises);
    };

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Id_Actividad || equiposSeleccionados.length === 0) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios y selecciona al menos un equipo",
                icon: "error"
            });
            return;
        }

        try {
            if (rowToEdit) {
                await actualizarActividadEquipo();
                MySwal.fire({
                    title: "Actualizado",
                    text: "Actividad Equipo actualizada",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await crearActividadEquipo();
                MySwal.fire({
                    title: "Registrado",
                    text: "Actividad Equipos creados correctamente",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            refreshList && refreshList();
            hideModal && hideModal();

        } catch (error) {
            console.error("Error al guardar Actividad Equipo:", error.response ? error.response.data : error.message);
            MySwal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar la Actividad Equipo",
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

            {/* Equipos con Checkboxes y Buscador */}
            <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-bold m-0">Equipos (Múltiple):</label>
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                        {equiposSeleccionados.length} seleccionado(s)
                    </span>
                </div>

                {/* Barra de búsqueda de equipos */}
                <div className="input-group input-group-sm mb-2 shadow-sm">
                    <span className="input-group-text bg-white border-end-0 rounded-start-pill text-muted px-3">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 rounded-end-pill px-2"
                        placeholder="Buscar equipo por nombre..."
                        value={filtroEquipo}
                        onChange={(e) => setFiltroEquipo(e.target.value)}
                    />
                    {filtroEquipo && (
                        <button
                            type="button"
                            className="btn btn-sm btn-light border border-start-0 rounded-end-pill text-muted px-2"
                            onClick={() => setFiltroEquipo('')}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>

                {/* Lista de equipos */}
                <div className="border rounded-4 p-3 bg-light shadow-sm custom-scroll" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {equiposFiltrados.map(e => {
                        const name = e.nombre;
                        const isChecked = Equipos.filter(eq => eq.nombre.trim().toLowerCase() === name.trim().toLowerCase())
                                                 .some(eq => equiposSeleccionados.includes(eq.Id_Equipo || eq.Id_Equipo));
                        return (
                            <div className="form-check my-1" key={e.Id_Equipo || e.Id_Equipo}>
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    value={name} 
                                    id={`equipo-${e.Id_Equipo || e.Id_Equipo}`}
                                    checked={isChecked}
                                    onChange={() => handleCheckboxChangeByName(name)}
                                />
                                <label className="form-check-label user-select-none" htmlFor={`equipo-${e.Id_Equipo || e.Id_Equipo}`}>
                                    {name}
                                </label>
                            </div>
                        );
                    })}
                    {equiposFiltrados.length === 0 && (
                        <div className="text-center text-muted py-3 small">
                            <i className="fa-solid fa-circle-exclamation me-1"></i>
                            {uniqueEquipos.length === 0 ? "No hay equipos activos disponibles." : `No se encontraron equipos para "${filtroEquipo}".`}
                        </div>
                    )}
                </div>
                <small className="text-muted d-block mt-1 ps-2">
                    Mostrando {equiposFiltrados.length} de {uniqueEquipos.length} tipos de equipo
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

export default ActividadEquipoForm;
