import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const EspeciesForm = ({ hideModal, refreshList, rowToEdit }) => {
    const [Estado, setEstado] = useState("Activo");



    //Campos del formulario
    const [Nom_especie, setNom_especie] = useState("");
    const [imagenes, setImagenes] = useState([]);
    const [textFormButton, setTextFormButton] = useState("Enviar");

    useEffect(() => {
        if (rowToEdit) {
            setNom_especie(rowToEdit.Nom_especie || "");
            setEstado(rowToEdit.Estado || "Activo");
            setTextFormButton("Actualizar");
        } else {
            setEstado("Activo");
            setNom_especie("");
            setTextFormButton("Enviar");
        }
        setImagenes([]);
    }, [rowToEdit]);

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Nom_especie) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios",
                icon: "error"
            });
            return;
        }

        const formData = new FormData();
        formData.append("Nom_especie", Nom_especie);
        formData.append("Estado", Estado);
        
        if (imagenes.length > 0) {
            Array.from(imagenes).forEach(file => {
                formData.append("img_especie", file);
            });
        }

        try {
            if (rowToEdit) {
                await apiAxios.put(`/api/Especie/${rowToEdit.Id_especie}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                MySwal.fire({
                    title: "Actualizado",
                    text: "Especie actualizada correctamente",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await apiAxios.post("/api/Especie", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                MySwal.fire({
                    title: "Creación",
                    text: "Especie creada correctamente",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            refreshList();
            hideModal();
        } catch (error) {
            console.error("Error al guardar especie:", error);
            MySwal.fire({
                title: "Error",
                text: "Error al guardar la especie",
                icon: "error"
            });
        }
    };

    return (
        <form onSubmit={gestionarForm} className="row g-3">
            <div className="col-md-12">
                <label htmlFor="Nom_especie" className="form-label fw-bold">
                    Nombre de la Especie:
                </label>
                <input
                    type="text"
                    id="Nom_especie"
                    className="form-control rounded-pill px-3 shadow-sm"
                    value={Nom_especie}
                    onChange={(e) => setNom_especie(e.target.value)}
                    placeholder="Ej: Solanum lycopersicum"
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

export default EspeciesForm;
