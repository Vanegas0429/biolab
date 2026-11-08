import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const EquiposForm = ({ hideModal, rowToEdit, refreshList }) => {
    const Myswal = withReactContent(Swal);

    const [nombre, setNombre] = useState("");
    const [placa, setPlaca] = useState("");
    const [marca, setMarca] = useState("");
    const [grupo, setGrupo] = useState("");
    const [linea, setLinea] = useState("");
    const [centro_costos, setCentroCostos] = useState("");
    const [serial, setSerial] = useState("");
    const [vida_util, setVidaUtil] = useState("");
    const [valor_unitario, setValorUnitario] = useState("");
    const [fecha_adquisicion, setFechaAdquisicion] = useState("");
    const [estado, setEstado] = useState("Activo");
    const [fichaTecnica, setFichaTecnica] = useState(null);

    const [textFormButton, setTextFormButton] = useState("Enviar");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Detectar cuando es edición
    useEffect(() => {
        if (rowToEdit?.Id_Equipo) {
            loadDataInForm();
        } else {
            resetForm();
        }
    }, [rowToEdit]);

    const loadDataInForm = () => {
        setNombre(rowToEdit.nombre || "");
        setPlaca(rowToEdit.placa || rowToEdit.no_chapeta || "");
        setMarca(rowToEdit.marca || "");
        setGrupo(rowToEdit.grupo || "");
        setLinea(rowToEdit.linea || "");
        setCentroCostos(rowToEdit.centro_costos || "");
        setSerial(rowToEdit.serial || "");
        setVidaUtil(rowToEdit.vida_util || "");
        setValorUnitario(rowToEdit.valor_unitario ? String(Math.round(Number(rowToEdit.valor_unitario))) : "");
        setFechaAdquisicion(rowToEdit.fecha_adquisicion || "");
        setEstado(rowToEdit.estado || "Activo");

        setTextFormButton("Actualizar");
    };

    const resetForm = () => {
        setNombre("");
        setPlaca("");
        setMarca("");
        setGrupo("");
        setLinea("");
        setCentroCostos("");
        setSerial("");
        setVidaUtil("");
        setValorUnitario("");
        setFechaAdquisicion("");
        setEstado("Activo");
        setFichaTecnica(null);

        setTextFormButton("Enviar");
    };

    const gestionarForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("placa", placa);
        formData.append("marca", marca);
        formData.append("grupo", grupo);
        formData.append("linea", linea);
        formData.append("centro_costos", centro_costos);
        formData.append("serial", serial);
        formData.append("vida_util", vida_util);
        formData.append("valor_unitario", valor_unitario ? String(Math.round(Number(valor_unitario))) : "0");
        formData.append("fecha_adquisicion", fecha_adquisicion);
        formData.append("estado", estado);

        if (fichaTecnica) {
            formData.append("ficha_tecnica", fichaTecnica);
        }

        try {
            if (rowToEdit?.Id_Equipo) {
                await apiAxios.put(
                    "/api/Equipo/" + rowToEdit.Id_Equipo,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                Myswal.fire({
                    title: "Actualizado", 
                    text: "Equipo actualizado correctamente",
                    icon: "success",
                });
            } else {
                await apiAxios.post(
                    "/api/Equipo",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                Myswal.fire({
                    title: "Registrado", 
                    text: "Equipo registrado correctamente",
                    icon: "success",
                });
            }

            if (hideModal) hideModal();
            if (refreshList) await refreshList();
        } catch (error) {
            console.error("Error guardando equipo:", error.response?.data || error.message);
            Myswal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar el equipo",
                icon: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={gestionarForm} encType="multipart/form-data" className="container-fluid position-relative">
            {isSubmitting && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white bg-opacity-75 z-3 rounded-3">
                    <div className="spinner-border text-primary mb-2" role="status"></div>
                    <span className="fw-bold text-dark">
                        {fichaTecnica ? "Procesando y cargando Ficha Técnica..." : "Guardando equipo..."}
                    </span>
                </div>
            )}
            <div className="row g-3">
                {/* Nombre del Equipo */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Nombre del Equipo:</label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Microscopio Óptico Binocular"
                        required
                    />
                </div>

                {/* Número de Placa */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Número de Placa:</label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={placa}
                        onChange={(e) => setPlaca(e.target.value)}
                        placeholder="Ej: 1029384"
                    />
                </div>

                {/* Estado Activo / Inactivo */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Estado:</label>
                    <select
                        className="form-select rounded-pill shadow-sm px-3"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        required
                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>

                {/* Serial */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Serial:</label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={serial}
                        onChange={(e) => setSerial(e.target.value)}
                        placeholder="Ej: SN-12345"
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
                        placeholder="Ej: Óptica y Microscopía"
                    />
                </div>

                {/* Centro de costos */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Centro de Costos:</label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={centro_costos}
                        onChange={(e) => setCentroCostos(e.target.value)}
                        placeholder="Ej: Lab-01-SEC"
                    />
                </div>

                {/* Fecha Adquisición */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Fecha de Adquisición:</label>
                    <input
                        type="date"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={fecha_adquisicion}
                        onChange={(e) => setFechaAdquisicion(e.target.value)}
                    />
                </div>

                {/* Vida Util */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Vida Útil (Años):</label>
                    <input
                        type="number"
                        min="0"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={vida_util}
                        onChange={(e) => setVidaUtil(e.target.value)}
                        placeholder="Ej: 5"
                    />
                </div>

                {/* Valor Unitario */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Valor Unitario ($):</label>
                    <input
                        type="number"
                        min="0"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={valor_unitario}
                        onChange={(e) => setValorUnitario(e.target.value)}
                        placeholder="Ej: 1500000"
                    />
                </div>

                {/* Ficha Técnica (PDF) */}
                <div className="col-md-12">
                    <label className="form-label fw-bold">Ficha Técnica (PDF):</label>
                    <input
                        type="file"
                        className="form-control rounded-pill shadow-sm px-3"
                        accept=".pdf"
                        onChange={(e) => setFichaTecnica(e.target.files[0] || null)}
                    />
                    {rowToEdit?.ficha_tecnica && (
                        <small className="text-muted d-block mt-1 ps-2">
                            <i className="fa-solid fa-file-pdf text-danger me-1"></i>
                            El equipo ya cuenta con una ficha técnica guardada. Selecciona un archivo nuevo solo si deseas reemplazarla.
                        </small>
                    )}
                </div>

                {/* Descripcion Equipo */}
                <div className="col-md-12">
                    <label className="form-label fw-bold">Descripción del Equipo:</label>
                    <textarea
                        className="form-control rounded-4 shadow-sm px-3 py-2"
                        rows="3"
                        value={linea}
                        onChange={(e) => setLinea(e.target.value)}
                        placeholder="Detalles sobre características, modelo, observaciones o ubicación del equipo..."
                    ></textarea>
                </div>

                {/* Botón de Enviar */}
                <div className="col-12 text-center mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold"
                        disabled={isSubmitting}
                    >
                        <i className={`fa-solid ${rowToEdit?.Id_Equipo ? 'fa-rotate' : 'fa-paper-plane'} me-2`}></i>
                        {textFormButton}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EquiposForm;
