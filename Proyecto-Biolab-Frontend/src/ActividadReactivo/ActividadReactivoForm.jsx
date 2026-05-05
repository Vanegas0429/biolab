import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ActividadReactivoForm = ({ hideModal, rowToEdit }) => {

    const [Estado, setEstado] = useState("Activo")
    const [textFormButton, setTextFormButton] = useState('Enviar')

    const [Actividades, setActividades] = useState([])
    const [Id_Actividad, setId_Actividad] = useState('')
    const [Reactivos, setReactivos] = useState([])
    const [reactivosSeleccionados, setReactivosSeleccionados] = useState([])

    // 🔹 Cargar Actividades
    useEffect(() => {
        getActividad()
        getReactivo()
    }, [])

    const getActividad = async () => {
        try {
            const res = await apiAxios.get('/api/Actividad')
            setActividades(res.data)
        } catch (error) {
            console.log("No se pudo cargar Actividades")
        }
    }

    const getReactivo = async () => {
        try {
            const res = await apiAxios.get('/api/Reactivo')
            setReactivos(res.data)
        } catch (error) {
            console.log("No se pudo cargar Reactivos")
        }
    }

    // 🔹 Cargar datos si es edición
    useEffect(() => {
        if (rowToEdit) {
            setId_Actividad(rowToEdit.Id_Actividad || '')
            const selectedReact = rowToEdit.reactivosList ? rowToEdit.reactivosList.map(r => r.Id_Reactivo) : [];
            setReactivosSeleccionados(selectedReact)
            setEstado(rowToEdit.Estado || 'Activo')
            setTextFormButton('Actualizar')
        } else {
            setId_Actividad('')
            setReactivosSeleccionados([])
            setEstado('Activo')
            setTextFormButton('Enviar')
        }
    }, [rowToEdit])

    const handleCheckboxChange = (id) => {
        setReactivosSeleccionados(prev => 
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    }

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
    }

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
    }

    const gestionarForm = async (e) => {
        e.preventDefault()

        if (!Id_Actividad || reactivosSeleccionados.length === 0) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios y selecciona al menos un reactivo",
                icon: "error"
            })
            return
        }

        try {

            if (rowToEdit) {
                await actualizarActividadReactivo()

                MySwal.fire({
                    title: "Actualización",
                    text: "Actividad Reactivo actualizada correctamente",
                    icon: "success"
                })

            } else {

                await crearActividadReactivo()

                MySwal.fire({
                    title: "Creación",
                    text: "Actividad Reactivos creados correctamente",
                    icon: "success"
                })
            }

            hideModal && hideModal()

        } catch (error) {

            console.error("Error al guardar Actividad Reactivo:", error.response ? error.response.data : error.message);

            MySwal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar la Actividad Reactivo",
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
                        disabled={!!rowToEdit}
                    >
                        <option value="">Selecciona</option>
                        {Actividades.filter(a => a.Estado === 'Activo').map(e => (
                            <option key={e.Id_Actividad} value={e.Id_Actividad}>
                                {e.Nom_Actividad}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reactivos con Checkboxes */}
                <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-1">Reactivos (Múltiple):</label>
                    <div className="border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                        {Reactivos.filter(r => r.Estado === 'Activo').map(r => (
                            <div className="form-check" key={r.Id_Reactivo}>
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    value={r.Id_Reactivo} 
                                    id={`react-${r.Id_Reactivo}`}
                                    checked={reactivosSeleccionados.includes(r.Id_Reactivo)}
                                    onChange={() => handleCheckboxChange(r.Id_Reactivo)}
                                />
                                <label className="form-check-label" htmlFor={`react-${r.Id_Reactivo}`}>
                                    {r.Nom_reactivo}
                                </label>
                            </div>
                        ))}
                        {Reactivos.filter(r => r.Estado === 'Activo').length === 0 && (
                            <small className="text-muted">No hay reactivos activos disponibles.</small>
                        )}
                    </div>
                    <small className="text-muted">{reactivosSeleccionados.length} seleccionado(s)</small>
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

export default ActividadReactivoForm