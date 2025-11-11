import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const Sup_PlantasForm = () => {

    //Definir una prop  para cada campo del formulario
    const [estado_planta, setEstado_planta] = useState('')
    const [id_funcionario, setId_Funcionario] = useState('')

    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Sup_Planta', { //Se envian todos los datos como un objeto JSON
                    estado_planta: estado_planta,
                    id_funcionario: id_funcionario,
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Sup_planta creada correctamente')

            } catch (error) {

                console.error("Error registrando Sup_planta:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="estado_planta" className="form-label">Hora Inicio:</label>
                    <input type="text" id="estado_planta" className="form-control" value={estado_planta} onChange={(e) => setEstado_planta(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="id_funcionario" className="form-label">Equipo:</label>
                    <select type="text" id="id_funcionario" className="form-control" value={id_funcionario} onChange={(e) => setId_Funcionario(e.target.value)}>
                        <option value="">Selecciona uno</option>
                        <option value="1">Autoclave</option>
                        <option value="2">Microscopio óptico</option>
                        <option value="3">Centrifuga</option>
                    </select>
                </div> 
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default Sup_PlantasForm