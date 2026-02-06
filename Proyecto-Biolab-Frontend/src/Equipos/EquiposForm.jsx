import { useState } from "react";
import apiAxios from "../api/axiosConfig.js";

const EquiposForm = () => {
    // Campos del formulario
    const [nombre, setNombre] = useState("");
    const [marca, setMarca] = useState("");
    const [grupo, setGrupo] = useState("");
    const [linea, setLinea] = useState("");
    const [centro_costos, setCentroCostos] = useState("");
    const [subcentro_costos, setSubcentroCostos] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [imagen, setImagen] = useState(null);

    const [textFormButton, setFormButton] = useState("Enviar");

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
    };


    return (
        <div className="container mt-4">
            <h2>Formulario de Equipos</h2>
            <form onSubmit={gestionarForm} encType="multipart/form-data">
                {/* Nombre */}
                <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                {/* Marca */}
                <div className="mb-3">
                    <label className="form-label">Marca:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                    />
                </div>

                {/* Grupo */}
                <div className="mb-3">
                    <label className="form-label">Grupo:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={grupo}
                        onChange={(e) => setGrupo(e.target.value)}
                    />
                </div>

                {/* Línea */}
                <div className="mb-3">
                    <label className="form-label">Línea:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={linea}
                        onChange={(e) => setLinea(e.target.value)}
                    />
                </div>

                {/* Centro de costos */}
                <div className="mb-3">
                    <label className="form-label">Centro de costos:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={centro_costos}
                        onChange={(e) => setCentroCostos(e.target.value)}
                    />
                </div>

                {/* Subcentro de costos */}
                <div className="mb-3">
                    <label className="form-label">Subcentro de costos:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={subcentro_costos}
                        onChange={(e) => setSubcentroCostos(e.target.value)}
                    />
                </div>

                {/* Observaciones */}
                <div className="mb-3">
                    <label className="form-label">Observaciones:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                    />
                </div>

                {/* Imagen */}
                <div className="mb-3">
                    <label className="form-label">Imagen del equipo:</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImagen(e.target.files[0])}
                    />
                </div>

                {/* Vista previa de imagen */}
                {imagen && (
                    <div className="mb-3 text-center">
                        <img
                            src={URL.createObjectURL(imagen)}
                            alt="Vista previa"
                            className="img-thumbnail"
                            width="200"
                        />
                    </div>
                )}

                {/* Botón enviar */}
                <div className="mb-3">
                    <button type="submit" className="btn btn-primary w-50">
                        {textFormButton}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EquiposForm;
