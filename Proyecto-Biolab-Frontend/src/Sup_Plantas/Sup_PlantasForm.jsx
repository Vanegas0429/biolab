import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const Sup_PlantasForm = ({ hideModal, refreshList, rowToEdit }) => {
  const [Estado, setEstado] = useState("Activo");



  // Campos del formulario
  const [Num_lote, setNum_lote] = useState('');
  const [Med_Cultivo, setMed_Cultivo] = useState('');
  const [Met_Propagacion, setMet_Propagacion] = useState('');
  const [Fc_Iniciales, setFc_Iniciales] = useState(0);
  const [Fc_Bacterias, setFc_Bacterias] = useState(0);
  const [Fc_Hongos, setFc_Hongos] = useState(0);
  const [Fs_Desarrollo, setFs_Desarrollo] = useState(0);
  const [Fd_BR, setFd_BR] = useState(0);
  const [Fd_RA, setFd_RA] = useState(0);
  const [Fd_CA, setFd_CA] = useState(0);
  const [Fd_MOR, setFd_MOR] = useState(0);
  const [Fd_GER, setFd_GER] = useState(0);
  const [Num_endurecimiento, setNum_endurecimiento] = useState(0);

  const [Producciones, setProducciones] = useState([]);

  const [Id_produccion, setId_produccion] = useState('');


  useEffect(() => {
    if (rowToEdit) {
      // EDITAR: llenar campos con los datos del registro
      setNum_lote(rowToEdit.Num_lote ?? '');
      setMed_Cultivo(rowToEdit.Med_Cultivo ?? '');
      setMet_Propagacion(rowToEdit.Met_Propagacion ?? '');
      setFc_Iniciales(rowToEdit.Fc_Iniciales ?? 0);
      setFc_Bacterias(rowToEdit.Fc_Bacterias ?? 0);
      setFc_Hongos(rowToEdit.Fc_Hongos ?? 0);
      setFs_Desarrollo(rowToEdit.Fs_Desarrollo ?? 0);
      setFd_BR(rowToEdit.Fd_BR ?? 0);
      setFd_RA(rowToEdit.Fd_RA ?? 0);
      setFd_CA(rowToEdit.Fd_CA ?? 0);
      setFd_MOR(rowToEdit.Fd_MOR ?? 0);
      setFd_GER(rowToEdit.Fd_GER ?? 0);
      setNum_endurecimiento(rowToEdit.Num_endurecimiento ?? 0);
      setId_produccion(rowToEdit.Id_produccion ?? '');
    } else {
      // CREAR: limpiar todos los campos
      setEstado("Activo");
      setNum_lote('');
      setMed_Cultivo('');
      setMet_Propagacion('');
      setFc_Iniciales(0);
      setFc_Bacterias(0);
      setFc_Hongos(0);
      setFs_Desarrollo(0);
      setFd_BR(0);
      setFd_RA(0);
      setFd_CA(0);
      setFd_MOR(0);
      setFd_GER(0);
      setNum_endurecimiento(0);
      setId_produccion('');
    }
  }, [rowToEdit]);



  const textFormButton = rowToEdit ? "Actualizar" : "Enviar";

  // Opciones fijas
  const lotes = ["1", "2", "3"];
  const mediosCultivo = ["MyS", "MyS carbon"];
  const metPropagacion = ["Siembra", "Repique"];

  useEffect(() => {
    getProduccion();
  }, []);

  const getProduccion = async () => {
    try {
      const res = await apiAxios.get('/api/Produccion');
      setProducciones(res.data);
    } catch (error) {
      console.log("No se pudo cargar Producción");
    }
  };
  //CREAR
  const crearSup_Planta = async () => {
    return apiAxios.post('/api/Sup_Plantas', {
      Num_lote,
      Med_Cultivo,
      Met_Propagacion,
      Fc_Iniciales,
      Fc_Bacterias,
      Fc_Hongos,
      Fs_Desarrollo,
      Fd_BR,
      Fd_RA,
      Fd_CA,
      Fd_MOR,
      Fd_GER,
      Num_endurecimiento,
      Id_produccion: Number(Id_produccion),
      Estado: "Activo"
    });
  };

  //ACTUALIZAR
  const actualizarSup_Planta = async () => {
    return apiAxios.put(
      `/api/Sup_Plantas/${rowToEdit.Id_supervision}`,
      {
        Num_lote,
        Med_Cultivo,
        Met_Propagacion,
        Fc_Iniciales,
        Fc_Bacterias,
        Fc_Hongos,
        Fs_Desarrollo,
        Fd_BR,
        Fd_RA,
        Fd_CA,
        Fd_MOR,
        Fd_GER,
        Num_endurecimiento,
        Id_produccion: Number(Id_produccion),
        Estado: rowToEdit.Estado || "Activo"
      }
    );
  };

  const handleFrascosChange = (setter) => (e) => {
    let newValue = Number(e.target.value) || 0;
    if (newValue < 0) newValue = 0;
    const iniciales = Number(Fc_Iniciales) || 0;

    // Suma de los demás campos, excluyendo el que se está modificando
    const sumOthers =
      (setter === setFc_Bacterias ? 0 : Number(Fc_Bacterias) || 0) +
      (setter === setFc_Hongos ? 0 : Number(Fc_Hongos) || 0) +
      (setter === setFs_Desarrollo ? 0 : Number(Fs_Desarrollo) || 0) +
      (setter === setFd_BR ? 0 : Number(Fd_BR) || 0) +
      (setter === setFd_RA ? 0 : Number(Fd_RA) || 0) +
      (setter === setFd_CA ? 0 : Number(Fd_CA) || 0) +
      (setter === setFd_MOR ? 0 : Number(Fd_MOR) || 0) +
      (setter === setFd_GER ? 0 : Number(Fd_GER) || 0);

    if (sumOthers + newValue > iniciales) {
      MySwal.fire({
        title: "Límite alcanzado",
        text: `No puedes exceder los frascos iniciales (${iniciales}). Te quedan ${iniciales - sumOthers} disponibles.`,
        icon: "warning",
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
    setter(newValue);
  };

  const gestionarForm = async (e) => {
    e.preventDefault();

    if (!Num_lote || !Med_Cultivo || !Met_Propagacion || !Id_produccion) {
      MySwal.fire({
        title: "Error",
        text: "Por favor completa todos los campos obligatorios",
        icon: "error"
      });
      return;
    }

    const iniciales = Number(Fc_Iniciales) || 0;
    const sumaDestino =
      (Number(Fc_Bacterias) || 0) +
      (Number(Fc_Hongos) || 0) +
      (Number(Fs_Desarrollo) || 0) +
      (Number(Fd_BR) || 0) +
      (Number(Fd_RA) || 0) +
      (Number(Fd_CA) || 0) +
      (Number(Fd_MOR) || 0) +
      (Number(Fd_GER) || 0);

    if (sumaDestino > iniciales) {
      MySwal.fire({
        title: "Error",
        text: `La suma de frascos distribuidos (${sumaDestino}) excede la cantidad de frascos iniciales (${iniciales}).`,
        icon: "error"
      });
      return;
    }

    try {
      if (rowToEdit) {
        await actualizarSup_Planta(); // ✏️ EDITAR
        MySwal.fire({
          title: "Actualizado",
          text: "Supervisión actualizada",
          icon: "success"
        });
      } else {
        await crearSup_Planta(); // ➕ NUEVO
        MySwal.fire({
          title: "Registrado", text: "Supervisión registrada",
          icon: "success"
        });
      }


      refreshList();
      hideModal();
    } catch (error) {
      console.error("Error al guardar supervisión:", error);
      MySwal.fire({
        title: "Error",
        text: "Error al guardar la supervisión",
        icon: "error"
      })
    }
  };


  return (
    <form onSubmit={gestionarForm} className="container-fluid">
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="Num_lote" className="form-label fw-bold">Num de Lote:</label>
          <select id="Num_lote" className="form-select rounded-pill shadow-sm" value={Num_lote} onChange={e => setNum_lote(e.target.value)}>
            <option value="">Selecciona uno</option>
            {lotes.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="Fc_Iniciales" className="form-label fw-bold">Fc Iniciales:</label>
          <input type="number" min="0" id="Fc_Iniciales" className="form-control rounded-pill shadow-sm" value={Fc_Iniciales} onChange={e => setFc_Iniciales(Math.max(0, Number(e.target.value)) || 0)} />
        </div>

        <div className="col-md-6">
          <label htmlFor="Med_Cultivo" className="form-label fw-bold">Medio de Cultivo:</label>
          <select id="Med_Cultivo" className="form-select rounded-pill shadow-sm" value={Med_Cultivo} onChange={e => setMed_Cultivo(e.target.value)}>
            <option value="">Selecciona uno</option>
            {mediosCultivo.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="Met_Propagacion" className="form-label fw-bold">Método de Propagación:</label>
          <select id="Met_Propagacion" className="form-select rounded-pill shadow-sm" value={Met_Propagacion} onChange={e => setMet_Propagacion(e.target.value)}>
            <option value="">Selecciona uno</option>
            {metPropagacion.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="col-12 mt-3 mb-1">
          <span className="badge bg-danger-soft text-danger fw-bold"><i className="fa-solid fa-bug me-2"></i>Frascos Contaminados</span>
        </div>

        <div className="col-md-6">
          <label htmlFor="Fc_Bacterias" className="form-label small fw-bold">Bacterias:</label>
          <input type="number" min="0" id="Fc_Bacterias" className="form-control rounded-pill shadow-sm" value={Fc_Bacterias} onChange={handleFrascosChange(setFc_Bacterias)} />
        </div>
        <div className="col-md-6">
          <label htmlFor="Fc_Hongos" className="form-label small fw-bold">Hongos:</label>
          <input type="number" min="0" id="Fc_Hongos" className="form-control rounded-pill shadow-sm" value={Fc_Hongos} onChange={handleFrascosChange(setFc_Hongos)} />
        </div>

        <div className="col-md-6">
          <label htmlFor="Fs_Desarrollo" className="form-label fw-bold">Frascos sin desarrollo:</label>
          <input type="number" min="0" id="Fs_Desarrollo" className="form-control rounded-pill shadow-sm" value={Fs_Desarrollo} onChange={handleFrascosChange(setFs_Desarrollo)} />
        </div>
        <div className="col-md-6">
          <label htmlFor="Num_endurecimiento" className="form-label fw-bold">N° Endurecimiento:</label>
          <input type="number" min="0" id="Num_endurecimiento" className="form-control rounded-pill shadow-sm" value={Num_endurecimiento} onChange={e => setNum_endurecimiento(Math.max(0, Number(e.target.value)) || 0)} />
        </div>

        <div className="col-12 mt-3 mb-1">
          <span className="badge bg-success-soft text-success fw-bold"><i className="fa-solid fa-vial me-2"></i>Frascos con Desarrollo</span>
        </div>

        <div className="col-12">
          <div className="row g-2 bg-light p-3 rounded-3 shadow-sm border border-dashed">
            <div className="col">
              <label className="form-label small fw-bold text-center d-block">BR</label>
              <input type="number" min="0" className="form-control form-control-sm rounded-pill text-center" value={Fd_BR} onChange={handleFrascosChange(setFd_BR)} />
            </div>
            <div className="col">
              <label className="form-label small fw-bold text-center d-block">RA</label>
              <input type="number" min="0" className="form-control form-control-sm rounded-pill text-center" value={Fd_RA} onChange={handleFrascosChange(setFd_RA)} />
            </div>
            <div className="col">
              <label className="form-label small fw-bold text-center d-block">CA</label>
              <input type="number" min="0" className="form-control form-control-sm rounded-pill text-center" value={Fd_CA} onChange={handleFrascosChange(setFd_CA)} />
            </div>
            <div className="col">
              <label className="form-label small fw-bold text-center d-block">MOR</label>
              <input type="number" min="0" className="form-control form-control-sm rounded-pill text-center" value={Fd_MOR} onChange={handleFrascosChange(setFd_MOR)} />
            </div>
            <div className="col">
              <label className="form-label small fw-bold text-center d-block">GER</label>
              <input type="number" min="0" className="form-control form-control-sm rounded-pill text-center" value={Fd_GER} onChange={handleFrascosChange(setFd_GER)} />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <label className="form-label fw-bold">Producción:</label>
          <select className="form-select rounded-pill shadow-sm" value={Id_produccion} onChange={e => setId_produccion(Number(e.target.value))}>
            <option value="">Selecciona una producción</option>
            {Producciones.map(p => (
              <option key={p.Id_produccion} value={p.Id_produccion}>
                {p.Especie?.Nom_especie || 'Sin Especie'} - {p.Tip_produccion} ({p.Fec_produccion})
              </option>
            ))}
          </select>
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

export default Sup_PlantasForm;