import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

const FuncionariosForm = ({ hideModal, rowToEdit, refreshList }) => {
    const [Nombre, setNombre] = useState('');
    const [Apellido, setApellido] = useState('');
    const [Telefono, setTelefono] = useState('');
    const [Correo, setCorreo] = useState('');
    const [Cargo_Funcionario, setCargoFuncionario] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (rowToEdit) {
            setNombre(rowToEdit.Nombre || '');
            setApellido(rowToEdit.Apellido || '');
            setTelefono(rowToEdit.Telefono || '');
            setCorreo(rowToEdit.Correo || '');
            setCargoFuncionario(rowToEdit.Cargo_Funcionario || '');
        } else {
            setNombre('');
            setApellido('');
            setTelefono('');
            setCorreo('');
            setCargoFuncionario('');
        }
    }, [rowToEdit]);

    const gestionarForm = async (e) => {
        e.preventDefault();

        if (!Nombre || !Apellido || !Correo) {
            Swal.fire("Atención", "Por favor completa los campos obligatorios (Nombre, Apellido, Correo)", "warning");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            Nombre,
            Apellido,
            Telefono,
            Correo,
            Cargo_Funcionario
        };

        try {
            if (rowToEdit && (rowToEdit.id || rowToEdit.Id_Funcionario)) {
                const id = rowToEdit.id || rowToEdit.Id_Funcionario;
                await apiAxios.put(`/api/Funcionario/${id}`, payload);
                Swal.fire({
                    title: "Actualizado",
                    text: "Funcionario actualizado correctamente",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                await apiAxios.post('/api/Funcionario', payload);
                Swal.fire({
                    title: "Registrado",
                    text: "Funcionario registrado correctamente",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }

            if (refreshList) await refreshList();
            if (hideModal) hideModal();
        } catch (error) {
            console.error("Error al guardar Funcionario:", error.response ? error.response.data : error.message);
            Swal.fire("Error", error.response?.data?.message || "Error al guardar el Funcionario", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={gestionarForm} className="container-fluid position-relative">
            {isSubmitting && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white bg-opacity-75 z-3 rounded-3">
                    <div className="spinner-border text-primary mb-2" role="status"></div>
                    <span className="fw-bold text-dark">Guardando funcionario...</span>
                </div>
            )}
            <div className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="Nombre" className="form-label fw-bold">Nombre:</label>
                    <input type="text" id="Nombre" className="form-control rounded-pill shadow-sm px-3" value={Nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Juan" required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="Apellido" className="form-label fw-bold">Apellido:</label>
                    <input type="text" id="Apellido" className="form-control rounded-pill shadow-sm px-3" value={Apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Ej: Pérez" required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="Telefono" className="form-label fw-bold">Teléfono:</label>
                    <input type="text" id="Telefono" className="form-control rounded-pill shadow-sm px-3" value={Telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej: 3001234567" />
                </div>
                <div className="col-md-6">
                    <label htmlFor="Correo" className="form-label fw-bold">Correo:</label>
                    <input type="email" id="Correo" className="form-control rounded-pill shadow-sm px-3" value={Correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Ej: juan.perez@sena.edu.co" required />
                </div>
                <div className="col-md-12">
                    <label htmlFor="Cargo_Funcionario" className="form-label fw-bold">Cargo del Funcionario:</label>
                    <input type="text" id="Cargo_Funcionario" className="form-control rounded-pill shadow-sm px-3" value={Cargo_Funcionario} onChange={(e) => setCargoFuncionario(e.target.value)} placeholder="Ej: Instructor, Coordinador, Subdirector" />
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

export default FuncionariosForm;