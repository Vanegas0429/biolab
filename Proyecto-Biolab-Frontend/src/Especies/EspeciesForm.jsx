import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const EspeciesForm = () => {

    const [Nom_especie, setNom_especie] = useState('')
    const [textFormButton, setFormButton] = useState('Enviar')

    const gestionarForm = async (e) => {
        e.preventDefault()

        if (textFormButton === 'Enviar') {
            try {
                // Envía solo Nom_especie, sin Id_produccion
                const response = await apiAxios.post('/api/Especie', {
                    Nom_especie
                })

                alert('Producción creada correctamente')

                // Opcional: limpiar selección
                setNom_especie('')

            } catch (error) {
                console.error("Error al crear la producción:", error.response ? error.response.data : error.message);
                alert(error.message)
            }
        }
    }

    return (
        <form onSubmit={gestionarForm} className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="Nom_especie" className="form-label">Nombre de la Especie:</label>
                    <input type="text" id="Nom_especie" className="form-control" value={Nom_especie} onChange={(e) => setNom_especie(e.target.value)} />
                </div>
            <div className="mb-3">
                <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
            </div>
        </form>
    )
}

export default EspeciesForm