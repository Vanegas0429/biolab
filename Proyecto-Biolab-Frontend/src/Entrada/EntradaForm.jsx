import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import SearchableSelect from "../components/SearchableSelect.jsx";

const MySwal = withReactContent(Swal);

const EntradaForm = ({ hideModal, refreshList, rowToEdit, userRol }) => {
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
      setFec_Vencimiento(rowToEdit.Fec_Vencimiento ? rowToEdit.Fec_Vencimiento.split('T')[0] : '');
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

  const textFormButton = rowToEdit ? "Actualizar" : "Enviar";

  // Opciones fijas
  const UnidadMedida = ["g", "L", "mL", "lbs", "kg"];

  useEffect(() => {
    getReactivo();
  }, []);

  const getReactivo = async () => {
    try {
      const res = await apiAxios.get('/api/Reactivo');
      setReactivos(res.data || []);
    } catch (error) {
      console.log("No se pudo cargar Reactivo");
    }
  };

  const parseDecimal = (val) => {
    if (val === null || val === undefined || val === '') return 0;
    const normalized = String(val).replace(',', '.').trim();
    const num = parseFloat(normalized);
    return isNaN(num) ? 0 : num;
  };

  // CREAR
  const crearEntrada = async () => {
    const valInicial = parseDecimal(Can_Inicial);
    return apiAxios.post('/api/Entrada', {
      Lote,
      Uni_Medida,
      Can_Inicial: valInicial,
      Can_Existente: valInicial,
      Fec_Vencimiento,
      Id_reactivo: Number(Id_Reactivo),
      Estado: "Activo"
    });
  };

  // ACTUALIZAR
  const actualizarEntrada = async () => {
    return apiAxios.put(
      `/api/Entrada/${rowToEdit.Id_Entrada}`,
      {
        Lote,
        Uni_Medida,
        Can_Inicial: parseDecimal(Can_Inicial),
        Can_Existente: parseDecimal(Can_Existente),
        Fec_Vencimiento,
        Id_reactivo: Number(Id_Reactivo),
        Estado: rowToEdit?.Estado || "Activo"
      }
    );
  };

  const gestionarForm = async (e) => {
    e.preventDefault();

    const valInicial = parseDecimal(Can_Inicial);
    if (!Lote || valInicial <= 0 || !Id_Reactivo) {
      MySwal.fire({
        title: "Error",
        text: "Por favor completa todos los campos obligatorios con valores válidos",
        icon: "error"
      });
      return;
    }

    try {
      if (rowToEdit) {
        await actualizarEntrada();
        MySwal.fire({
          title: "Actualizado",
          text: "Entrada actualizada",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await crearEntrada();
        MySwal.fire({
          title: "Registrado",
          text: "Entrada registrada",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }

      if (hideModal) hideModal();
      if (refreshList) await refreshList();
    } catch (error) {
      console.error("Error al guardar Entrada:", error);
      MySwal.fire({
        title: "Error",
        text: "Error al guardar la Entrada",
        icon: "error"
      });
    }
  };

  return (
    <form onSubmit={gestionarForm} noValidate className="container-fluid">
      <div className="row g-3">
        {/* Reactivo con búsqueda */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Reactivo:</label>
          <SearchableSelect
            options={Reactivos.map(p => ({
              value: p.Id_Reactivo,
              label: p.Nom_reactivo,
              subLabel: p.Presentacion ? `(${p.Presentacion})` : ''
            }))}
            value={Id_Reactivo}
            onChange={val => setId_Reactivo(val ? Number(val) : '')}
            placeholder="Selecciona un reactivo"
            searchPlaceholder="Buscar reactivo por nombre..."
            required
          />
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
            required
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
            required
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
            step="0.1"
            min="0"
            id="Can_Inicial"
            className="form-control rounded-pill shadow-sm"
            value={Can_Inicial}
            onChange={e => setCan_Inicial(e.target.value)}
            placeholder="0.0"
            required
            disabled={Boolean(rowToEdit) && userRol !== 'administrador'}
          />
          {Boolean(rowToEdit) && userRol !== 'administrador' && (
            <small className="text-muted d-block mt-1 ms-2">
              <i className="fa-solid fa-lock me-1"></i>Solo el administrador puede editar la cantidad inicial
            </small>
          )}
        </div>

        {/* Si se está editando, mostrar Cantidad Existente */}
        {Boolean(rowToEdit) && (
          <div className="col-md-6">
            <label htmlFor="Can_Existente" className="form-label fw-bold">Cantidad Existente (Stock Actual):</label>
            <input
              type="number"
              step="0.1"
              min="0"
              id="Can_Existente"
              className="form-control rounded-pill shadow-sm"
              value={Can_Existente}
              onChange={e => setCan_Existente(e.target.value)}
              placeholder="0.0"
              disabled={userRol !== 'administrador'}
            />
          </div>
        )}

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
            <i className={`fa-solid ${rowToEdit ? 'fa-rotate' : 'fa-paper-plane'} me-2`}></i>
            {textFormButton}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EntradaForm;
