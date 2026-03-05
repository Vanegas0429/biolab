import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const MySwal = withReactContent(Swal)

const Sup_PlantasForm = ({ hideModal, rowToEdit }) => {
const [Estado, setEstado] = useState("Activo");



  // Campos del formulario
  const [Num_lote, setNum_lote] = useState('');
  const [Med_Cultivo, setMed_Cultivo] = useState('');
  const [Met_Propagacion, setMet_Propagacion] = useState('');
  const [Fc_Iniciales, setFc_Iniciales] = useState('');
  const [Fc_Bacterias, setFc_Bacterias] = useState('');
  const [Fc_Hongos, setFc_Hongos] = useState('');
  const [Fs_Desarrollo, setFs_Desarrollo] = useState('');
  const [Fra_Desarrollo, setFra_Desarrollo] = useState('');
  const [Fd_BR, setFd_BR] = useState('');
  const [Fd_RA, setFd_RA] = useState('');
  const [Fd_CA, setFd_CA] = useState('');
  const [Fd_MOR, setFd_MOR] = useState('');
  const [Fd_GER, setFd_GER] = useState('');
  const [Num_endurecimiento, setNum_endurecimiento] = useState('');

  const [Producciones, setProducciones] = useState([]);
  const [Especies, setEspecies] = useState([]);

  const [Id_produccion, setId_produccion] = useState('');
  const [Id_especie, setId_especie] = useState('');
  
useEffect(() => {
  if (rowToEdit) {
    // EDITAR: llenar campos con los datos del registro
    setNum_lote(rowToEdit.Num_lote ?? '');
    setMed_Cultivo(rowToEdit.Med_Cultivo ?? '');
    setMet_Propagacion(rowToEdit.Met_Propagacion ?? '');
    setFc_Iniciales(rowToEdit.Fc_Iniciales ?? '');
    setFc_Bacterias(rowToEdit.Fc_Bacterias ?? '');
    setFc_Hongos(rowToEdit.Fc_Hongos ?? '');
    setFs_Desarrollo(rowToEdit.Fs_Desarrollo ?? '');
    setFra_Desarrollo(rowToEdit.Fra_Desarrollo ?? '');
    setFd_BR(rowToEdit.Fd_BR ?? '');
    setFd_RA(rowToEdit.Fd_RA ?? '');
    setFd_CA(rowToEdit.Fd_CA ?? '');
    setFd_MOR(rowToEdit.Fd_MOR ?? '');
    setFd_GER(rowToEdit.Fd_GER ?? '');
    setNum_endurecimiento(rowToEdit.Num_endurecimiento ?? '');
    setId_produccion(rowToEdit.Id_produccion ?? '');
    setId_especie(rowToEdit.Id_especie ?? '');
  } else {
    // CREAR: limpiar todos los campos
    setEstado("Activo");
    setNum_lote('');
    setMed_Cultivo('');
    setMet_Propagacion('');
    setFc_Iniciales('');
    setFc_Bacterias('');
    setFc_Hongos('');
    setFs_Desarrollo('');
    setFra_Desarrollo('');
    setFd_BR('');
    setFd_RA('');
    setFd_CA('');
    setFd_MOR('');
    setFd_GER('');
    setNum_endurecimiento('');
    setId_produccion('');
    setId_especie('');
  }
}, [rowToEdit]);



  const textFormButton = "Enviar";

  // Opciones fijas
  const lotes = ["1", "2", "3"];
  const fcOpciones = ["1", "2", "3"];
  const mediosCultivo = ["MyS", "MyS carbon"];
  const metPropagacion = ["Siembra", "Repique"];

  useEffect(() => {
    getProduccion();
    getEspecie();
  }, []);

  const getProduccion = async () => {
    try {
      const res = await apiAxios.get('/api/Produccion');
      setProducciones(res.data);
    } catch (error) {
      console.log("No se pudo cargar Producción");
    }
  };

  const getEspecie = async () => {
    try {
      const res = await apiAxios.get('/api/Especie');
      setEspecies(res.data);
    } catch (error) {
      console.log("No se pudo cargar Especies");
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
    Fra_Desarrollo,
    Fd_BR,
    Fd_RA,
    Fd_CA,
    Fd_MOR,
    Fd_GER,
    Num_endurecimiento,
    Id_produccion: Number(Id_produccion),
    Id_especie: Number(Id_especie),
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
      Fra_Desarrollo,
      Fd_BR,
      Fd_RA,
      Fd_CA,
      Fd_MOR,
      Fd_GER,
      Num_endurecimiento,
      Id_produccion: Number(Id_produccion),
      Id_especie: Number(Id_especie),
      Estado: rowToEdit.Estado || "Activo"
    }
  );
};

const gestionarForm = async (e) => {
  e.preventDefault();

  if (!Num_lote || !Med_Cultivo || !Met_Propagacion || !Id_produccion || !Id_especie) {
     MySwal.fire({
        title: "Error",
        text: "Por favor completa todos los campos obligatorios",
        icon: "error"
      });
    return;
  }

  try {
    if (rowToEdit) {
      await actualizarSup_Planta(); // ✏️ EDITAR
       MySwal.fire({
          title: "Actualizado",
          text: "Supervisión actualizada correctamente",
          icon: "success"
        });
    } else {
      await crearSup_Planta(); // ➕ NUEVO
       MySwal.fire({
          title: "Creación",
          text: "Supervisión creada correctamente",
          icon: "success"
        });
    }


    hideModal(); 
  } catch (error) {
    console.error("Error al guardar supervisión:", error);
      MySwal.fire({
      title:"Error",
      text: "Error al guardar la supervisión",
      icon: "success"
    })
  }
};


  return (
    <form onSubmit={gestionarForm} className="col-16 col-md-6">

      {/* Num_lote */}
      <div className="mb-3">
        <label htmlFor="Num_lote">Num de Lote:</label>
        <select id="Num_lote" className="form-control" value={Num_lote} onChange={e => setNum_lote(e.target.value)}>
          <option value="">Selecciona uno</option>
          {lotes.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Especie */}
      <div className="mb-3">
        <label>Especie:</label>
        <select className="form-control" value={Id_especie} onChange={e => setId_especie(Number(e.target.value))}>
          <option value="">Selecciona</option>
          {Especies.map(e => (
            <option key={e.Id_especie} value={e.Id_especie}>
              {e.Nom_especie}
            </option>
          ))}
        </select>
      </div>

      {/* Fc_Iniciales */}
      <div className="mb-3">
        <label htmlFor="Fc_Iniciales">Fc Iniciales:</label>
        <input type="number" id="Fc_Iniciales" className="form-control" value={Fc_Iniciales} onChange={e => setFc_Iniciales(e.target.value)} />
      </div>

      {/* Medio de Cultivo */}
      <div className="mb-3">
        <label htmlFor="Med_Cultivo">Medio de Cultivo:</label>
        <select id="Med_Cultivo" className="form-control" value={Med_Cultivo} onChange={e => setMed_Cultivo(e.target.value)}>
          <option value="">Selecciona uno</option>
          {mediosCultivo.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Método de Propagación */}
      <div className="mb-3">
        <label htmlFor="Met_Propagacion">Método de Propagación:</label>
        <select id="Met_Propagacion" className="form-control" value={Met_Propagacion} onChange={e => setMet_Propagacion(e.target.value)}>
          <option value="">Selecciona uno</option>
          {metPropagacion.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Frascos contaminados */}
      <div className="mb-3">
        <label htmlFor="Fc_Bacterias">Frascos contaminados:</label>
      </div>

      <div className="mb-3">
        <label htmlFor="Fc_Bacterias">Bacterias:</label>
        <input type="number" id="Fc_Bacterias" className="form-control" value={Fc_Bacterias} onChange={e => setFc_Bacterias(e.target.value)} />

        <label htmlFor="Fc_Hongos" className="mt-2">Hongos:</label>
        <input type="number" id="Fc_Hongos" className="form-control" value={Fc_Hongos} onChange={e => setFc_Hongos(e.target.value)} />
      </div>

      {/* Frascos con y sin desarrollo */}
      <div className="mb-3">
        <label htmlFor="Fs_Desarrollo">Frascos sin desarrollo:</label>
        <input type="number" id="Fs_Desarrollo" className="form-control" value={Fs_Desarrollo} onChange={e => setFs_Desarrollo(e.target.value)} />
      </div>

      {/* Detalles Fd */}
      <div className="mb-3">
        <label htmlFor="Fra_Desarrollo" className="mt-2">Frascos con desarrollo:</label>
      </div>

      <div className="mb-3">
        <label>BR:</label>
        <input type="number" className="form-control" value={Fd_BR} onChange={e => setFd_BR(e.target.value)} />

        <label>RA:</label>
        <input type="number" className="form-control" value={Fd_RA} onChange={e => setFd_RA(e.target.value)} />

        <label>CA:</label>
        <input type="number" className="form-control" value={Fd_CA} onChange={e => setFd_CA(e.target.value)} />

        <label>MOR:</label>
        <input type="number" className="form-control" value={Fd_MOR} onChange={e => setFd_MOR(e.target.value)} />

        <label>GER:</label>
        <input type="number" className="form-control" value={Fd_GER} onChange={e => setFd_GER(e.target.value)} />
      </div>

      {/* Num endurecimiento */}
      <div className="mb-3">
        <label htmlFor="Num_endurecimiento">Número de Endurecimiento:</label>
        <input type="number" id="Num_endurecimiento" className="form-control" value={Num_endurecimiento} onChange={e => setNum_endurecimiento(e.target.value)} />
      </div>

      {/* Producción */}
      <div className="mb-3">
        <label>Producción:</label>
        <select className="form-control" value={Id_produccion} onChange={e => setId_produccion(Number(e.target.value))}>
          <option value="">Selecciona</option>
          {Producciones.map(p => (
            <option key={p.Id_produccion} value={p.Id_produccion}>
              {p.Tip_produccion} {p.Cod_produccion}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary mt-3 w-50">{textFormButton}</button>

      
      
    </form>
  );
};

export default Sup_PlantasForm; 
