import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const EquiposForm = ({ hideModal, rowToEdit }) => {

    const Myswal = withReactContent(Swal);

    const [nombre, setNombre] = useState("");
    const [marca, setMarca] = useState("");
    const [grupo, setGrupo] = useState("");
    const [linea, setLinea] = useState("");
    const [centro_costos, setCentroCostos] = useState("");
    const [subcentro_costos, setSubcentroCostos] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [imagen, setImagen] = useState(null);

    const [textFormButton, setTextFormButton] = useState("Enviar");

    // Detectar cuando es edición
    useEffect(() => {
        if (rowToEdit?.id_equipo) {
            loadDataInForm();
        } else {
            resetForm();
        }
    }, [rowToEdit]);

    const loadDataInForm = () => {
        setNombre(rowToEdit.nombre || "");
        setMarca(rowToEdit.marca || "");
        setGrupo(rowToEdit.grupo || "");
        setLinea(rowToEdit.linea || "");
        setCentroCostos(rowToEdit.centro_costos || "");
        setSubcentroCostos(rowToEdit.subcentro_costos || "");
        setObservaciones(rowToEdit.observaciones || "");

        setTextFormButton("Actualizar");
    };

    const resetForm = () => {
        setNombre("");
        setMarca("");
        setGrupo("");
        setLinea("");
        setCentroCostos("");
        setSubcentroCostos("");
        setObservaciones("");
        setImagen(null);

        setTextFormButton("Enviar");
    };

    const gestionarForm = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("marca", marca);
        formData.append("grupo", grupo);
        formData.append("linea", linea);
        formData.append("centro_costos", centro_costos);
        formData.append("subcentro_costos", subcentro_costos);
        formData.append("observaciones", observaciones);

        if (imagen) {
            formData.append("img_equipo", imagen);
        }

        try {

            // 🔵 SI EXISTE ID → ACTUALIZAR
            if (rowToEdit?.id_equipo) {

                await apiAxios.put(
                    "/api/Equipo/" + rowToEdit.id_equipo,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                Myswal.fire({
                    title: "Actualización",
                    text: "Equipo actualizado correctamente",
                    icon: "success",
                });

            } 
            // 🟢 SI NO EXISTE → CREAR
            else {

                await apiAxios.post(
                    "/api/Equipo",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                Myswal.fire({
                    title: "Registro",
                    text: "Equipo creado correctamente",
                    icon: "success",
                });
            }

            hideModal();

        } catch (error) {
            console.error("Error guardando equipo:", error.response?.data || error.message);

            Myswal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar",
                icon: "error"
            });
        }
    };

    return (
        <form onSubmit={gestionarForm} encType="multipart/form-data">

            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Marca</label>
                <input
                    type="text"
                    className="form-control"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Grupo</label>
                <input
                    type="text"
                    className="form-control"
                    value={grupo}
                    onChange={(e) => setGrupo(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Línea</label>
                <input
                    type="text"
                    className="form-control"
                    value={linea}
                    onChange={(e) => setLinea(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Centro de costos</label>
                <input
                    type="text"
                    className="form-control"
                    value={centro_costos}
                    onChange={(e) => setCentroCostos(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Subcentro de costos</label>
                <input
                    type="text"
                    className="form-control"
                    value={subcentro_costos}
                    onChange={(e) => setSubcentroCostos(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Observaciones</label>
                <input
                    type="text"
                    className="form-control"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Imagen del equipo</label>
                <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files[0])}
                />
            </div>

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

            <div className="mb-3 text-center">
                <button type="submit" className="btn btn-primary w-50">
                    {textFormButton}
                </button>
            </div>

        </form>
    );
};

export default EquiposForm;