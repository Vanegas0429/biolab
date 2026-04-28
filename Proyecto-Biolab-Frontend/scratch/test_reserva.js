import apiAxios from "../api/axiosConfig.js";

async function createTestReserva() {
    try {
        const payload = {
            Tip_Reserva: "Visita",
            Nom_Solicitante: "Prueba Automatizada",
            Doc_Solicitante: "123456789",
            Cor_Solicitante: "prueba@biolab.com",
            Tel_Solicitante: "3001234567",
            Can_Aprendices: 10,
            Fec_Reserva: new Date().toISOString().split('T')[0], // Hoy
            Hor_Reserva: "10:00",
            Num_Ficha: "2558666",
            Booleano: "Activo",
            actividades: [],
            equipos: [],
            materiales: [],
            reactivos: []
        };

        const response = await apiAxios.post('/api/Reserva', payload);
        console.log("Reserva creada con éxito:", response.data);
    } catch (error) {
        console.error("Error creando reserva:", error.response?.data || error.message);
    }
}

createTestReserva();
