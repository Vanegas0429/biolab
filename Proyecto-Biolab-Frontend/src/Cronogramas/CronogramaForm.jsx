import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const CronogramaForm = () => {

    //Definir una prop  para cada campo del formulario
    const [Id_Funcionario, setId_Funcionario] = useState('')
    const [Fec_Prestamo, setFec_Prestamo] = useState('')
    const [Hor_Prestamo, setHor_Prestamo] = useState('')
    const [Ficha, setFicha] = useState('')
    const [Cant_Aprendices, setCant_Aprendices] = useState('')
    const [Act_Realizada, setAct_Realizada] = useState('')
    const [id_equipo, setId_Equipo] = useState('')

    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Cronograma', { //Se envian todos los datos como un objeto JSON
                    Id_Funcionario: Id_Funcionario,
                    Fec_Prestamo: Fec_Prestamo,
                    Hor_Prestamo: Hor_Prestamo,
                    Ficha: Ficha,
                    Cant_Aprendices: Cant_Aprendices,
                    Act_Realizada: Act_Realizada,
                    equipo: id_equipo
                
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Prestamo creado correctamente')

            } catch (error) {

                console.error("Error registrando Prestamo:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="Id_Funcionario" className="form-label">Funcionario:</label>
                    <input type="text" id="Id_Funcionario" className="form-control" value={Id_Funcionario} onChange={(e) => setId_Funcionario(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Fec_Prestamo" className="form-label">Fecha de Prestamo:</label>
                    <input type="date" id="Fec_Prestamo" className="form-control" value={Fec_Prestamo} onChange={(e) => setFec_Prestamo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Hor_Prestamo" className="form-label">Hora de Prestamo:</label>
                    <input type="text" id="Hor_Prestamo" className="form-control" value={Hor_Prestamo} onChange={(e) => setHor_Prestamo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Ficha" className="form-label">Ficha:</label>
                    <input type="text" id="Ficha" className="form-control" value={Ficha} onChange={(e) => setFicha(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Cant_Aprendices" className="form-label">Cantidad de Aprendices:</label>
                    <input type="text" id="Cant_Aprendices" className="form-control" value={Cant_Aprendices} onChange={(e) => setCant_Aprendices(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Act_Realizada" className="form-label">Actividad Realizada:</label>
                    <input type="text" id="Act_Realizada" className="form-control" value={Act_Realizada} onChange={(e) => setAct_Realizada(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="id_equipo" className="form-label">Equipo:</label>
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

            </form>
        
        </>
    )
}

export default CronogramaForm