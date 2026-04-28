import { useState, useEffect, useMemo } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudReservaMaterial = () => {

  const [ReservaMaterial, setReservaMaterial] = useState([])
  const [filterText, setFilterText] = useState("")
  const [selectedReserva, setSelectedReserva] = useState(null)

  // 🔹 Lógica de Agrupación
  const groupedData = useMemo(() => {
    const groups = {};
    
    ReservaMaterial.forEach(item => {
      const resId = item.Id_Reserva;
      if (!groups[resId]) {
        groups[resId] = {
          ...item,
          materialesList: []
        };
      }
      groups[resId].materialesList.push({
        nombre: item.Material?.Nom_Material || `Material ${item.Id_Material}`,
        cantidad: item.Can_Materiales
      });
    });

    return Object.values(groups);
  }, [ReservaMaterial]);

  // 🔹 Buscador
  const filteredData = groupedData.filter((item) => {
    const text = filterText.toLowerCase();
    return (
      item.Id_Reserva?.toString().includes(text) ||
      item.Reserva?.Nom_Solicitante?.toLowerCase().includes(text) ||
      item.materialesList.some(m => m.nombre?.toLowerCase().includes(text))
    );
  });

  const columnsTable = [
    { 
        name: 'ID Reserva', 
        selector: row => row.Id_Reserva,
        sortable: true,
        width: '120px'
    },
    { 
        name: 'Solicitante', 
        selector: row => row.Reserva?.Nom_Solicitante || 'N/A',
        sortable: true,
        grow: 2
    },
    { 
      name: 'Materiales', 
      cell: row => (
        <button 
          className="btn btn-sm btn-outline-primary fw-bold"
          data-bs-toggle="modal" 
          data-bs-target="#materialesListModal"
          onClick={() => setSelectedReserva(row)}
        >
          <i className="fa-solid fa-box-archive me-2"></i>
          {row.materialesList.length} {row.materialesList.length === 1 ? 'Material' : 'Materiales'}
        </button>
      )
    }
  ]

  useEffect(() => {
    getAllReservaMaterial()
  }, [])

  const getAllReservaMaterial = async () => {
    try {
        const response = await apiAxios.get('/api/ReservaMaterial')
        setReservaMaterial(response.data)
    } catch (error) {
        console.error("Error cargando Reserva-Material:", error)
    }
  }

  return (
    <>
      <div className="container-fluid px-4 px-md-5 mt-5" style={{ paddingTop: '2rem' }}>
        <h2 className="mb-4 fw-bold text-dark"><i className="fa-solid fa-boxes-stacked me-2 text-primary"></i>Materiales por Reserva</h2>
        
        <div className="row mb-4">
          <div className="col-12 col-md-4">
            <input 
              className="form-control shadow-sm" 
              placeholder="Buscar por reserva, solicitante o material..." 
              value={filterText} 
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>

        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
            <DataTable
                columns={columnsTable}
                data={filteredData}
                keyField="Id_Reserva"
                pagination
                highlightOnHover
                responsive
                noDataComponent={<div className="p-4">No se encontraron registros</div>}
                customStyles={{
                    header: { style: { minHeight: '56px' } },
                    headRow: {
                        style: {
                            backgroundColor: '#f8f9fa',
                            borderTopStyle: 'solid',
                            borderTopWidth: '1px',
                            borderTopColor: '#dee2e6',
                        },
                    },
                    headCells: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            color: '#495057',
                            textTransform: 'uppercase'
                        },
                    },
                }}
            />
        </div>

        {/* Modal Lista de Materiales */}
        <div className="modal fade" id="materialesListModal" tabIndex="-1" aria-hidden="true">
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
                  {selectedReserva?.materialesList.map((m, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <i className="fa-solid fa-box text-primary"></i>
                        </div>
                        <span className="fw-semibold text-dark">{m.nombre}</span>
                      </div>
                      <span className="badge bg-secondary rounded-pill px-3">Cant: {m.cantidad}</span>
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

export default CrudReservaMaterial