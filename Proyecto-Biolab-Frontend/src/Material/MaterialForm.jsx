import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const MaterialForm = ({ hideModal, refreshList, rowToEdit }) => {
    const [Estado, setEstado] = useState("Activo");



    //Campos del formulario
    const [Nom_Material, setNom_Material] = useState("");
    const [Can_Material, setCan_Material] = useState("");
    const [imagenes, setImagenes] = useState([]);
    const [textFormButton, setTextFormButton] = useState("Enviar");

    useEffect(() => {
        if (rowToEdit) {
            setNom_Material(rowToEdit.Nom_Material || "");
            setCan_Material(rowToEdit.Can_Material || "");
            setEstado(rowToEdit.Estado || "Activo");
            setTextFormButton("Actualizar");
        } else {
            setEstado("Activo");
            setNom_Material("");
            setCan_Material("");
            setTextFormButton("Enviar");
        }
        setImagenes([]);
    }, [rowToEdit]);

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Nom_Material || Can_Material === "") {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios",
                icon: "error"
            });
            return;
        }

        const formData = new FormData();
        formData.append("Nom_Material", Nom_Material);
        formData.append("Can_Material", Can_Material);
        formData.append("Estado", Estado);
        
        if (imagenes.length > 0) {
            Array.from(imagenes).forEach(file => {
                formData.append("img_material", file);
            });
        }

        try {
            if (rowToEdit) {
                await apiAxios.put(`/api/Material/${rowToEdit.Id_Material}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                MySwal.fire({
                    title: "Actualizado",
                    text: "Material actualizado correctamente",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await apiAxios.post("/api/Material", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                MySwal.fire({
                    title: "Creación",
                    text: "Material creado correctamente",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            refreshList();
            hideModal();
        } catch (error) {
            console.error("Error al guardar Material:", error);
            MySwal.fire({
                title: "Error",
                text: "Error al guardar el Material",
                icon: "error"
            });
        }
    };

    return (
        <form onSubmit={gestionarForm} className="row g-3">
            <div className="col-md-8">
                <label htmlFor="Nom_Material" className="form-label fw-bold">
                    Nombre del Material:
                </label>
                <input
                    type="text"
                    id="Nom_Material"
                    className="form-control rounded-pill px-3 shadow-sm"
                    value={Nom_Material}
                    onChange={(e) => setNom_Material(e.target.value)}
                    placeholder="Ej: Probeta de vidrio"
                />
            </div>

            <div className="col-md-4">
                <label htmlFor="Can_Material" className="form-label fw-bold">
                    Cantidad Disponible:
                </label>
                <input
                    type="number"
                    id="Can_Material"
                    className="form-control rounded-pill px-3 shadow-sm"
                    value={Can_Material}
                    onChange={(e) => setCan_Material(e.target.value)}
                    placeholder="0"
                    min="0"
                />
            </div>

            <div className="col-md-12">
                <label className="form-label fw-bold">Subir Imágenes:</label>
                <div className="input-group">
                    <input
                        type="file"
                        className="form-control rounded-pill px-3 shadow-sm"
                        multiple
                        accept="image/*"
                        onChange={(e) => setImagenes(e.target.files)}
                    />
                </div>
                <small className="text-muted d-block mt-1 ps-2">Puedes seleccionar varias imágenes a la vez.</small>
            </div>

            <div className="col-12 mt-4 text-center">
                <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">
                    <i className={`fa-solid ${rowToEdit ? 'fa-rotate' : 'fa-paper-plane'} me-2`}></i>
                    {textFormButton}
                </button>
            </div>
        </form>
    );
};

export default MaterialForm;
