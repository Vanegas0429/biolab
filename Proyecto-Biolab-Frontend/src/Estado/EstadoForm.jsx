import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const EstadoForm = () => {

    //Definir una prop  para cada campo del formulario
    const [Tip_Estado, setTip_Estado] = useState('')
    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Estado', { //Se envian todos los datos como un objeto JSON
                    Tip_Estado: Tip_Estado,
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Estado creado correctamente')

            } catch (error) {

                console.error("Error registrando Estado:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="Tip_Estado" className="form-label">Estado:</label>
                    <input type="text" id="Tip_Estado" className="form-control" value={Tip_Estado} onChange={(e) => setTip_Estado(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default EstadoForm