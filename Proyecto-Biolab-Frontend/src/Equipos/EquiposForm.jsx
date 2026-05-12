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

        setTextFormButton("Actualizar");
    };

    const resetForm = () => {
        setNombre("");
        setMarca("");
        setGrupo("");
        setLinea("");
        setCentroCostos("");
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
        <form onSubmit={gestionarForm} encType="multipart/form-data" className="container-fluid">
            <div className="row g-3">
                {/* Nombre */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Nombre del Equipo:</label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Microscopio Binocular"
                        required
                    />
                </div>

                {/* Marca */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Marca:</label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                        placeholder="Ej: Nikon"
                    />
                </div>

                {/* Grupo */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Grupo:</label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={grupo}
                        onChange={(e) => setGrupo(e.target.value)}
                        placeholder="Ingrese el grupo"
                    />
                </div>

                {/* Línea */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Línea:</label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={linea}
                        onChange={(e) => setLinea(e.target.value)}
                        placeholder="Ingrese la línea"
                    />
                </div>

                {/* Centro de costos */}
                <div className="col-md-12">
                    <label className="form-label fw-bold">Centro de Costos:</label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={centro_costos}
                        onChange={(e) => setCentroCostos(e.target.value)}
                        placeholder="Ej: Lab-01-SEC"
                    />
                </div>

                {/* Campo de imágenes múltiples */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">
                        <i className="fa-solid fa-images me-2 text-primary"></i>
                        Imágenes del equipo
                    </label>
                    <input
                        type="file"
                        className="form-control rounded-pill shadow-sm px-3"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                    />
                    <small className="text-muted d-block mt-1 ms-2">Puedes seleccionar varias imágenes.</small>
                </div>

                {/* Campo de ficha técnica PDF */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">
                        <i className="fa-solid fa-file-pdf me-2 text-danger"></i>
                        Ficha Técnica (PDF)
                    </label>
                    <input
                        type="file"
                        className="form-control rounded-pill shadow-sm px-3"
                        accept=".pdf"
                        onChange={(e) => setFichaTecnica(e.target.files[0])}
                    />
                    {fichaTecnica && (
                        <small className="text-success mt-1 d-block ms-2">
                            <i className="fa-solid fa-check-circle me-1"></i>
                            {fichaTecnica.name}
                        </small>
                    )}
                </div>

                {/* Vista previa de imágenes seleccionadas */}
                {imagenes.length > 0 && (
                    <div className="col-12 mt-2">
                        <div className="d-flex flex-wrap gap-2 justify-content-center bg-light p-3 rounded-3 border border-dashed">
                            {imagenes.map((file, i) => (
                                <div key={i} className="position-relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${i + 1}`}
                                        className="rounded shadow-sm border"
                                        style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle rounded-circle p-0 d-flex align-items-center justify-content-center shadow"
                                        style={{ width: '20px', height: '20px' }}
                                        onClick={() => removeImage(i)}
                                    >
                                        <i className="fa-solid fa-xmark" style={{ fontSize: '10px' }}></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="col-12 text-center mt-4">
                    <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">
                        <i className={`fa-solid ${rowToEdit?.id_equipo ? 'fa-rotate' : 'fa-paper-plane'} me-2`}></i>
                        {textFormButton}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EquiposForm;