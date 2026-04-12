import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig.js"


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const PracticaForm = ({ hideModal, rowToEdit }) => {

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
                title: "Actualizacion",
                text: "Practica creada correctamente",
                icon: "success"
            })
            hideModal()

        } catch (error) {
            alert(error.message)
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
                icon: "success"
            })
                hideModal();

            } catch (error) {
                console.error("Error actualizar Practica", error.response ? error.response.data : error.message);
                alert(error.message);
            }
        }
    };
    

    return (
        <>
            <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">

                <div className="mb-3">
                    <label htmlFor="Id_Reserva" className="form-label">Reserva:</label>
                    
                    <select 
                        id="Id_Reserva" 
                        className="form-control" 
                        value={Id_Reserva} 
                        onChange={(e) => setId_Reserva(e.target.value)}
                    >
                        <option value="">Selecciona una...</option>

                        {reservas.map(res => (
                            <option key={res.Id_Reserva} value={res.Id_Reserva}>
                                {res.Tip_Reserva} - {res.Nom_Solicitante} - {res.Fec_Reserva} - {res.Hor_Reserva}
                            </option>
                        ))}
                    </select>
                </div> 

                <div className="mb-3">
                    <input type="submit" className="btn btn-primary w-50" value={textFormButton} />
                </div>   
            </form>
        </>
    )
}

export default PracticaForm
