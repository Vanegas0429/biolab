import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ActividadMaterialForm = ({ hideModal, rowToEdit }) => {

    const [Estado, setEstado] = useState("Activo")
    const [textFormButton, setTextFormButton] = useState('Enviar')

    const [Actividades, setActividades] = useState([])
    const [Id_Actividad, setId_Actividad] = useState('')
    const [Materiales, setMateriales] = useState([])
    const [Id_Material, setId_Material] = useState('')

    // 🔹 Cargar Actividades
    useEffect(() => {
        getActividad()
        getMaterial()
    }, [])

    const getActividad = async () => {
        try {
            const res = await apiAxios.get('/api/Actividad')
            setActividades(res.data)
        } catch (error) {
            console.log("No se pudo cargar Actividades")
        }
    }

    const getMaterial = async () => {
        try {
            const res = await apiAxios.get('/api/Material')
            setMateriales(res.data)
        } catch (error) {
            console.log("No se pudo cargar Materiales")
        }
    }

    // 🔹 Cargar datos si es edición
    useEffect(() => {
        if (rowToEdit) {
            setId_Actividad(rowToEdit.Id_Actividad || '')
            setId_Material(rowToEdit.Id_Material || '')
            setEstado(rowToEdit.Estado || 'Activo')
            setTextFormButton('Actualizar')
        } else {
            setId_Actividad('')
            setId_Material('')
            setEstado('Activo')
            setTextFormButton('Enviar')
        }
    }, [rowToEdit])

    // 🔹 CREAR
    const crearActividadMaterial = async () => {
        return apiAxios.post('/api/ActividadMaterial', {
            Id_Actividad: Number(Id_Actividad),
            Id_Material: Number(Id_Material),
            Estado
        })
    }

    // 🔹 ACTUALIZAR
    const actualizarActividadMaterial = async () => {
        return apiAxios.put(`/api/Produccion/${rowToEdit.Id_produccion}`, {
            Id_Actividad: Number(Id_Actividad),
            Id_Material: Number(Id_Material),
            Estado
        })
    }

    const gestionarForm = async (e) => {
        e.preventDefault()

        if (!Id_Actividad, !Id_Material) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios",
                icon: "error"
            })
            return
        }

        try {

            if (rowToEdit) {
                await actualizarActividadMaterial()

                MySwal.fire({
                    title: "Actualización",
                    text: "Actividad Material actualizada correctamente",
                    icon: "success"
                })

            } else {

                await crearActividadMaterial()

                MySwal.fire({
                    title: "Creación",
                    text: "Actividad Material creada correctamente",
                    icon: "success"
                })
            }

            hideModal && hideModal()

        } catch (error) {

            console.error("Error al guardar Actividad Material:", error.response ? error.response.data : error.message);

            MySwal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar la Actividad Material",
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
                    {Actividades.map(e => (
                        <option key={e.Id_Actividad} value={e.Id_Actividad}>
                            {e.Nom_Actividad}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label>Material:</label>
                <select
                    className="form-control"
                    value={Id_Material}
                    onChange={(e) => setId_Material(Number(e.target.value))}
                >
                    <option value="">Selecciona</option>
                    {Materiales.map(e => (
                        <option key={e.Id_Material} value={e.Id_Material}>
                            {e.Nom_Material}
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

export default ActividadMaterialForm