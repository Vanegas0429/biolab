import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ActividadMaterialForm = ({ hideModal, rowToEdit }) => {

    const [Estado, setEstado] = useState("Activo")
    const [textFormButton, setTextFormButton] = useState('Enviar')

    const [Actividades, setActividades] = useState([])
    const [Id_Actividad, setId_Actividad] = useState('')
    const [Materiales, setMateriales] = useState([])
    const [materialesSeleccionados, setMaterialesSeleccionados] = useState([])

    // 🔹 Cargar Actividades
    useEffect(() => {
        getActividad()
        getMaterial()
    }, [])

    const getActividad = async () => {
        try {
            const res = await apiAxios.get('/api/Actividad')
            setActividades(res.data)
        } catch (error) {
            console.log("No se pudo cargar Actividades")
        }
    }

    const getMaterial = async () => {
        try {
            const res = await apiAxios.get('/api/Material')
            setMateriales(res.data)
        } catch (error) {
            console.log("No se pudo cargar Materiales")
        }
    }

    // 🔹 Cargar datos si es edición
    useEffect(() => {
        if (rowToEdit) {
            setId_Actividad(rowToEdit.Id_Actividad || '')
            const selectedMat = rowToEdit.materialesList ? rowToEdit.materialesList.map(m => m.Id_Material) : [];
            setMaterialesSeleccionados(selectedMat)
            setEstado(rowToEdit.Estado || 'Activo')
            setTextFormButton('Actualizar')
        } else {
            setId_Actividad('')
            setMaterialesSeleccionados([])
            setEstado('Activo')
            setTextFormButton('Enviar')
        }
    }, [rowToEdit])

    const handleCheckboxChange = (id) => {
        setMaterialesSeleccionados(prev => 
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    }

    // 🔹 CREAR
    const crearActividadMaterial = async () => {
        const promises = materialesSeleccionados.map(id_mat => {
            return apiAxios.post('/api/ActividadMaterial', {
                Id_Actividad: Number(Id_Actividad),
                Id_Material: Number(id_mat),
                Estado
            });
        });
        return Promise.all(promises);
    }

    // 🔹 ACTUALIZAR
    const actualizarActividadMaterial = async () => {
        const initialMat = rowToEdit.materialesList || [];
        const initialIds = initialMat.map(m => m.Id_Material);
        
        const toCreate = materialesSeleccionados.filter(id => !initialIds.includes(id));
        const toDelete = initialMat.filter(m => !materialesSeleccionados.includes(m.Id_Material));

        const promises = [];

        for (const id_mat of toCreate) {
            promises.push(apiAxios.post('/api/ActividadMaterial', {
                Id_Actividad: Number(Id_Actividad),
                Id_Material: Number(id_mat),
                Estado
            }));
        }

        for (const mat of toDelete) {
            promises.push(apiAxios.delete(`/api/ActividadMaterial/${mat.Id_ActividadMaterial}`));
        }

        return Promise.all(promises);
    }

    const gestionarForm = async (e) => {
        e.preventDefault()

        if (!Id_Actividad || materialesSeleccionados.length === 0) {
            MySwal.fire({
                title: "Error",
                text: "Por favor completa todos los campos obligatorios y selecciona al menos un material",
                icon: "error"
            })
            return
        }

        try {

            if (rowToEdit) {
                await actualizarActividadMaterial()

                MySwal.fire({
                    title: "Actualización",
                    text: "Actividad Material actualizada correctamente",
                    icon: "success"
                })

            } else {

                await crearActividadMaterial()

                MySwal.fire({
                    title: "Creación",
                    text: "Actividad Materiales creados correctamente",
                    icon: "success"
                })
            }

            hideModal && hideModal()

        } catch (error) {

            console.error("Error al guardar Actividad Material:", error.response ? error.response.data : error.message);

            MySwal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar la Actividad Material",
                icon: "error"
            })
        }
    }

    return (
        <form onSubmit={gestionarForm} className="col-12 col-md-12">
            <div className="row">
                {/* Actividad */}
                <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-1">Actividad:</label>
                    <select
                        className="form-control"
                        value={Id_Actividad}
                        onChange={(e) => setId_Actividad(Number(e.target.value))}
                        disabled={!!rowToEdit}
                    >
                        <option value="">Selecciona</option>
                        {Actividades.filter(a => a.Estado === 'Activo').map(e => (
                            <option key={e.Id_Actividad} value={e.Id_Actividad}>
                                {e.Nom_Actividad}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Materiales con Checkboxes */}
                <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-1">Materiales (Múltiple):</label>
                    <div className="border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                        {Materiales.filter(m => m.Estado === 'Activo').map(m => (
                            <div className="form-check" key={m.Id_Material}>
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    value={m.Id_Material} 
                                    id={`mat-${m.Id_Material}`}
                                    checked={materialesSeleccionados.includes(m.Id_Material)}
                                    onChange={() => handleCheckboxChange(m.Id_Material)}
                                />
                                <label className="form-check-label" htmlFor={`mat-${m.Id_Material}`}>
                                    {m.Nom_Material}
                                </label>
                            </div>
                        ))}
                        {Materiales.filter(m => m.Estado === 'Activo').length === 0 && (
                            <small className="text-muted">No hay materiales activos disponibles.</small>
                        )}
                    </div>
                    <small className="text-muted">{materialesSeleccionados.length} seleccionado(s)</small>
                </div>
            </div>

            {/* Botón */}
            <div className="mb-3 text-end">
                <button
                    type="submit"
                    className="btn btn-primary px-4 fw-bold shadow-sm"
                >
                    <i className="fa-solid fa-floppy-disk me-2"></i>
                    {textFormButton}
                </button>
            </div>
        </form>
    )
}

export default ActividadMaterialForm