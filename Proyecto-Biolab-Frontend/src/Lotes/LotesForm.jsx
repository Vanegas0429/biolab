import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const EquiposForm = () => {

    //Definir una prop  para cada campo del formulario
    const [Id_planta, setId_Planta] = useState('')

    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Equipo', { //Se envian todos los datos como un objeto JSON
                    Id_planta: Id_planta,
                    marca: marca,
                    grupo: grupo,
                    Linea: Linea,
                    centro_costos: centro_costos,
                    subcentro_costos: subcentro_costos
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Lote creado correctamente')

            } catch (error) {

                console.error("Error registrando Lote:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="Id_planta" className="form-label">Planta:</label>
                    <select type="text" id="id_equipo" className="form-control" value={id_equipo} onChange={(e) => setId_Equipo(e.target.value)}>
                        <option value="">Selecciona uno</option>
                    </select>
                </div>
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default EquiposForm