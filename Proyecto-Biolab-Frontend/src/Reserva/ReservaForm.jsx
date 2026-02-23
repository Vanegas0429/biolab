import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const FuncionariosForm = () => {

    //Definir una prop  para cada campo del formulario
    const [Tip_Reserva, setTip_Reserva] = useState('')
    const [Nom_Solicitante, setNom_Solicitante] = useState('')
    const [Doc_Solicitante, setDoc_Solicitante] = useState('')
    const [Cor_Solicitante, setCor_Solicitante] = useState('')
    const [Can_Aprendices, setCan_Aprendices] = useState('')
    const [Fec_Reserva, setFec_Reserva] = useState('')
    const [Hor_Reserva, setHor_Reserva] = useState('')
    const [Num_Ficha, setNum_Ficha] = useState('')
    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Funcionarios', { //Se envian todos los datos como un objeto JSON
                    Tip_Reserva: Tip_Reserva,
                    Nom_Solicitante: Nom_Solicitante,
                    Doc_Solicitante: Doc_Solicitante,
                    Cor_Solicitante: Cor_Solicitante,
                    Can_Aprendices: Can_Aprendices,
                    Fec_Reserva: Fec_Reserva,
                    Hor_Reserva: Hor_Reserva,
                    Num_Ficha: Num_Ficha,
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Funcionario creado correctamente')

            } catch (error) {

                console.error("Error registrando Funcionario:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="Tip_Reserva" className="form-label">Tip_Reserva:</label>
                    <select type="text" id="Cargo_Funcionario" className="form-control" value={Cargo_Funcionario} onChange={(e) => setTip_Reserva(e.target.value)}>
                        <option value="">Selecciona uno</option>
                        <option value="1">Practica</option>
                        <option value="2">Visita</option>
                    </select>                </div>
                <div className="mb-3">
                    <label htmlFor="Nom_Solicitante" className="form-label">Nom_Solicitante:</label>
                    <input type="text" id="Nom_Solicitante" className="form-control" value={Nom_Solicitante} onChange={(e) => setNom_Solicitante(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Doc_Solicitante" className="form-label">Doc_Solicitante:</label>
                    <input type="text" id="Doc_Solicitante" className="form-control" value={Doc_Solicitante} onChange={(e) => setDoc_Solicitante(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Cor_Solicitante" className="form-label">Cor_Solicitante:</label>
                    <input type="text" id="Cor_Solicitante" className="form-control" value={Cor_Solicitante} onChange={(e) => setCor_Solicitante(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Can_Aprendices" className="form-label">Cargo funcionario:</label>
                    <select type="text" id="Can_Aprendices" className="form-control" value={Can_Aprendices} onChange={(e) => setCan_Aprendices(e.target.value)}>
                        <option value="">Selecciona uno</option>
                        <option value="1">Subdirector</option>
                        <option value="2">Coordinador</option>
                        <option value="3">Instructor</option>
                    </select>
                </div> 
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default FuncionariosForm
