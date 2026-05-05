import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ActividadEquipoForm = ({ hideModal, rowToEdit }) => {

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

    // 🔹 Cargar datos si es edición
    useEffect(() => {
        if (rowToEdit) {
            setId_Actividad(rowToEdit.Id_Actividad || '')
            const selectedEq = rowToEdit.equiposList ? rowToEdit.equiposList.map(e => e.id_equipo) : [];
            setEquiposSeleccionados(selectedEq)
            setEstado(rowToEdit.Estado || 'Activo')
            setTextFormButton('Actualizar')
        } else {
            setId_Actividad('')
            setEquiposSeleccionados([])
            setEstado('Activo')
            setTextFormButton('Enviar')
        }
    }, [rowToEdit])

    const handleCheckboxChange = (id) => {
        setEquiposSeleccionados(prev => 
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
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
        const initialIds = initialEq.map(e => e.id_equipo);
        
        const toCreate = equiposSeleccionados.filter(id => !initialIds.includes(id));
        const toDelete = initialEq.filter(e => !equiposSeleccionados.includes(e.id_equipo));

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
                    title: "Actualización",
                    text: "Actividad Equipo actualizada correctamente",
                    icon: "success"
                })

            } else {

                await crearActividadEquipo()

                MySwal.fire({
                    title: "Creación",
                    text: "Actividad Equipos creados correctamente",
                    icon: "success"
                })
            }

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
        <form onSubmit={gestionarForm} className="col-12 col-md-12">
            <div className="row">
                {/* Actividad */}
                <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-1">Actividad:</label>
                    <select
                        className="form-control"
                        value={Id_Actividad}
                        onChange={(e) => setId_Actividad(Number(e.target.value))}
                        disabled={!!rowToEdit} // Bloquear cambio de actividad si es edición
                    >
                        <option value="">Selecciona</option>
                        {Actividades.filter(a => a.Estado === 'Activo').map(e => (
                            <option key={e.Id_Actividad} value={e.Id_Actividad}>
                                {e.Nom_Actividad}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Equipos con Checkboxes */}
                <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-1">Equipos (Múltiple):</label>
                    <div className="border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                        {Equipos.filter(e => e.estado === 'Activo').map(e => (
                            <div className="form-check" key={e.id_equipo}>
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    value={e.id_equipo} 
                                    id={`equipo-${e.id_equipo}`}
                                    checked={equiposSeleccionados.includes(e.id_equipo)}
                                    onChange={() => handleCheckboxChange(e.id_equipo)}
                                />
                                <label className="form-check-label" htmlFor={`equipo-${e.id_equipo}`}>
                                    {e.nombre}
                                </label>
                            </div>
                        ))}
                        {Equipos.filter(e => e.estado === 'Activo').length === 0 && (
                            <small className="text-muted">No hay equipos activos disponibles.</small>
                        )}
                    </div>
                    <small className="text-muted">{equiposSeleccionados.length} seleccionado(s)</small>
                </div>
            </div>

            {/* Botón */}
            <div className="mb-3 text-end">
                <button
                    type="submit"
                    className="btn btn-primary px-4 fw-bold shadow-sm"
                >
                    <i className="fa-solid fa-floppy-disk me-2"></i>
                    {textFormButton}
                </button>
            </div>
        </form>
    )
}

export default ActividadEquipoForm