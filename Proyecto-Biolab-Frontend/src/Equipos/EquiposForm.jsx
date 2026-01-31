import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const EquiposForm = () => {

    const [nombre, setNombre] = useState('')
    const [marca, setMarca] = useState('')
    const [grupo, setGrupo] = useState('')
    const [linea, setLinea] = useState('')
    const [centro_costos, setCentroCostos] = useState('')
    const [subcentro_costos, setSubcentroCostos] = useState('')
    const [observaciones, setObservaciones] = useState('')

    const [imagen, setImagen] = useState(null) 

    const [textFormButton, setFormButton] = useState('Enviar')

    const gestionarForm = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData();

            formData.append('nombre', nombre);
            formData.append('marca', marca);
            formData.append('grupo', grupo);
            formData.append('linea', linea);
            formData.append('centro_costos', centro_costos);
            formData.append('subcentro_costos', subcentro_costos);
            formData.append('observaciones', observaciones);

            if (imagen) {
                formData.append('imagen', imagen); // archivo agregado
            }

            const response = await apiAxios.post('/api/equipos', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert('Equipo creado correctamente')

            // ---- limpiar formulario ----
            setNombre('')
            setMarca('')
            setGrupo('')
            setLinea('')
            setCentroCostos('')
            setSubcentroCostos('')
            setObservaciones('')
            setImagen(null)

        } catch (error) {
            console.error("Error registrando Equipo:", error.response ? error.response.data : error.message);
            alert(error.message)
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">

                <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input type="text" className="form-control"
                        value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Marca:</label>
                    <input type="text" className="form-control"
                        value={marca} onChange={(e) => setMarca(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Grupo:</label>
                    <input type="text" className="form-control"
                        value={grupo} onChange={(e) => setGrupo(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Línea:</label>
                    <input type="text" className="form-control"
                        value={linea} onChange={(e) => setLinea(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Centro de costos:</label>
                    <input type="text" className="form-control"
                        value={centro_costos} onChange={(e) => setCentroCostos(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Subcentro de costos:</label>
                    <input type="text" className="form-control"
                        value={subcentro_costos} onChange={(e) => setSubcentroCostos(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Observaciones:</label>
                    <input type="text" className="form-control"
                        value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Imagen del equipo:</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImagen(e.target.files[0])}
                    />
                </div>
                {imagen && (
                    <div className="mb-3 text-center">
                        <img
                            src={URL.createObjectURL(imagen)}
                            alt="Vista previa"
                            className="img-thumbnail"
                            width="200"
                        />
                    </div>
                )}

                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>

            </form>
        </>
    )
}

export default EquiposForm
