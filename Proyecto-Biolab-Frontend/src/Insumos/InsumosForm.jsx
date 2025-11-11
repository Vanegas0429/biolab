import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const InsumosForm = () => {

    //Definir una prop  para cada campo del formulario
    const [Nombre, setNombre] = useState('')
    const [Tip_Insumo, setTip_Insumo] = useState('')
    const [Fec_Vencimiento, setFec_Vencimiento] = useState('')


    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Insumo', { //Se envian todos los datos como un objeto JSON
                    Nombre: Nombre,
                    Tip_Insumo: Tip_Insumo,
                    Fec_Vencimiento: Fec_Vencimiento,
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Insumo creado correctamente')

            } catch (error) {

                console.error("Error registrando Insumo:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="Nombre" className="form-label">Nombre:</label>
                    <input type="text" id="Nombre" className="form-control" value={Nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Tip_Insumo" className="form-label">Tipo de Insumo:</label>
                    <input type="text" id="Tip_Insumo" className="form-control" value={Tip_Insumo} onChange={(e) => setTip_Insumo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Fec_Vencimiento" className="form-label">Fecha de Vencimiento:</label>
                    <input type="date" id="Fec_Vencimiento" className="form-control" value={Fec_Vencimiento} onChange={(e) => setFec_Vencimiento(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default InsumosForm