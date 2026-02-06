import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const ProduccionForm = () => {

    const [Tip_produccion, setTip_produccion] = useState('')
    const [Cod_produccion, setCod_produccion] = useState('')
    const [textFormButton, setFormButton] = useState('Enviar')

    const gestionarForm = async (e) => {
        e.preventDefault()

        if (textFormButton === 'Enviar') {
            try {

                const response = await apiAxios.post('/api/Produccion', {
                    Tip_produccion,
                    Cod_produccion,
                })

                alert('Producción creada correctamente')

                setTip_produccion('')
                setCod_produccion('')

            } catch (error) {
                console.error("Error al crear la producción:", error.response ? error.response.data : error.message);
                alert(error.message)
            }
        }
    }

    return (
        <form onSubmit={gestionarForm} className="col-12 col-md-6">
            <div className="mb-3">
                <label htmlFor="Tip_produccion" className="form-label">Tipo de Producción: </label>
                <select
                    id="Tip_produccion"
                    className="form-control"
                    value={Tip_produccion}
                    onChange={(e) => setTip_produccion(e.target.value)}
                >
                    <option value="">Selecciona uno</option>
                    <option value="Practica">Practica </option>
                    <option value="Propia">Propia </option>
                    <option value="Externa">Externa </option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="Cod_produccion" className="form-label"> Codigo de produccion: </label>
                <input type="text" id="FCod_produccion" className="form-control" value={Cod_produccion} onChange={(e) => setCod_produccion(e.target.value)} />
            </div>
            <div className="mb-3">
                <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
            </div>
        </form>
    )
}

export default ProduccionForm
