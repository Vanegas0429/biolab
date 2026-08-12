import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EntradaMaterialForm = ({ hideModal, refreshList, rowToEdit }) => {
  const [Estado, setEstado] = useState("Activo");
  const [Can_Inicial, setCan_Inicial] = useState('');
  const [Can_Existente, setCan_Existente] = useState('');
  const [Id_Material, setId_Material] = useState('');
  const [materiales, setMateriales] = useState([]);

  useEffect(() => {
    if (rowToEdit) {
      setCan_Inicial(rowToEdit.Can_Inicial ?? '');
      setCan_Existente(rowToEdit.Can_Existente ?? '');
      setId_Material(rowToEdit.Id_Material ?? '');
      setEstado(rowToEdit.Estado ?? "Activo");
    } else {
      setEstado("Activo");
      setCan_Inicial('');
      setCan_Existente('');
      setId_Material('');
    }
  }, [rowToEdit]);

  useEffect(() => {
    getMateriales();
  }, []);

  const getMateriales = async () => {
    try {
      const res = await apiAxios.get('/api/Material');
      setMateriales(res.data);
    } catch (error) {
      console.log("No se pudo cargar Materiales", error);
    }
  };

  const crearEntradaMaterial = async () => {
    return apiAxios.post('/api/EntradaMaterial', {
      Can_Inicial: Number(Can_Inicial),
      Can_Existente: Number(Can_Inicial),
      Id_Material: Number(Id_Material),
      Estado: "Activo"
    });
  };

  const actualizarEntradaMaterial = async () => {
    return apiAxios.put(
      `/api/EntradaMaterial/${rowToEdit.Id_Entrada_Material}`,
      {
        Can_Inicial: Number(Can_Inicial),
        Can_Existente: Number(Can_Existente || Can_Inicial),
        Id_Material: Number(Id_Material),
        Estado: rowToEdit?.Estado || "Activo"
      }
    );
  };

  const gestionarForm = async (e) => {
    e.preventDefault();

    if (!Can_Inicial || !Id_Material) {
      MySwal.fire({
        title: "Error",
        text: "Por favor completa todos los campos obligatorios",
        icon: "error"
      });
      return;
    }

    try {
      if (rowToEdit) {
        await actualizarEntradaMaterial();
        MySwal.fire({
          title: "Actualizado",
          text: "Entrada de material actualizada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await crearEntradaMaterial();
        MySwal.fire({
          title: "Registrado",
          text: "Entrada de material registrada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }

      refreshList();
      hideModal();
    } catch (error) {
      console.error("Error al guardar Entrada de Material:", error);
      MySwal.fire({
        title: "Error",
        text: "Error al guardar la Entrada de Material",
        icon: "error"
      });
    }
  };

  return (
    <form onSubmit={gestionarForm} className="container-fluid">
      <div className="row g-3">
        {/* Material */}
        <div className="col-md-7">
          <label className="form-label fw-bold">Material:</label>
          <select
            className="form-select rounded-pill shadow-sm px-3"
            value={Id_Material}
            onChange={e => setId_Material(Number(e.target.value))}
            required
          >
            <option value="">Selecciona un material</option>
            {materiales.map(m => (
              <option key={m.Id_Material} value={m.Id_Material}>
                {m.Nom_Material} ({m.clasificacion || 'Desechable'})
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad Inicial */}
        <div className="col-md-5">
          <label htmlFor="Can_Inicial" className="form-label fw-bold">Cantidad Ingresada:</label>
          <input
            type="number"
            id="Can_Inicial"
            className="form-control rounded-pill shadow-sm px-3"
            value={Can_Inicial}
            onChange={e => setCan_Inicial(e.target.value)}
            placeholder="0"
            min="1"
            required
          />
        </div>
        
        {/* Cantidad Existente */}
        {rowToEdit && (
          <div className="col-md-5">
            <label htmlFor="Can_Existente" className="form-label fw-bold">Cantidad Existente:</label>
            <input
              type="number"
              id="Can_Existente"
              className="form-control rounded-pill shadow-sm px-3"
              value={Can_Existente}
              onChange={e => setCan_Existente(e.target.value)}
              placeholder="0"
              min="0"
              required
            />
          </div>
        )}

        <div className="col-12 text-center mt-4">
          <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">
            <i className="fa-solid fa-paper-plane me-2"></i>
            {rowToEdit ? "Actualizar" : "Registrar Entrada"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EntradaMaterialForm;
