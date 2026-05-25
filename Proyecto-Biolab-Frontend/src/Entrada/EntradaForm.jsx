import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const EntradaForm = ({ hideModal, refreshList, rowToEdit }) => {
  const [Estado, setEstado] = useState("Activo");

  // Campos del formulario
  const [Lote, setLote] = useState('');
  const [Uni_Medida, setUni_Medida] = useState('');
  const [Can_Inicial, setCan_Inicial] = useState('');
  const [Can_Existente, setCan_Existente] = useState('');
  const [Fec_Vencimiento, setFec_Vencimiento] = useState('');

  const [Reactivos, setReactivos] = useState([]);

  const [Id_Reactivo, setId_Reactivo] = useState('');

  useEffect(() => {
    if (rowToEdit) {
      // EDITAR: llenar campos con los datos del registro
      setLote(rowToEdit.Lote ?? '');
      setUni_Medida(rowToEdit.Uni_Medida ?? '');
      setCan_Inicial(rowToEdit.Can_Inicial ?? '');
      setCan_Existente(rowToEdit.Can_Existente ?? '');
      setFec_Vencimiento(rowToEdit.Fec_Vencimiento ?? '');
      setId_Reactivo(rowToEdit.Id_reactivo ?? rowToEdit.Id_Reactivo ?? '');
      setEstado(rowToEdit.Estado ?? "Activo");
    } else {
      // CREAR: limpiar todos los campos
      setEstado("Activo");
      setLote('');
      setUni_Medida('');
      setCan_Inicial('');
      setCan_Existente('');
      setFec_Vencimiento('');
      setId_Reactivo('');
    }
  }, [rowToEdit]);



  const textFormButton = "Enviar";

  // Opciones fijas
  const UnidadMedida = ["gr", "L", "mL"];

  useEffect(() => {
    getReactivo();
  }, []);

  const getReactivo = async () => {
    try {
      const res = await apiAxios.get('/api/Reactivo');
      setReactivos(res.data);
    } catch (error) {
      console.log("No se pudo cargar Reactivo");
    }
  };

  //CREAR
  const crearEntrada = async () => {
    return apiAxios.post('/api/Entrada', {
      Lote,
      Uni_Medida,
      Can_Inicial,
      Can_Existente: Number(Can_Inicial),
      Fec_Vencimiento,
      Id_reactivo: Number(Id_Reactivo),
      Estado: "Activo"
    });
  };

  //ACTUALIZAR
  const actualizarEntrada = async () => {
    return apiAxios.put(
      `/api/Entrada/${rowToEdit.Id_Entrada}`,
      {
        Lote,
        Uni_Medida,
        Can_Inicial,
        Can_Existente: Number(Can_Existente),
        Fec_Vencimiento,
        Id_reactivo: Number(Id_Reactivo),
        Estado: rowToEdit?.Estado || "Activo"
      }
    );
  };

  const gestionarForm = async (e) => {
    e.preventDefault();

    if (!Lote || !Can_Inicial || !Id_Reactivo) {
      MySwal.fire({
        title: "Error",
        text: "Por favor completa todos los campos obligatorios",
        icon: "error"
      });
      return;
    }

    try {
      if (rowToEdit) {
        await actualizarEntrada(); // ✏️ EDITAR
        MySwal.fire({
          title: "Actualizado",
          text: "Entrada actualizada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await crearEntrada(); // ➕ NUEVO
        MySwal.fire({
          title: "Creación",
          text: "Entrada creada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }

      refreshList();
      hideModal();
    } catch (error) {
      console.error("Error al guardar Entrada:", error);
      MySwal.fire({
        title: "Error",
        text: "Error al guardar la Entrada",
        icon: "error"
      })
    }
  };


  return (
    <form onSubmit={gestionarForm} className="container-fluid">
      <div className="row g-3">
        {/* Reactivo */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Reactivo:</label>
          <select
            className="form-select rounded-pill shadow-sm"
            value={Id_Reactivo}
            onChange={e => setId_Reactivo(Number(e.target.value))}
          >
            <option value="">Selecciona un reactivo</option>
            {Reactivos.map(p => (
              <option key={p.Id_Reactivo} value={p.Id_Reactivo}>
                {p.Nom_reactivo}
              </option>
            ))}
          </select>
        </div>

        {/* Lote */}
        <div className="col-md-6">
          <label htmlFor="Lote" className="form-label fw-bold">Lote:</label>
          <input
            type="text"
            id="Lote"
            className="form-control rounded-pill shadow-sm"
            value={Lote}
            onChange={e => setLote(e.target.value)}
            placeholder="Ingrese el lote"
          />
        </div>

        {/* Unidad de Medida */}
        <div className="col-md-6">
          <label htmlFor="Uni_Medida" className="form-label fw-bold">Unidad de Medida:</label>
          <select
            id="Uni_Medida"
            className="form-select rounded-pill shadow-sm"
            value={Uni_Medida}
            onChange={e => setUni_Medida(e.target.value)}
          >
            <option value="">Selecciona unidad</option>
            {UnidadMedida.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Cantidad Inicial */}
        <div className="col-md-6">
          <label htmlFor="Can_Inicial" className="form-label fw-bold">Cantidad Inicial:</label>
          <input
            type="number"
            id="Can_Inicial"
            className="form-control rounded-pill shadow-sm"
            value={Can_Inicial}
            onChange={e => setCan_Inicial(e.target.value)}
            placeholder="0"
          />
        </div>

        {/* Fecha Vencimiento */}
        <div className="col-md-6">
          <label htmlFor="Fec_Vencimiento" className="form-label fw-bold">Fecha Vencimiento:</label>
          <input
            type="date"
            id="Fec_Vencimiento"
            className="form-control rounded-pill shadow-sm"
            value={Fec_Vencimiento}
            onChange={e => setFec_Vencimiento(e.target.value)}
          />
        </div>

        <div className="col-12 text-center mt-4">
          <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">
            <i className="fa-solid fa-paper-plane me-2"></i>
            {textFormButton}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EntradaForm; 
