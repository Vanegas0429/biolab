import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

const EstadoForm = ({ hideModal, rowToEdit, refreshList }) => {
    const [Tip_Estado, setTip_Estado] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (rowToEdit) {
            setTip_Estado(rowToEdit.Tip_Estado || '');
        } else {
            setTip_Estado('');
        }
    }, [rowToEdit]);

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Tip_Estado.trim()) {
            Swal.fire("Atención", "Por favor ingresa el nombre del estado", "warning");
            return;
        }

        setIsSubmitting(true);

        try {
            if (rowToEdit && rowToEdit.Id_Estado) {
                await apiAxios.put(`/api/Estado/${rowToEdit.Id_Estado}`, { Tip_Estado });
                Swal.fire({
                    title: "Actualizado",
                    text: "Estado actualizado correctamente",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                await apiAxios.post('/api/Estado', { Tip_Estado });
                Swal.fire({
                    title: "Registrado",
                    text: "Estado registrado correctamente",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }

            if (refreshList) await refreshList();
            if (hideModal) hideModal();
        } catch (error) {
            console.error("Error registrando Estado:", error.response ? error.response.data : error.message);
            Swal.fire("Error", error.response?.data?.message || "Error al guardar el estado", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={gestionarForm} className="container-fluid position-relative">
            {isSubmitting && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white bg-opacity-75 z-3 rounded-3">
                    <div className="spinner-border text-primary mb-2" role="status"></div>
                    <span className="fw-bold text-dark">Guardando estado...</span>
                </div>
            )}
            <div className="row g-3">
                <div className="col-12">
                    <label htmlFor="Tip_Estado" className="form-label fw-bold">Nombre del Estado:</label>
                    <input
                        type="text"
                        id="Tip_Estado"
                        className="form-control rounded-pill shadow-sm px-3"
                        value={Tip_Estado}
                        onChange={(e) => setTip_Estado(e.target.value)}
                        placeholder="Ej: Aprobado, Solicitado, Rechazado"
                        required
                    />
                </div>
                <div className="col-12 text-center mt-4">
                    <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold" disabled={isSubmitting}>
                        <i className={`fa-solid ${rowToEdit ? 'fa-rotate' : 'fa-paper-plane'} me-2`}></i>
                        {rowToEdit ? "Actualizar" : "Enviar"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EstadoForm;