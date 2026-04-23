import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ReactivosForm = ({ hideModal, rowToEdit, refreshList }) => {
    const [Estado, setEstado] = useState("Activo");
    const [Nom_reactivo, setNom_Reactivo] = useState("");
    const [Nomenclatura, setNomenclatura] = useState("");
    const [Presentacion, setPresentacion] = useState("");
    const [Est_reactivo, setEst_Reactivo] = useState("");
    const [fichaTecnica, setFichaTecnica] = useState(null);
    const [textFormButton, setTextFormButton] = useState("Enviar");

    useEffect(() => {
        if (rowToEdit) {
            setNom_Reactivo(rowToEdit.Nom_reactivo || "");
            setNomenclatura(rowToEdit.Nomenclatura || "");
            setPresentacion(rowToEdit.Presentacion || "");
            setEst_Reactivo(rowToEdit.Est_reactivo || "");
            setEstado(rowToEdit.Estado || "Activo");
            setFichaTecnica(null);
            setTextFormButton("Actualizar");
        } else {
            setEstado("Activo");
            setNom_Reactivo("");
            setNomenclatura("");
            setPresentacion("");
            setEst_Reactivo("");
            setFichaTecnica(null);
            setTextFormButton("Enviar");
        }
    }, [rowToEdit]);

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Nom_reactivo) {
            MySwal.fire({ title: "Error", text: "Por favor completa todos los campos obligatorios", icon: "error" });
            return;
        }

        const formData = new FormData();
        formData.append("Nom_reactivo", Nom_reactivo);
        formData.append("Nomenclatura", Nomenclatura);
        formData.append("Presentacion", Presentacion);
        formData.append("Est_reactivo", Est_reactivo);
        formData.append("Estado", Estado);
        if (fichaTecnica) {
            formData.append("Ficha_tecnica", fichaTecnica);
        }

        try {
            if (rowToEdit) {
                await apiAxios.put(`/api/Reactivo/${rowToEdit.Id_Reactivo}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                MySwal.fire({ title: "Actualizado", text: "Reactivo actualizado correctamente", icon: "success" });
            } else {
                await apiAxios.post("/api/Reactivo", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                MySwal.fire({ title: "Creación", text: "Reactivo creado correctamente", icon: "success" });
            }
            if (refreshList) refreshList();
            hideModal();
        } catch (error) {
            console.error("Error al guardar Reactivo:", error.response ? error.response.data : error.message);
            MySwal.fire({ title: "Error", text: "Error al guardar el Reactivo", icon: "error" });
        }
    };

    return (
        <form onSubmit={gestionarForm}>
            <div className="mb-3">
                <label className="form-label">Nombre Reactivo</label>
                <input
                    type="text"
                    className="form-control"
                    value={Nom_reactivo}
                    onChange={(e) => setNom_Reactivo(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Nomenclatura</label>
                <input
                    type="text"
                    className="form-control"
                    value={Nomenclatura}
                    onChange={(e) => setNomenclatura(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Presentación</label>
                <input
                    type="text"
                    className="form-control"
                    value={Presentacion}
                    onChange={(e) => setPresentacion(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Estado Reactivo</label>
                <select
                    className="form-control"
                    value={Est_reactivo}
                    onChange={(e) => setEst_Reactivo(e.target.value)}
                >
                    <option value="">Selecciona uno</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Dañado">Dañado</option>
                </select>
            </div>

            {/* Campo Ficha Técnica PDF */}
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
                {!fichaTecnica && rowToEdit?.Ficha_tecnica && (
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

export default ReactivosForm;
