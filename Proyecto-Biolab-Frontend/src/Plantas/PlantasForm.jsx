import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const PlantasForm = () => {

    //Definir una prop  para cada campo del formulario
    const [especie, setEspecie] = useState('')
    const [met_cultivo, setMet_Cultivo] = useState('')
    const [met_propagacion, setMet_Propagacion] = useState('')
    const [plan_contaminadas, setPlan_Contaminada] = useState('')
    const [plan_desarrolladas, setPlan_Desarrollada] = useState('')
    const [numero_endurecimiento, setNumero_Endurecimiento] = useState('')

    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Equipo', { //Se envian todos los datos como un objeto JSON
                    especie: especie,
                    met_cultivo: met_cultivo,
                    met_propagacion: met_propagacion,
                    plan_contaminadas: plan_contaminadas,
                    plan_desarrolladas: plan_desarrolladas,
                    numero_endurecimiento: numero_endurecimiento
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Planta creada correctamente')

            } catch (error) {

                console.error("Error registrando Planta:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="especie" className="form-label">Especie:</label>
                    <input type="text" id="especie" className="form-control" value={especie} onChange={(e) => setEspecie(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="met_cultivo" className="form-label">Metodo de Cultivo:</label>
                    <input type="text" id="met_cultivo" className="form-control" value={met_cultivo} onChange={(e) => setMet_Cultivo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="met_propagacion" className="form-label">Metodo de Propagacion:</label>
                    <input type="text" id="met_propagacion" className="form-control" value={met_propagacion} onChange={(e) => setMet_Propagacion(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="plan_contaminadas" className="form-label">Planta Contaminada:</label>
                    <select type="text" id="plan_desarrolladas" className="form-control" value={plan_desarrolladas} onChange={(e) => setPlan_Desarrollada(e.target.value)}>
                        <option value="">Selecciona uno</option>
                        <option value="1">Hongos</option>
                        <option value="2">Bacterias</option>
                        <option value="3">No Contaminada</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="plan_desarrolladas" className="form-label">Planta Desarrollada:</label>
                    <select type="text" id="plan_desarrolladas" className="form-control" value={plan_desarrolladas} onChange={(e) => setPlan_Desarrollada(e.target.value)}>
                        <option value="">Selecciona uno</option>
                        <option value="1">Desarrolada</option>
                        <option value="2">No Desarrollada </option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="numero_endurecimiento" className="form-label">Numero de Endurecimiento:</label>
                    <input type="text" id="numero_endurecimiento" className="form-control" value={numero_endurecimiento} onChange={(e) => setNumero_Endurecimiento(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default PlantasForm