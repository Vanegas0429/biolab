import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ProduccionForm = ({ hideModal, refreshList, rowToEdit, isViewOnly }) => {

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

            refreshList && refreshList()
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
        <form onSubmit={gestionarForm} className="container-fluid">
            <div className="row g-3">
                {/* Lote Produccion */}
                <div className="col-md-6">
                    <label htmlFor="Lote" className="form-label fw-bold">
                        Lote:
                    </label>
                    <input
                        type="text"
                        id="Lote"
                        className="form-control rounded-pill shadow-sm"
                        value={Lote}
                        onChange={(e) => setLote_Produccion(e.target.value)}
                        readOnly={isViewOnly}
                        placeholder="Ingrese el lote"
                    />
                </div>

                {/* Tipo Producción */}
                <div className="col-md-6">
                    <label htmlFor="Tip_produccion" className="form-label fw-bold">
                        Tipo de Producción:
                    </label>
                    <select
                        id="Tip_produccion"
                        className="form-select rounded-pill shadow-sm"
                        value={Tip_produccion}
                        onChange={(e) => setTip_produccion(e.target.value)}
                        disabled={isViewOnly}
                    >
                        <option value="">Selecciona uno</option>
                        <option value="Practica">Practica</option>
                        <option value="Propia">Propia</option>
                        <option value="Externa">Externa</option>
                    </select>
                </div>

                {/* Fecha Produccion */}
                <div className="col-md-6">
                    <label htmlFor="Fec_produccion" className="form-label fw-bold">
                        Fecha Produccion:
                    </label>
                    <input
                        type="date"
                        id="Fec_produccion"
                        className="form-control rounded-pill shadow-sm"
                        value={Fec_produccion}
                        onChange={(e) => setFec_produccion(e.target.value)}
                        readOnly={isViewOnly}
                    />
                </div>

                {/* Especie */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Especie:</label>
                    <select
                        className="form-select rounded-pill shadow-sm"
                        value={Id_especie}
                        onChange={(e) => setId_especie(Number(e.target.value))}
                        disabled={isViewOnly}
                    >
                        <option value="">Selecciona una especie</option>
                        {Especies.map(e => (
                            <option key={e.Id_especie} value={e.Id_especie}>
                                {e.Nom_especie}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botón */}
                {!isViewOnly && (
                    <div className="col-12 text-center mt-4">
                        <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">
                            <i className="fa-solid fa-paper-plane me-2"></i>
                            {textFormButton}
                        </button>
                    </div>
                )}
            </div>
        </form>
    )
}

export default ProduccionForm