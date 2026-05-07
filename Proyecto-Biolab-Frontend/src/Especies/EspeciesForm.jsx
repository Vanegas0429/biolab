import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const EspeciesForm = ({ hideModal, rowToEdit }) => {
    const [Estado, setEstado] = useState("Activo");



    //Campos del formulario
    const [Nom_especie, setNom_especie] = useState("");
    const [img_especie, setImgEspecie] = useState(null);
    const [textFormButton, setTextFormButton] = useState("Enviar");

    useEffect(() => {
        if (rowToEdit) {
            setNom_especie(rowToEdit.Nom_especie || "");
            setEstado(rowToEdit.Estado || "Activo"); // cargar estado si es edición
            setImgEspecie(null); // Reset image when editing
            setTextFormButton("Actualizar");
        } else {
            setEstado("Activo");
            setNom_especie("");
            setImgEspecie(null);
            setTextFormButton("Enviar");
        }
    }, [rowToEdit]);

    const crearEspecie = async () => {
        const formData = new FormData();
        formData.append("Nom_especie", Nom_especie);
        formData.append("Estado", Estado);
        if (img_especie) formData.append("img_especie", img_especie);

        return apiAxios.post("/api/Especie", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    };

    const actualizarEspecie = async () => {
        const formData = new FormData();
        formData.append("Nom_especie", Nom_especie);
        formData.append("Estado", Estado);
        if (img_especie) formData.append("img_especie", img_especie);

        return apiAxios.put(`/api/Especie/${rowToEdit.Id_especie}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    };

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

        try {
            if (rowToEdit) {
                await actualizarEspecie();
                MySwal.fire({
                    title: "Actualizado",
                    text: "Especie actualizada correctamente",
                    icon: "success"
                });
            } else {
                await crearEspecie();
                MySwal.fire({
                    title: "Creación",
                    text: "Especie creada correctamente",
                    icon: "success"
                });
            }

            hideModal();
        } catch (error) {
            console.error(
                "Error al guardar especie:",
                error.response ? error.response.data : error.message
            );
            MySwal.fire({
                title: "Error",
                text: "Error al guardar la especie",
                icon: "success"
            })
        }
    };

    return (
        <form onSubmit={gestionarForm} className="col-12 col-md-6">
            <div className="mb-3">
                <label htmlFor="Nom_especie" className="form-label">
                    Nombre de la Especie:
                </label>
                <input
                    type="text"
                    id="Nom_especie"
                    className="form-control"
                    value={Nom_especie}
                    onChange={(e) => setNom_especie(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="img_especie" className="form-label">
                    Imagen de la Especie (Opcional):
                </label>
                <input
                    type="file"
                    id="img_especie"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setImgEspecie(e.target.files[0])}
                />
            </div>

            <div className="mb-3">
                <input
                    type="submit"
                    className="btn btn-primary w-50"
                    value={textFormButton}
                />
            </div>
        </form>
    );
};

export default EspeciesForm;
