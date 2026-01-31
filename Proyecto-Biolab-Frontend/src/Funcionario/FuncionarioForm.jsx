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
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="Nombre" className="form-label">Nombre:</label>
                    <input type="text" id="Nombre" className="form-control" value={Nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Apellido" className="form-label">Apellido:</label>
                    <input type="text" id="Apellido" className="form-control" value={Apellido} onChange={(e) => setApellido(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Telefono" className="form-label">Telefono:</label>
                    <input type="text" id="Telefono" className="form-control" value={Telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Correo" className="form-label">Correo:</label>
                    <input type="text" id="Correo" className="form-control" value={Correo} onChange={(e) => setCorreo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Cargo_Funcionario" className="form-label">Cargo funcionario:</label>
                    <select type="text" id="Cargo_Funcionario" className="form-control" value={Cargo_Funcionario} onChange={(e) => setCargoFuncionario(e.target.value)}>
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