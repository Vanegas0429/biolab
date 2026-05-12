import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const FuncionariosForm = () => {

    //Definir una prop  para cada campo del formulario
    const [Nombre, setNombre] = useState('')
    const [Apellido, setApellido] = useState('')
    const [Telefono, setTelefono] = useState('')
    const [Correo, setCorreo] = useState('')
    const [Cargo_Funcionario, setCargoFuncionario] = useState('')

    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Funcionario', { //Se envian todos los datos como un objeto JSON
                    Nombre: Nombre,
                    Apellido: Apellido,
                    Telefono: Telefono,
                    Correo: Correo,
                    Cargo_Funcionario: Cargo_Funcionario,
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
        <form onSubmit={gestionarForm} className="container-fluid">
            <div className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="Nombre" className="form-label fw-bold">Nombre:</label>
                    <input type="text" id="Nombre" className="form-control rounded-pill shadow-sm px-3" value={Nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Juan" />
                </div>
                <div className="col-md-6">
                    <label htmlFor="Apellido" className="form-label fw-bold">Apellido:</label>
                    <input type="text" id="Apellido" className="form-control rounded-pill shadow-sm px-3" value={Apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Ej: Pérez" />
                </div>
                <div className="col-md-6">
                    <label htmlFor="Telefono" className="form-label fw-bold">Teléfono:</label>
                    <input type="text" id="Telefono" className="form-control rounded-pill shadow-sm px-3" value={Telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej: 3001234567" />
                </div>
                <div className="col-md-6">
                    <label htmlFor="Correo" className="form-label fw-bold">Correo:</label>
                    <input type="text" id="Correo" className="form-control rounded-pill shadow-sm px-3" value={Correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Ej: juan.perez@sena.edu.co" />
                </div>
                <div className="col-md-12">
                    <label htmlFor="Cargo_Funcionario" className="form-label fw-bold">Cargo del Funcionario:</label>
                    <select id="Cargo_Funcionario" className="form-select rounded-pill shadow-sm px-3" value={Cargo_Funcionario} onChange={(e) => setCargoFuncionario(e.target.value)}>
                        <option value="">Selecciona uno...</option>
                        <option value="1">Subdirector</option>
                        <option value="2">Coordinador</option>
                        <option value="3">Instructor</option>
                    </select>
                </div> 
                <div className="col-12 text-center mt-4">
                    <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">
                        <i className={`fa-solid ${textFormButton === 'Actualizar' ? 'fa-rotate' : 'fa-paper-plane'} me-2`}></i>
                        {textFormButton}
                    </button>
                </div>   
            </div>
        </form>
    )
}

export default FuncionariosForm