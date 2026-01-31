import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const ReservaMaterialForm = () => {

    //Definir una prop  para cada campo del formulario
    const [Id_Reserva, setReserva] = useState('')
    const [Id_Material, setMaterial] = useState('')
    const [Can_Materiales, setCanMaterial] = useState('')
    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/ReservaMaterial', { //Se envian todos los datos como un objeto JSON
                    Id_Reserva: Id_Reserva,
                    Id_Material: Id_Material,
                    Can_Materiales: Can_Materiales,
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('ReservaMaterial creado correctamente')

            } catch (error) {

                console.error("Error registrando ReservaMaterial:", error.response ? error.response.data : error.message);
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
                    <label htmlFor="Material" className="form-label">Material:</label>
                    <input type="text" id="Material" className="form-control" value={Id_Material} onChange={(e) => setMaterial(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Can_Materiales" className="form-label">Cantidad Del Material:</label>
                    <input type="text" id="Can_Materiales" className="form-control" value={Can_Materiales} onChange={(e) => setCanMaterial(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default ReservaMaterialForm