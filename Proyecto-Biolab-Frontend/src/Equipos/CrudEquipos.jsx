import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import DataTable from "react-data-table-component";
import EquiposForm from "./EquiposForm";   // IMPORTANTE

const CrudEquipos = () => {

  const [Equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");

  const columnsTable = [ //crear un arreglo con las columnas que contendra la tabla
    {name: 'Id_Equipo', selector: row => row.id_equipo},
    {name: 'Nombre', selector: row => row.nombre},
    {name: 'Marca', selector: row => row.marca},
    {name: 'Grupo', selector: row => row.grupo},
    {name: 'Linea', selector: row => row.linea},
    {name: 'Centro de costos', selector: row => row.centro_costos},
    {name: 'Subcentro de costos', selector: row => row.subcentro_costos},
    {name: 'Observaciones', selector: row => row.observaciones}
]   

  useEffect(() => {
    getAllEquipos();
  }, []);

  const getAllEquipos = async () => {
    const response = await apiAxios.get("/api/equipo");
    setEquipos(response.data);
  };

  const newListEquipos = Equipos.filter((uso) => {
    const t = filterText.toLowerCase();
    return (
      uso.nombre?.toLowerCase().includes(t) ||
      uso.grupo?.toLowerCase().includes(t) ||
      uso.centro_costos?.toLowerCase().includes(t)
    );
  });

  return (
    <>
      <div className="container mt-5">

        {/* Buscador + Botón */}
        <div className="row d-flex justify-content-between mb-3">
          <div className="col-4">
            <input
              className="form-control"
              placeholder="Buscar..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="col-2">
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalEquipos"
            >
              Agregar Equipo
            </button>
          </div>
        </div>

        {/* Tabla */}
        <DataTable
          title="Equipos"
          columns={columnsTable}
          data={newListEquipos}
          keyField="Id_Equipo"
          pagination
          highlightOnHover
          striped
        />

        {/* Modal Único */}
        <div
          className="modal fade"
          id="modalEquipos"
          tabIndex="-1"
          aria-labelledby="modalEquiposLabel"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalEquiposLabel">
                  Registrar Equipo
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                {/* Aquí va el formulario */}
                <EquiposForm />
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default CrudEquipos;
