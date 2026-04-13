import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const ReactivosForm = ({ hideModal, rowToEdit }) => {
    const [Estado, setEstado] = useState("Activo");



    //Campos del formulario
    const [Nom_Reactivo, setNombreReactivo] = useState('')
    const [Nomenclatura, setNomenclatura] = useState('')
    const [Presentacion, setPresentacion] = useState('')
    const [Est_Reactivo, setEst_Reactivo] = useState('')
    const [Lote, setLote] = useState('')

    const [textFormButton, setTextFormButton] = useState("Enviar");

    useEffect(() => {
        if (rowToEdit) {
            setNombreReactivo(rowToEdit.Nom_reactivo|| "");
            setNomenclatura(rowToEdit.Nomenclatura|| "");
            setPresentacion(rowToEdit.Presentacion|| "");
            setEst_Reactivo(rowToEdit.Est_Reactivo|| "");
            setLote(rowToEdit.Lote|| "");
            setEstado(rowToEdit.Estado || "Activo"); // cargar estado si es edición
            setTextFormButton("Actualizar");
        } else {
            setEstado("Activo");
            setNombreReactivo("");
            setNomenclatura("");
            setPresentacion("");
            setEst_Reactivo("");
            setLote("");
            setTextFormButton("Enviar");
        }
    }, [rowToEdit]);

    const crearReactivo = async () => {
    return apiAxios.post("/api/Reactivo", {
        Nom_reactivo: Nom_Reactivo,
        Nomenclatura,
        Presentacion,
        Est_reactivo: Est_Reactivo,
        Lote,
        Estado
    });
};

    const actualizarReactivo = async () => {
    return apiAxios.put(`/api/Reactivo/${rowToEdit.Id_Reactivo}`, {
        Nom_reactivo: Nom_Reactivo,
        Nomenclatura,
        Presentacion,
        Est_reactivo: Est_Reactivo,
        Lote,
        Estado
    });
};

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Nom_Reactivo, !Nomenclatura, !Presentacion, !Est_Reactivo, !Lote ) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios",
                icon: "error"
            });
            return;

        }

        try {
            if (rowToEdit) {
                await actualizarReactivo();
                MySwal.fire({
                    title: "Actualizado",
                    text: "Reactivo actualizada correctamente",
                    icon: "success"
                });
            } else {
                await crearReactivo();
                MySwal.fire({
                    title: "Creación",
                    text: "Reactivo creada correctamente",
                    icon: "success"
                });
            }

            hideModal();
        } catch (error) {
            console.error(
                "Error al guardar Reactivo:",
                error.response ? error.response.data : error.message
            );
            MySwal.fire({
                title: "Error",
                text: "Error al guardar la Reactivo",
                icon: "success"
            })
        }
    };

    return (
        <form onSubmit={gestionarForm} className="col-12 col-md-6">
            <div className="mb-3">
                <label htmlFor="Nom_Reactivo" className="form-label">
                    Nombre del Reactivo:
                </label>
                <input
                    type="text"
                    id="Nom_Reactivo"
                    className="form-control"
                    value={Nom_Reactivo}
                    onChange={(e) => setNombreReactivo(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="Nomenclatura" className="form-label">
                    Nomenclatura:
                </label>
                <input
                    type="text"
                    id="Nomenclatura"
                    className="form-control"
                    value={Nomenclatura}
                    onChange={(e) => setNomenclatura(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="Presentacion" className="form-label">
                    Presentacion:
                </label>
                <input
                    type="text"
                    id="Presentacion"
                    className="form-control"
                    value={Presentacion}
                    onChange={(e) => setPresentacion(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="Est_Reactivo" className="form-label">
                    Estado Reactivo:
                </label>
                <select type="text" id="Est_Reactivo" className="form-control" value={Est_Reactivo} onChange={(e) => setEst_Reactivo(e.target.value)}>
                        <option value="">Selecciona uno</option>
                        <option value="1">Bueno</option>
                        <option value="2">Dañado</option>
                    </select>    
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

export default ReactivosForm;
