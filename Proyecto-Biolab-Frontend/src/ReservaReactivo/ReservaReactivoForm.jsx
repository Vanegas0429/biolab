import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const ReservaReactivoForm = () => {

    //Definir una prop  para cada campo del formulario
    const [Id_Reserva, setReserva] = useState('')
    const [Id_Reactivo, setReactivo] = useState('')
    const [Can_Reactivo, setCanReactivo] = useState('')
    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/ReservaReactivo', { //Se envian todos los datos como un objeto JSON
                    Id_Reserva: Id_Reserva,
                    Id_Reactivo: Id_Reactivo,
                    Can_Reactivo: Can_Reactivo,
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('ReservaReactivo creado correctamente')

            } catch (error) {

                console.error("Error registrando ReservaReactivo:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="Reserva" className="form-label">Reserva:</label>
                    <input type="text" id="Reserva" className="form-control" value={Id_Reserva} onChange={(e) => setReserva(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Reactivo" className="form-label">Reactivo:</label>
                    <input type="text" id="Reactivo" className="form-control" value={Id_Reactivo} onChange={(e) => setReactivo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Can_Reactivo" className="form-label">Cantidad Del Reactivo:</label>
                    <input type="text" id="Can_Reactivo" className="form-control" value={Can_Reactivo} onChange={(e) => setCanReactivo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default ReservaReactivoForm