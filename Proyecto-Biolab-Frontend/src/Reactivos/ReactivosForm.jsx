import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"

const ReactivosForm = () => {

    //Definir una prop  para cada campo del formulario
    const [Nom_Reactivo, setNombreReactivo] = useState('')
    const [Nomenclatura, setNomenclatura] = useState('')
    const [Uni_Medida, setUnidadMedida] = useState('')
    const [Cantidad, setCantidad] = useState('')
    const [Concentración, setConcentración] = useState('')
    const [Marca, setMarca] = useState('')
    const [Fec_Vencimiento, setFechaVencimiento] = useState('')
    const [Fun_Química, setFuncionQuímica] = useState('')
    const [Est_Fisico, setEstadoFisico] = useState('')
    const [Nat_Quimica, setNaturalezaQuimica] = useState('')
    const [Clasificación, setClasificación] = useState('')
    const [Peligrosidad, setPeligrosidad] = useState('')
    const [Cla_Peligro, setClasePeligro] = useState('')
    const [Fic_Dat_Seguridad, setFichaDatosSeguridad] = useState('')


    const [textFormButton, setFormButton] = useState('Enviar')


    const gestionarForm = async (e) => {

        e.preventDefault()  //Evita que la pagina se actualice

        if (textFormButton == 'Enviar') {

            try{

                const response = await apiAxios.post('/api/Reactivo', { //Se envian todos los datos como un objeto JSON
                    Nom_Reactivo: Nom_Reactivo,
                    Nomenclatura: Nomenclatura,
                    Uni_Medida: Uni_Medida,
                    Cantidad: Cantidad,
                    Concentración: Concentración,
                    Marca: Marca,
                    Fec_Vencimiento: Fec_Vencimiento,
                    Fun_Química: Fun_Química,
                    Est_Fisico: Est_Fisico,
                    Nat_Quimica: Nat_Quimica,
                    Clasificación: Clasificación,
                    Peligrosidad: Peligrosidad,
                    Cla_Peligro: Cla_Peligro,
                    Fic_Dat_Seguridad: Fic_Dat_Seguridad,

                })

                // Axios devuelve el cuerpo de la respuesta en response.date
                const data = response.data;

                alert('Reactivo creado correctamente')

            } catch (error) {

                console.error("Error registrando Reactivo:", error.response ? error.response.data : error.message);
                alert(error.message)

            }
            
        } else if (textFormButton == 'Actualizar') {
            
        }
    }

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
                <div className="mb-3">
                    <label htmlFor="Nom_Reactivo" className="form-label">Nombre Reactivo:</label>
                    <input type="text" id="Nom_Reactivo" className="form-control" value={Nom_Reactivo} onChange={(e) => setNombreReactivo(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Nomenclatura" className="form-label">Nomenclatura:</label>
                    <input type="text" id="Nomenclatura" className="form-control" value={Nomenclatura} onChange={(e) => setNomenclatura(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Uni_Medida" className="form-label">Unidad Medida:</label>
                    <input type="text" id="Uni_Medida" className="form-control" value={Uni_Medida} onChange={(e) => setUnidadMedida(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Cantidad" className="form-label">Cantidad:</label>
                    <input type="text" id="Cantidad" className="form-control" value={Cantidad} onChange={(e) => setCantidad(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Concentración" className="form-label">Concentración:</label>
                    <input type="text" id="Concentración" className="form-control" value={Concentración} onChange={(e) => setConcentración(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Marca" className="form-label">Marca:</label>
                    <input type="text" id="Marca" className="form-control" value={Marca} onChange={(e) => setMarca(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Fec_Vencimiento" className="form-label">Fecha Vencimiento:</label>
                    <input type="date" id="Fec_Vencimiento" className="form-control" value={Fec_Vencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Fun_Química" className="form-label">Funcion Química:</label>
                    <input type="text" id="Fun_Química" className="form-control" value={Fun_Química} onChange={(e) => setFuncionQuímica(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Est_Fisico" className="form-label">Estado Fisico:</label>
                    <select type="text" id="Est_Fisico" className="form-control" value={Est_Fisico} onChange={(e) => setEstadoFisico(e.target.value)}>
                        <option value="">Selecciona uno</option>
                        <option value="1">Liquido</option>
                        <option value="2">Solido</option>
                        <option value="3">Gaseoso</option>
                    </select>
                </div>
                 <div className="mb-3">
                    <label htmlFor="Nat_Quimica" className="form-label">Naturaleza Quimica:</label>
                    <input type="text" id="Nat_Quimica" className="form-control" value={Nat_Quimica} onChange={(e) => setNaturalezaQuimica(e.target.value)} />
                </div>
                 <div className="mb-3">
                    <label htmlFor="Clasificación" className="form-label">Clasificación:</label>
                    <input type="text" id="Clasificación" className="form-control" value={Clasificación} onChange={(e) => setClasificación(e.target.value)} />
                </div>
                 <div className="mb-3">
                    <label htmlFor="Peligrosidad" className="form-label">Peligrosidad:</label>
                    <input type="text" id="Peligrosidad" className="form-control" value={Peligrosidad} onChange={(e) => setPeligrosidad(e.target.value)} />
                </div>
                 <div className="mb-3">
                    <label htmlFor="Cla_Peligro" className="form-label">Clasificacion de Peligro:</label>
                    <input type="text" id="Cla_Peligro" className="form-control" value={Cla_Peligro} onChange={(e) => setClasePeligro(e.target.value)} />
                </div>
                 <div className="mb-3">
                    <label htmlFor="Fic_Dat_Seguridad" className="form-label">Ficha Datos Seguridad:</label>
                    <input type="text" id="Fic_Dat_Seguridad" className="form-control" value={Fic_Dat_Seguridad} onChange={(e) => setFichaDatosSeguridad(e.target.value)} />
                </div>
                 <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   
            </form>
        
        </>
    )
}

export default ReactivosForm