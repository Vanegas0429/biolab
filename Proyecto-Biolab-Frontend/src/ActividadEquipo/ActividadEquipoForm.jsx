import { useState, useEffect, useMemo } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ActividadEquipoForm = ({ hideModal, refreshList, rowToEdit }) => {

    const [Estado, setEstado] = useState("Activo")
    const [textFormButton, setTextFormButton] = useState('Enviar')

    const [Actividades, setActividades] = useState([])
    const [Id_Actividad, setId_Actividad] = useState('')
    const [Equipos, setEquipos] = useState([])
    const [equiposSeleccionados, setEquiposSeleccionados] = useState([])

    // 🔹 Cargar Actividades
    useEffect(() => {
        getActividad()
        getEquipo()
    }, [])

    const getActividad = async () => {
        try {
            const res = await apiAxios.get('/api/Actividad')
            setActividades(res.data)
        } catch (error) {
            console.log("No se pudo cargar Actividades")
        }
    }

    const getEquipo = async () => {
        try {
            const res = await apiAxios.get('/api/Equipo')
            setEquipos(res.data)
        } catch (error) {
            console.log("No se pudo cargar Equipos")
        }
    }

    // Filter active equipment to get unique names
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

    // 🔹 Cargar datos si es edición
    useEffect(() => {
        if (rowToEdit && Equipos.length > 0) {
            setId_Actividad(rowToEdit.Id_Actividad || '')
            const initialSelectedIds = rowToEdit.equiposList ? rowToEdit.equiposList.map(e => e.Id_Equipo || e.Id_Equipo) : [];
            
            // Expand to all active equipment sharing the same name as any of the initial selected equipment
            const selectedNames = new Set();
            initialSelectedIds.forEach(id => {
                const eqObj = Equipos.find(eq => (eq.Id_Equipo || eq.Id_Equipo) === id);
                if (eqObj) {
                    selectedNames.add(eqObj.nombre.trim().toLowerCase());
                }
            });

            const expandedEq = Equipos.filter(eq => eq.estado === 'Activo' && selectedNames.has(eq.nombre.trim().toLowerCase()))
                                      .map(eq => eq.Id_Equipo || eq.Id_Equipo);

            setEquiposSeleccionados(expandedEq)
            setEstado(rowToEdit.Estado || 'Activo')
            setTextFormButton('Actualizar')
        } else if (!rowToEdit) {
            setId_Actividad('')
            setEquiposSeleccionados([])
            setEstado('Activo')
            setTextFormButton('Enviar')
        }
    }, [rowToEdit, Equipos])

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
    }

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
    }

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
    }

    const gestionarForm = async (e) => {
        e.preventDefault()

        if (!Id_Actividad || equiposSeleccionados.length === 0) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios y selecciona al menos un equipo",
                icon: "error"
            })
            return
        }

        try {

            if (rowToEdit) {
                await actualizarActividadEquipo()

                MySwal.fire({
                    title: "Actualizado", text: "Actividad Equipo actualizada",
                    icon: "success"
                })

            } else {

                await crearActividadEquipo()

                MySwal.fire({
                    title: "Registrado",
                    text: "Actividad Equipos creados correctamente",
                    icon: "success"
                })
            }

            refreshList && refreshList()
            hideModal && hideModal()

        } catch (error) {

            console.error("Error al guardar Actividad Equipo:", error.response ? error.response.data : error.message);

            MySwal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar la Actividad Equipo",
                icon: "error"
            })
        }
    }

    return (
        <form onSubmit={gestionarForm} className="row g-3">
            {/* Actividad */}
            <div className="col-md-6">
                <label className="form-label fw-bold">Actividad:</label>
                <select
                    className="form-select rounded-pill px-3 shadow-sm"
                    value={Id_Actividad}
                    onChange={(e) => setId_Actividad(Number(e.target.value))}
                    disabled={!!rowToEdit} // Bloquear cambio de actividad si es edición
                >
                    <option value="">Selecciona una actividad</option>
                    {Actividades.filter(a => a.Estado === 'Activo').map(e => (
                        <option key={e.Id_Actividad} value={e.Id_Actividad}>
                            {e.Nom_Actividad}
                        </option>
                    ))}
                </select>
            </div>

            {/* Equipos con Checkboxes */}
            <div className="col-md-6">
                <label className="form-label fw-bold">Equipos (Múltiple):</label>
                <div className="border rounded-4 p-3 bg-light shadow-sm custom-scroll" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {uniqueEquipos.map(e => {
                        const name = e.nombre;
                        const isChecked = Equipos.filter(eq => eq.nombre.trim().toLowerCase() === name.trim().toLowerCase())
                                                 .some(eq => equiposSeleccionados.includes(eq.Id_Equipo || eq.Id_Equipo));
                        return (
                            <div className="form-check" key={e.Id_Equipo || e.Id_Equipo}>
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    value={name} 
                                    id={`equipo-${e.Id_Equipo || e.Id_Equipo}`}
                                    checked={isChecked}
                                    onChange={() => handleCheckboxChangeByName(name)}
                                />
                                <label className="form-check-label" htmlFor={`equipo-${e.Id_Equipo || e.Id_Equipo}`}>
                                    {name}
                                </label>
                            </div>
                        );
                    })}
                    {uniqueEquipos.length === 0 && (
                        <small className="text-muted">No hay equipos activos disponibles.</small>
                    )}
                </div>
                <small className="text-muted d-block mt-1 ps-2">
                    {uniqueEquipos.filter(e => Equipos.filter(eq => eq.nombre.trim().toLowerCase() === e.nombre.trim().toLowerCase()).some(eq => equiposSeleccionados.includes(eq.Id_Equipo || eq.Id_Equipo))).length} tipo(s) de equipo seleccionado(s) ({equiposSeleccionados.length} en total)
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
    )
}

export default ActividadEquipoForm