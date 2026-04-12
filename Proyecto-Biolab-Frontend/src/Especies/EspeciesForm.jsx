import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const EspeciesForm = ({ hideModal, rowToEdit }) => {
    const [Estado, setEstado] = useState("Activo");



    //Campos del formulario
    const [Nom_especie, setNom_especie] = useState("");
    const [textFormButton, setTextFormButton] = useState("Enviar");

    useEffect(() => {
        if (rowToEdit) {
            setNom_especie(rowToEdit.Nom_especie || "");
            setEstado(rowToEdit.Estado || "Activo"); // cargar estado si es edición
            setTextFormButton("Actualizar");
        } else {
            setEstado("Activo");
            setNom_especie("");
            setTextFormButton("Enviar");
        }
    }, [rowToEdit]);

    const crearEspecie = async () => {
        return apiAxios.post("/api/Especie", { Nom_especie, Estado });
    };

    const actualizarEspecie = async () => {
        return apiAxios.put(`/api/Especie/${rowToEdit.Id_especie}`, {
            Nom_especie,
            Estado
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
