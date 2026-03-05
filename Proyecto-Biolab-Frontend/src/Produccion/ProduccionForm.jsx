import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ProduccionForm = ({ hideModal, rowToEdit }) => {

    const [Tip_produccion, setTip_produccion] = useState('')
    const [Cod_produccion, setCod_produccion] = useState('')
    const [Estado, setEstado] = useState("Activo")
    const [textFormButton, setTextFormButton] = useState('Enviar')

    // 🔹 Cargar datos si es edición
    useEffect(() => {
        if (rowToEdit) {
            setTip_produccion(rowToEdit.Tip_produccion || '')
            setCod_produccion(rowToEdit.Cod_produccion || '')
            setEstado(rowToEdit.Estado || 'Activo')
            setTextFormButton('Actualizar')
        } else {
            setTip_produccion('')
            setCod_produccion('')
            setEstado('Activo')
            setTextFormButton('Enviar')
        }
    }, [rowToEdit])

    // 🔹 CREAR
    const crearProduccion = async () => {
        return apiAxios.post('/api/Produccion', {
            Tip_produccion,
            Cod_produccion,
            Estado
        })
    }

    // 🔹 ACTUALIZAR
    const actualizarProduccion = async () => {
        return apiAxios.put(`/api/Produccion/${rowToEdit.Id_produccion}`, {
            Tip_produccion,
            Cod_produccion,
            Estado
        })
    }

    const gestionarForm = async (e) => {
        e.preventDefault()

        if (!Tip_produccion || !Cod_produccion) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios",
                icon: "error"
            })
            return
        }

        try {

            if (rowToEdit) {
                await actualizarProduccion()
                MySwal.fire({
                    title: "Actualización",
                    text: "Producción actualizada correctamente",
                    icon: "success"
                })
            } else {
                await crearProduccion()
                MySwal.fire({
                    title: "Creación",
                    text: "Producción creada correctamente",
                    icon: "success"
                })
            }

            hideModal && hideModal()

        } catch (error) {
            console.error("Error al guardar producción:", error.response ? error.response.data : error.message);

            MySwal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar la producción",
                icon: "error"
            })
        }
    }

    return (
        <form onSubmit={gestionarForm} className="col-12 col-md-6">

            {/* Tipo Producción */}
            <div className="mb-3">
                <label htmlFor="Tip_produccion" className="form-label">
                    Tipo de Producción:
                </label>
                <select
                    id="Tip_produccion"
                    className="form-control"
                    value={Tip_produccion}
                    onChange={(e) => setTip_produccion(e.target.value)}
                >
                    <option value="">Selecciona uno</option>
                    <option value="Practica">Practica</option>
                    <option value="Propia">Propia</option>
                    <option value="Externa">Externa</option>
                </select>
            </div>

            {/* Código Producción */}
            <div className="mb-3">
                <label htmlFor="Cod_produccion" className="form-label">
                    Código de Producción:
                </label>
                <input
                    type="text"
                    id="Cod_produccion"
                    className="form-control"
                    value={Cod_produccion}
                    onChange={(e) => setCod_produccion(e.target.value)}
                />
            </div>
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

export default ProduccionForm
