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
    const [Id_Reactivo, setId_Reactivo] = useState('')

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
            setId_Reactivo(rowToEdit.Id_Reactivo || '')
            setEstado(rowToEdit.Estado || 'Activo')
            setTextFormButton('Actualizar')
        } else {
            setId_Actividad('')
            setId_Reactivo('')
            setEstado('Activo')
            setTextFormButton('Enviar')
        }
    }, [rowToEdit])

    // 🔹 CREAR
    const crearActividadReactivo = async () => {
        return apiAxios.post('/api/ActividadReactivo', {
            Id_Actividad: Number(Id_Actividad),
            Id_Reactivo: Number(Id_Reactivo),
            Estado
        })
    }

    // 🔹 ACTUALIZAR
    const actualizarActividadReactivo = async () => {
        return apiAxios.put(`/api/Produccion/${rowToEdit.Id_ActividadReactivo}`, {
            Id_Actividad: Number(Id_Actividad),
            Id_Reactivo: Number(Id_Reactivo),
            Estado
        })
    }

    const gestionarForm = async (e) => {
        e.preventDefault()

        if (!Id_Actividad, !Id_Reactivo) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios",
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
                    text: "Actividad Reactivo creada correctamente",
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
        <form onSubmit={gestionarForm} className="col-12 col-md-6">
            {/* Actividad */}
            <div className="mb-3">
                <label>Actividad:</label>
                <select
                    className="form-control"
                    value={Id_Actividad}
                    onChange={(e) => setId_Actividad(Number(e.target.value))}
                >
                    <option value="">Selecciona</option>
                    {Actividades.filter(a => a.Estado === 'Activo').map(e => (
                        <option key={e.Id_Actividad} value={e.Id_Actividad}>
                            {e.Nom_Actividad}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label>Reactivo:</label>
                <select
                    className="form-control"
                    value={Id_Reactivo}
                    onChange={(e) => setId_Reactivo(Number(e.target.value))}
                >
                    <option value="">Selecciona</option>
                    {Reactivos.filter(r => r.Estado === 'Activo').map(e => (
                        <option key={e.Id_Reactivo} value={e.Id_Reactivo}>
                            {e.Nom_reactivo}
                        </option>
                    ))}
                </select>
            </div>

            {/* Botón */}
            <div className="mb-3">
                <input
                    type="submit"
                    className="btn btn-primary w-50"
                    value={textFormButton}
                />
            </div>

        </form>
    )
}

export default ActividadReactivoForm