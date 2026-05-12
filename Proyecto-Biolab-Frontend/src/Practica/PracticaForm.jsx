import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig.js"


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const PracticaForm = ({ hideModal, rowToEdit, refreshList }) => {

    const Myswal = withReactContent(Swal)

    //Definir una prop para cada campo del formulario
    const [Id_Reserva, setId_Reserva] = useState('')
    const [reservas, setReservas] = useState([])

    const [textFormButton, setTextFormButton] = useState('Enviar')

    useEffect(() => {
        getReservas()
    }, [])

    useEffect(() => {
        if (rowToEdit.Id_Practica) {
            loadDataInForm()
        } else {
            setId_Reserva('')
        }
    }, [rowToEdit])

    const getReservas = async () => {
        
        const reservas = await apiAxios.get('/api/Reserva')
        setReservas(reservas.data)
        // console.log(reservas.data)    //verificar si esta llegando la informacion
    }

    const loadDataInForm = () => {
        // console.log('rowToEdit: ', rowToEdit)
        setId_Reserva(rowToEdit.Id_Reserva)

        setTextFormButton('Actualizar')
    }

    const gestionarForm = async (e) => {
        e.preventDefault()  
    if (textFormButton == 'Enviar') {
        try{
            await apiAxios.post('/api/Practica', { 
                Id_Reserva: Id_Reserva,
            })

            // alert('Práctica creada correctamente')
            Myswal.fire({
                title: "Exito",
                text: "Practica creada correctamente",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            })
            refreshList && refreshList()
            hideModal()

        } catch (error) {
            Myswal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            })
        }
    } else if (textFormButton === 'Actualizar') {
            try {
                const response = await apiAxios.put(
                    '/api/Practica/' + rowToEdit.Id_Practica,
    { Id_Reserva: Id_Reserva },{
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })

                const data = response.data

                // alert('Práctica actualizada correctamente')
                Myswal.fire({
                title: "Actualizacion",
                text: "Practica actualizada correctamente",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            })
                refreshList && refreshList()
                hideModal();

            } catch (error) {
                console.error("Error actualizar Practica", error.response ? error.response.data : error.message);
                Myswal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error"
                })
            }
        }
    };
    

    return (
        <form onSubmit={gestionarForm} className="container-fluid">
            <div className="row g-3">
                <div className="col-md-12">
                    <label htmlFor="Id_Reserva" className="form-label fw-bold">Seleccionar Reserva:</label>
                    <select 
                        id="Id_Reserva" 
                        className="form-select rounded-pill shadow-sm px-3" 
                        value={Id_Reserva} 
                        onChange={(e) => setId_Reserva(e.target.value)}
                    >
                        <option value="">Selecciona una reserva...</option>
                        {reservas.map(res => (
                            <option key={res.Id_Reserva} value={res.Id_Reserva}>
                                [{res.Tip_Reserva}] {res.Nom_Solicitante} - {res.Fec_Reserva}
                            </option>
                        ))}
                    </select>
                </div> 

                <div className="col-12 text-center mt-4">
                    <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">
                        <i className={`fa-solid ${textFormButton === 'Actualizar' ? 'fa-rotate' : 'fa-paper-plane'} me-2`}></i>
                        {textFormButton}
                    </button>
                </div>   
            </div>
        </form>
    )
}

export default PracticaForm
