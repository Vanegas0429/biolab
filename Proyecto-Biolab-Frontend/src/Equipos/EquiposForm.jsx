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
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("nombre", nombre);
            formData.append("marca", marca);
            formData.append("grupo", grupo);
            formData.append("linea", linea);
            formData.append("centro_costos", centro_costos);
            formData.append("subcentro_costos", subcentro_costos);
            formData.append("observaciones", observaciones);

            if (imagen) formData.append("equipo_img", imagen);

           await apiAxios.post("/api/Equipo", formData);

            alert("Equipo creado correctamente");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message);
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
