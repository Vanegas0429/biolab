import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const EquiposForm = ({ hideModal, rowToEdit, refreshList }) => {

    const Myswal = withReactContent(Swal);

    const [nombre, setNombre] = useState("");
    const [marca, setMarca] = useState("");
    const [grupo, setGrupo] = useState("");
    const [linea, setLinea] = useState("");
    const [centro_costos, setCentroCostos] = useState("");
    const [subcentro_costos, setSubcentroCostos] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [imagenes, setImagenes] = useState([]);        // Archivos nuevos seleccionados
    const [fichaTecnica, setFichaTecnica] = useState(null); // PDF seleccionado

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
        setImagenes([]);
        setFichaTecnica(null);

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

        // Agregar múltiples imágenes
        if (imagenes.length > 0) {
            for (let i = 0; i < imagenes.length; i++) {
                formData.append("img_equipo", imagenes[i]);
            }
        }

        // Agregar ficha técnica PDF
        if (fichaTecnica) {
            formData.append("ficha_tecnica", fichaTecnica);
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

            if (refreshList) refreshList();
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

    // Manejar selección de múltiples imágenes
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImagenes((prev) => [...prev, ...files]);
    };

    // Eliminar una imagen seleccionada antes de enviar
    const removeImage = (index) => {
        setImagenes((prev) => prev.filter((_, i) => i !== index));
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

            {/* Campo de imágenes múltiples */}
            <div className="mb-3">
                <label className="form-label">
                    <i className="fa-solid fa-images me-2 text-primary"></i>
                    Imágenes del equipo
                </label>
                <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                />
                <small className="text-muted">Puedes seleccionar varias imágenes a la vez</small>
            </div>

            {/* Vista previa de imágenes seleccionadas */}
            {imagenes.length > 0 && (
                <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {imagenes.map((file, i) => (
                            <div key={i} className="image-preview-container">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${i + 1}`}
                                    className="img-thumbnail"
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                />
                                <div 
                                    className="image-preview-remove" 
                                    onClick={() => removeImage(i)}
                                    title="Quitar imagen"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Campo de ficha técnica PDF */}
            <div className="mb-3">
                <label className="form-label">
                    <i className="fa-solid fa-file-pdf me-2 text-danger"></i>
                    Ficha Técnica (PDF)
                </label>
                <input
                    type="file"
                    className="form-control"
                    accept=".pdf"
                    onChange={(e) => setFichaTecnica(e.target.files[0])}
                />
                {fichaTecnica && (
                    <small className="text-success mt-1 d-block">
                        <i className="fa-solid fa-check-circle me-1"></i>
                        {fichaTecnica.name}
                    </small>
                )}
                {!fichaTecnica && rowToEdit?.ficha_tecnica && (
                    <small className="text-muted mt-1 d-block">
                        <i className="fa-solid fa-file-pdf me-1"></i>
                        Ya tiene ficha técnica cargada
                    </small>
                )}
            </div>

            <div className="mb-3 text-center">
                <button type="submit" className="btn btn-primary w-50">
                    {textFormButton}
                </button>
            </div>

        </form>
    );
};

export default EquiposForm;