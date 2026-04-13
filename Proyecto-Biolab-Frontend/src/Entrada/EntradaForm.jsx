import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const EntradaForm = ({ hideModal, rowToEdit }) => {
const [Estado, setEstado] = useState("Activo");



  // Campos del formulario
  const [Lote, setLote] = useState('');
  const [Uni_Medida, setUni_Medida] = useState('');
  const [Can_Inicial, setCan_Inicial] = useState('');
  const [Can_Salida, setCan_Salida] = useState('');
  const [Fec_Vencimiento, setFec_Vencimiento] = useState('');

  const [Reactivos, setReactivos] = useState([]);

  const [Id_Reactivo, setId_Reactivo] = useState('');
  
useEffect(() => {
  if (rowToEdit) {
    // EDITAR: llenar campos con los datos del registro
    setLote(rowToEdit.Lote ?? '');
    setUni_Medida(rowToEdit.Uni_Medida ?? '');
    setCan_Inicial(rowToEdit.Can_Inicial ?? '');
    setCan_Salida(rowToEdit.Can_Salida ?? '');
    setFec_Vencimiento(rowToEdit.Fec_Vencimiento ?? '');
    setId_Reactivo(rowToEdit.Id_Reactivo ?? '');
    setEstado(rowToEdit.Estado ?? "Activo");
  } else {
    // CREAR: limpiar todos los campos
    setEstado("Activo");
    setLote('');
    setUni_Medida('');
    setCan_Inicial('');
    setCan_Salida('');
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
    Can_Salida,
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
      Can_Salida,
      Fec_Vencimiento,
      Id_reactivo: Number(Id_Reactivo),
      Estado: rowToEdit?.Estado || "Activo"
    }
  );
};

const gestionarForm = async (e) => {
  e.preventDefault();

  if ( !Lote|| !Can_Inicial || !Can_Salida || !Id_Reactivo) {
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
          icon: "success"
        });
    } else {
      await crearEntrada(); // ➕ NUEVO
       MySwal.fire({
          title: "Creación",
          text: "Entrada creada correctamente",
          icon: "success"
        });
    }


    hideModal(); 
  } catch (error) {
    console.error("Error al guardar Entrada:", error);
      MySwal.fire({
      title:"Error",
      text: "Error al guardar la Entrada",
      icon: "success"
    })
  }
};


  return (
    <form onSubmit={gestionarForm} className="col-16 col-md-6">

      <div className="mb-3">
        <label>Reactivo:</label>
        <select className="form-control" value={Id_Reactivo} onChange={e => setId_Reactivo(Number(e.target.value))}>
          <option value="">Selecciona</option>
          {Reactivos.map(p => (
            <option key={p.Id_Reactivo} value={p.Id_Reactivo}>
              {p.Nom_reactivo}
            </option>
          ))}
        </select>
      </div>


      <div className="mb-3">
        <label htmlFor="Lote">Lote:</label>
        <input type="text" id="Lote" className="form-control" value={Lote} onChange={e => setLote(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Uni_Medida">Unidad de Medida:</label>
        <select id="Uni_Medida" className="form-control" value={Uni_Medida} onChange={e => setUni_Medida(e.target.value)}>
          <option value="">Selecciona uno</option>
          {UnidadMedida.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="Can_Inicial">Cantida Inical:</label>
        <input type="number" id="Can_Inicial" className="form-control" value={Can_Inicial} onChange={e => setCan_Inicial(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Can_Salida">Cantidad Salida:</label>
        <input type="number" id="Can_Salida" className="form-control" value={Can_Salida} onChange={e => setCan_Salida(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Fec_Vencimiento">Fecha Vencimiento:</label>
        <input type="date" id="Fec_Vencimiento" className="form-control" value={Fec_Vencimiento} onChange={e => setFec_Vencimiento(e.target.value)} />
      </div>
      <button className="btn btn-primary mt-3 w-50">{textFormButton}</button>

      
      
    </form>
  );
};

export default EntradaForm; 
