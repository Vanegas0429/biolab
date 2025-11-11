import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const EquiposForm = () => {

    //Definir una prop  para cada campo del formulario
    const [nombre, setNombre] = useState('')
    const [marca, setMarca] = useState('')
    const [grupo, setGrupo] = useState('')
    const [linea, setLinea] = useState('')
    const [centro_costos, setCentroCostos] = useState('')
    const [subcentro_costos, setSubcentroCostos] = useState('')
    const [observaciones, setObservaciones] = useState('')

    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Equipo', { //Se envian todos los datos como un objeto JSON
                    nombre: nombre,
                    marca: marca,
                    grupo: grupo,
                    linea: linea,
                    centro_costos: centro_costos,
                    subcentro_costos: subcentro_costos,
                    observaciones: observaciones,
                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Equipo creado correctamente')

            } catch (error) {

                console.error("Error registrando Equipo:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">nombre:</label>
                    <input type="text" id="nombre" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="marca" className="form-label">marca:</label>
                    <input type="text" id="marca" className="form-control" value={marca} onChange={(e) => setMarca(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="grupo" className="form-label">grupo:</label>
                    <input type="text" id="grupo" className="form-control" value={grupo} onChange={(e) => setGrupo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="linea" className="form-label">linea:</label>
                    <input type="text" id="linea" className="form-control" value={linea} onChange={(e) => setLinea(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="centro_costos" className="form-label">centro_costos:</label>
                    <input type="text" id="centro_costos" className="form-control" value={centro_costos} onChange={(e) => setCentroCostos(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="subcentro_costos" className="form-label">subcentro_costos:</label>
                    <input type="text" id="subcentro_costos" className="form-control" value={subcentro_costos} onChange={(e) => setSubcentroCostos(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="observaciones" className="form-label">observaciones:</label>
                    <input type="text" id="observaciones" className="form-control" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   

            </form>
        
        </>
    )
}

export default EquiposForm