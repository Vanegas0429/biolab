import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const UsoEquipoForm = () => {

    //Definir una prop  para cada campo del formulario
    const [hora_inicio, setHoraInicio] = useState('')
    const [hora_fin, setHoraFin] = useState('')
    const [actividad_realizada, setActividadRealizada] = useState('')
    const [id_equipo, setId_Equipo] = useState('')

    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Uso_Equipo', { //Se envian todos los datos como un objeto JSON
                    hora_inicio: hora_inicio,
                    hora_fin: hora_fin,
                    actividad_realizada: actividad_realizada,
                    id_equipo: id_equipo,
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Jugador creado correctamente')

            } catch (error) {

                console.error("Error registrando Uso Equipo:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <from onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="hora_inicio" className="form-label">Hora Inicio:</label>
                    <input type="text" id="hora_inicio" className="form-control" value={hora_inicio} onChange={(e) => setHoraInicio(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="hora_fin" className="form-label">Hora Inicio:</label>
                    <input type="text" id="hora_fin" className="form-control" value={hora_fin} onChange={(e) => setHoraFin(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="actividad_realizada" className="form-label">Hora Inicio:</label>
                    <input type="text" id="actividad_realizada" className="form-control" value={actividad_realizada} onChange={(e) => setActividadRealizada(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="id_equipo" className="form-label">Hora Inicio:</label>
                    <select type="text" id="id_equipo" className="form-control" value={id_equipo} onChange={(e) => setId_Equipo(e.target.value)}>
                        <option value="">Selecciona uno</option>
                        <option value="1">Autoclave</option>
                        <option value="2">Microscopio óptico</option>
                        <option value="3">Centrifuga</option>
                    </select>
                </div> 
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </from>
        
        </>
    )
}

export default UsoEquipoForm