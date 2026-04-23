import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ProduccionForm = ({ hideModal, rowToEdit }) => {

    const [Lote, setLote_Produccion] = useState('')
    const [Tip_produccion, setTip_produccion] = useState('')
    const [Fec_produccion, setFec_produccion] = useState('')
    const [Estado, setEstado] = useState("Activo")
    const [textFormButton, setTextFormButton] = useState('Enviar')

    const [Especies, setEspecies] = useState([])
    const [Id_especie, setId_especie] = useState('')

    // 🔹 Cargar especies
    useEffect(() => {
        getEspecie()
    }, [])

    const getEspecie = async () => {
        try {
            const res = await apiAxios.get('/api/Especie')
            setEspecies(res.data)
        } catch (error) {
            console.log("No se pudo cargar Especies")
        }
    }

    // 🔹 Cargar datos si es edición
    useEffect(() => {
        if (rowToEdit) {
            setId_especie(rowToEdit.Id_especie || '')
            setLote_Produccion(rowToEdit.Lote || '')
            setTip_produccion(rowToEdit.Tip_produccion || '')
            setFec_produccion(rowToEdit.Fec_produccion || '')
            setEstado(rowToEdit.Estado || 'Activo')
            setTextFormButton('Actualizar')
        } else {
            setId_especie('')
            setLote_Produccion('')
            setTip_produccion('')
            setFec_produccion('')
            setEstado('Activo')
            setTextFormButton('Enviar')
        }
    }, [rowToEdit])

    // 🔹 CREAR
    const crearProduccion = async () => {
        return apiAxios.post('/api/Produccion', {
            Lote,
            Tip_produccion,
            Fec_produccion,
            Id_especie: Number(Id_especie),
            Estado
        })
    }

    // 🔹 ACTUALIZAR
    const actualizarProduccion = async () => {
        return apiAxios.put(`/api/Produccion/${rowToEdit.Id_produccion}`, {
            Lote,
            Tip_produccion,
            Fec_produccion,
            Id_especie: Number(Id_especie),
            Estado
        })
    }

    const gestionarForm = async (e) => {
        e.preventDefault()

        if (!Lote, !Tip_produccion || !Fec_produccion || !Id_especie) {
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

            {/* Lote Produccion */}
            <div className="mb-3">
                <label htmlFor="Lote" className="form-label">
                    Lote:
                </label>
                <input
                    type="text"
                    id="Lote"
                    className="form-control"
                    value={Lote}
                    onChange={(e) => setLote_Produccion(e.target.value)}
                />
            </div>


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

            {/* Fecha Produccion */}
            <div className="mb-3">
                <label htmlFor="Fec_produccion" className="form-label">
                    Fecha Produccion:
                </label>
                <input
                    type="date"
                    id="Fec_produccion"
                    className="form-control"
                    value={Fec_produccion}
                    onChange={(e) => setFec_produccion(e.target.value)}
                />
            </div>

            {/* Especie */}
            <div className="mb-3">
                <label>Especie:</label>
                <select
                    className="form-control"
                    value={Id_especie}
                    onChange={(e) => setId_especie(Number(e.target.value))}
                >
                    <option value="">Selecciona</option>
                    {Especies.map(e => (
                        <option key={e.Id_especie} value={e.Id_especie}>
                            {e.Nom_especie}
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

export default ProduccionForm