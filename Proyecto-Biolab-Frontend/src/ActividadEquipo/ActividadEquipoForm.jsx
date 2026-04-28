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
    const [id_equipo, setId_Equipo] = useState('')

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
            setId_Equipo(rowToEdit.id_equipo || '')
            setEstado(rowToEdit.Estado || 'Activo')
            setTextFormButton('Actualizar')
        } else {
            setId_Actividad('')
            setId_Equipo('')
            setEstado('Activo')
            setTextFormButton('Enviar')
        }
    }, [rowToEdit])

    // 🔹 CREAR
    const crearActividadEquipo = async () => {
        return apiAxios.post('/api/ActividadEquipo', {
            Id_Actividad: Number(Id_Actividad),
            id_equipo: Number(id_equipo),
            Estado
        })
    }

    // 🔹 ACTUALIZAR
    const actualizarActividadEquipo = async () => {
        return apiAxios.put(`/api/Produccion/${rowToEdit.Id_ActividadEquipo}`, {
            Id_Actividad: Number(Id_Actividad),
            id_equipo: Number(id_equipo),
            Estado
        })
    }

    const gestionarForm = async (e) => {
        e.preventDefault()

        if (!Id_Actividad, !id_equipo) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios",
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
                    text: "Actividad Equipo creada correctamente",
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
                <label>Equipo:</label>
                <select
                    className="form-control"
                    value={id_equipo}
                    onChange={(e) => setId_Equipo(Number(e.target.value))}
                >
                    <option value="">Selecciona</option>
                    {Equipos.filter(e => e.estado === 'Activo').map(e => (
                        <option key={e.id_equipo} value={e.id_equipo}>
                            {e.nombre}
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

export default ActividadEquipoForm