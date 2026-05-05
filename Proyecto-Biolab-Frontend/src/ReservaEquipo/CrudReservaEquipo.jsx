import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudReservaEquipo = () => {

  const [ReservaEquipo, setReservaEquipo] = useState([])
  const [filterText, setFilterText] = useState("")
  const [selectedReserva, setSelectedReserva] = useState(null)

  // 🔹 Lógica de Agrupación
  const groupedData = useMemo(() => {
    const groups = {};
    
    ReservaEquipo.forEach(item => {
      const resId = item.Id_Reserva;
      if (!groups[resId]) {
        groups[resId] = {
          ...item,
          equiposList: []
        };
      }
      groups[resId].equiposList.push({
        nombre: item.Equipo?.nombre || `Equipo ${item.Id_Equipo}`,
        cantidad: item.Can_Equipos
      });
    });

    return Object.values(groups);
  }, [ReservaEquipo]);

  // 🔹 Buscador
  const filteredData = groupedData.filter((item) => {
    const text = filterText.toLowerCase();
    return (
      item.Id_Reserva?.toString().includes(text) ||
      item.Reserva?.Nom_Solicitante?.toLowerCase().includes(text) ||
      item.equiposList.some(e => e.nombre?.toLowerCase().includes(text))
    );
  });

  const columnsTable = [
    { 
        name: 'ID RESERVA', 
        selector: row => row.Id_Reserva,
        sortable: true,
        width: '120px'
    },
    { 
        name: 'SOLICITANTE', 
        selector: row => row.Reserva?.Nom_Solicitante || 'N/A',
        sortable: true,
        grow: 2
    },
    { 
      name: 'EQUIPOS', 
      center: true,
      width: '150px',
      cell: row => (
        <button 
          className="btn btn-sm btn-outline-primary fw-bold rounded-pill px-3 shadow-none"
          data-bs-toggle="modal" 
          data-bs-target="#equiposListModal"
          onClick={() => setSelectedReserva(row)}
        >
          <i className="fa-solid fa-microscope me-2"></i>
          {row.equiposList.length}
        </button>
      )
    }
  ]

  useEffect(() => {
    getAllReservaEquipo()
  }, [])

  const getAllReservaEquipo = async () => {
    try {
        const response = await apiAxios.get('/api/ReservaEquipo')
        setReservaEquipo(response.data)
    } catch (error) {
        console.error("Error cargando Reserva-Equipo:", error)
    }
  }

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-5" style={{ paddingTop: '2rem' }}>
        <h2 className="mb-4 fw-bold text-dark"><i className="fa-solid fa-microscope me-2 text-primary"></i>Equipos por Reserva</h2>
        
        <div className="row mb-4">
          <div className="col-12 col-md-4">
            <input 
              className="form-control shadow-sm" 
              placeholder="Buscar por reserva, solicitante o equipo..." 
              value={filterText} 
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>

        <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
            <DataTable
                columns={columnsTable}
                data={filteredData}
                keyField="Id_Reserva"
                pagination
                highlightOnHover
                responsive
                noDataComponent={
                  <div className="text-center py-5 text-muted">
                    <i className="fa-solid fa-microscope fs-1 mb-3 d-block opacity-25"></i>
                    No se encontraron registros.
                  </div>
                }
            />
        </div>

        {/* Modal Lista de Equipos */}
        <div className="modal fade" id="equiposListModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="fa-solid fa-clipboard-list me-2"></i>
                  Reserva #{selectedReserva?.Id_Reserva} - {selectedReserva?.Reserva?.Nom_Solicitante}
                </h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body p-0">
                <div className="list-group list-group-flush">
                  {selectedReserva?.equiposList.map((e, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <i className="fa-solid fa-microscope text-primary"></i>
                        </div>
                        <span className="fw-semibold text-dark">{e.nombre}</span>
                      </div>
                      <span className="badge bg-secondary rounded-pill px-3">Cant: {e.cantidad}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-0 bg-light">
                <button type="button" className="btn btn-secondary px-4 fw-bold" data-bs-dismiss="modal">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CrudReservaEquipo