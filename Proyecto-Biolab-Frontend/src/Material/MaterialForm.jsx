import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const MaterialForm = ({ hideModal, rowToEdit }) => {
    const [Estado, setEstado] = useState("Activo");



    //Campos del formulario
    const [Nom_Material, setNom_Material] = useState("");
    const [textFormButton, setTextFormButton] = useState("Enviar");

    useEffect(() => {
        if (rowToEdit) {
            setNom_Material(rowToEdit.Nom_Material || "");
            setEstado(rowToEdit.Estado || "Activo"); // cargar estado si es edición
            setTextFormButton("Actualizar");
        } else {
            setEstado("Activo");
            setNom_Material("");
            setTextFormButton("Enviar");
        }
    }, [rowToEdit]);

    const crearMaterial = async () => {
        return apiAxios.post("/api/Material", { Nom_Material, Estado });
    };

    const actualizarMaterial = async () => {
        return apiAxios.put(`/api/Material/${rowToEdit.Id_Material}`, {
            Nom_Material,
            Estado
        });
    };

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Nom_Material) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios",
                icon: "error"
            });
            return;

        }

        try {
            if (rowToEdit) {
                await actualizarMaterial();
                MySwal.fire({
                    title: "Actualizado",
                    text: "Material actualizada correctamente",
                    icon: "success"
                });
            } else {
                await crearMaterial();
                MySwal.fire({
                    title: "Creación",
                    text: "Material creada correctamente",
                    icon: "success"
                });
            }

            hideModal();
        } catch (error) {
            console.error(
                "Error al guardar Material:",
                error.response ? error.response.data : error.message
            );
            MySwal.fire({
                title: "Error",
                text: "Error al guardar la Material",
                icon: "success"
            })
        }
    };

    return (
        <form onSubmit={gestionarForm} className="col-12 col-md-6">
            <div className="mb-3">
                <label htmlFor="Nom_Material" className="form-label">
                    Nombre de la Material:
                </label>
                <input
                    type="text"
                    id="Nom_Material"
                    className="form-control"
                    value={Nom_Material}
                    onChange={(e) => setNom_Material(e.target.value)}
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

export default MaterialForm;
