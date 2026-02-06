import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const ReservaEquipoForm = () => {

    //Definir una prop  para cada campo del formulario
    const [Id_Reserva, setReserva] = useState('')
    const [Id_Equipo, setEquipo] = useState('')
    const [Can_Equipos, setCanEquipo] = useState('')
    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/ReservaEquipo', { //Se envian todos los datos como un objeto JSON
                    Id_Reserva: Id_Reserva,
                    Id_Equipo: Id_Equipo,
                    Can_Equipos: Can_Equipos,
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('ReservaEquipo creado correctamente')

            } catch (error) {

                console.error("Error registrando ReservaEquipo:", error.response ? error.response.data : error.message);
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
                    <label htmlFor="Equipo" className="form-label">Equipo:</label>
                    <input type="text" id="Equipo" className="form-control" value={Id_Equipo} onChange={(e) => setEquipo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Can_Equipos" className="form-label">Cantidad Del Equipo:</label>
                    <input type="text" id="Can_Equipos" className="form-control" value={Can_Equipos} onChange={(e) => setCanEquipo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default ReservaEquipoForm