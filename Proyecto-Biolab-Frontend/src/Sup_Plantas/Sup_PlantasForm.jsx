import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const Sup_PlantasForm = () => {

    //Definir una prop  para cada campo del formulario
    const [fecha_supervision, setFec_Supervision] = useState('')
    const [estado_planta, setEst_Planta] = useState('')
    const [id_funcionario, setId_Funcionario] = useState('')
    const [id_planta, setId_Planta] = useState('')

    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Sup_Planta', { //Se envian todos los datos como un objeto JSON
                    fecha_supervision: fecha_supervision,
                    estado_planta: estado_planta,
                    id_funcionario: id_funcionario,
                    id_planta: id_planta,
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Supervison de Planta creado correctamente')

            } catch (error) {

                console.error("Error registrando Supervison de Planta:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="fecha_supervision" className="form-label">Fecha de Supervision:</label>
                    <input type="text" id="fecha_supervision" className="form-control" value={fecha_supervision} onChange={(e) => setFec_Supervision(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="estado_planta" className="form-label">Estado de la Planta:</label>
                    <select type="text" id="estado_planta" className="form-control" value={estado_planta} onChange={(e) => setEst_Planta(e.target.value)}>
                        <option value="">Selecciona uno</option>
                        <option value="1">Blandito</option>
                        <option value="2">Aguado</option>
                        <option value="3">Duro</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="id_funcionario" className="form-label">Funcionario:</label>
                    <input type="text" id="id_funcionario" className="form-control" value={id_funcionario} onChange={(e) => setId_Funcionario(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="id_planta" className="form-label">Planta:</label>
                    <input type="text" id="id_planta" className="form-control" value={id_planta} onChange={(e) => setId_Planta(e.target.value)} />
                </div> 
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default Sup_PlantasForm