import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const ActividadForm = ({ hideModal, refreshList, rowToEdit }) => {
    const [Actividad, setActividad] = useState("Activo");

    //Campos del formulario
    const [Nom_Actividad, setNom_Actividad] = useState("");
    const [textFormButton, setTextFormButton] = useState("Enviar");

    useEffect(() => {
        if (rowToEdit) {
            setNom_Actividad(rowToEdit.Nom_Actividad || "");
            setActividad(rowToEdit.Actividad || "Activo"); // cargar Actividad si es edición
            setTextFormButton("Actualizar");
        } else {
            setActividad("Activo");
            setNom_Actividad("");
            setTextFormButton("Enviar");
        }
    }, [rowToEdit]);

    const crearActividad = async () => {
        return apiAxios.post("/api/Actividad", { Nom_Actividad, Actividad });
    };

    const actualizarActividad = async () => {
        return apiAxios.put(`/api/Actividad/${rowToEdit.Id_Actividad}`, {
            Nom_Actividad,
            Actividad
        });
    };

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Nom_Actividad) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios",
                icon: "error"
            });
            return;

        }

        try {
            if (rowToEdit) {
                await actualizarActividad();
                MySwal.fire({
                    title: "Actualizado",
                    text: "Actividad actualizada correctamente",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await crearActividad();
                MySwal.fire({
                    title: "Creación",
                    text: "Actividad creada correctamente",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            refreshList();
            hideModal();
        } catch (error) {
            console.error(
                "Error al guardar Actividad:",
                error.response ? error.response.data : error.message
            );
            MySwal.fire({
                title: "Error",
                text: "Error al guardar la Actividad",
                icon: "error"
            })
        }
    };

    return (
        <form onSubmit={gestionarForm} className="container-fluid">
            <div className="row g-3">
                <div className="col-md-12">
                    <label htmlFor="Nom_Actividad" className="form-label fw-bold">
                        Nombre de la Actividad:
                    </label>
                    <input
                        type="text"
                        id="Nom_Actividad"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={Nom_Actividad}
                        onChange={(e) => setNom_Actividad(e.target.value)}
                        placeholder="Ej: Siembra de tejidos"
                    />
                </div>

                <div className="col-12 text-center mt-4">
                    <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">
                        <i className={`fa-solid ${rowToEdit ? 'fa-rotate' : 'fa-paper-plane'} me-2`}></i>
                        {textFormButton}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ActividadForm;
