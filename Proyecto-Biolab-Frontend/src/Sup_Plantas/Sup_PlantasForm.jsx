import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig.js";

const Sup_PlantasForm = ({ hideModal }) => {

  // Campos del formulario
  const [Num_lote, setNum_lote] = useState('');
  const [Med_Cultivo, setMed_Cultivo] = useState('');
  const [Met_Propagacion, setMet_Propagacion] = useState('');
  const [Fc_Iniciales, setFc_Iniciales] = useState('');
  const [Fra_Contaminados, setFra_Contaminados] = useState('');
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
  




  const [textFormButton] = useState('Enviar');

  useEffect(() => {
    getProduccion();
    getEspecie();
  }, []);

  const getProduccion = async () => {
    try {
      const res = await apiAxios.get('/api/Produccion');
      setProducciones(res.data);
    } catch (error) {
      console.log("Error cargando Producción:", error);
    }
  };

  const getEspecie = async () => {
    try {
      const res = await apiAxios.get('/api/Especie');
      setEspecies(res.data);
    } catch (error) {
      console.log("Error cargando especies:", error);
    }
  };

  const gestionarForm = async (e) => {
    e.preventDefault();

    try {
      await apiAxios.put('/api/Sup_Plantas', {
        Num_lote,
        Med_Cultivo,
        Met_Propagacion,
        Fc_Iniciales,
        Fra_Contaminados,
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
        Id_especie: Number(Id_especie)
      });

      alert('Supervisión creada correctamente');
      hideModal();

    } catch (error) {
      console.error("Error al registrar supervisión:", error);
      alert("Error al registrar");
    }
  };

  return (
    <form onSubmit={gestionarForm} encType="multipart/form-data" className="col-12 col-md-6">
      <div className="mb-3">
        <label htmlFor="Num_lote" className="form-label">Num_lote:</label>
        <select id="Num_lote" className="form-control" value={Num_lote} onChange={(e) => setNum_lote(e.target.value)}>
          <option value="">Selecciona uno</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="Fc_Iniciales" className="form-label">Fc_Iniciales:</label>
        <select id="Fc_Iniciales" className="form-control" value={Fc_Iniciales} onChange={(e) => setFc_Iniciales(e.target.value)}>
          <option value="">Selecciona uno</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="Med_Cultivo" className="form-label">Medio de Cultivo:</label>
        <select id="Med_Cultivo" className="form-control" value={Med_Cultivo} onChange={(e) => setMed_Cultivo(e.target.value)}>
          <option value="">Selecciona uno</option>
          <option value="1">MyS</option>
          <option value="2">MyS carbon</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="Met_Propagacion" className="form-label">Metodo de propagacion:</label>
        <select id="Met_Propagacion" className="form-control" value={Met_Propagacion} onChange={(e) => setMet_Propagacion(e.target.value)}>
          <option value="">Selecciona uno</option>
          <option value="1">Siembra</option>
          <option value="2">Repique</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="Fra_Contaminados" className="form-label">Frascos Contaminados con: </label>
        <label htmlFor="Fc_Bacterias" className="form-label">Bacterias:</label>
        <input type="number" id="Fc_Bacterias" className="form-control" value={Fc_Bacterias} onChange={(e) => setFc_Bacterias(e.target.value)} />
        <label htmlFor="Fc_Hongos" className="form-label">Hongos:</label>

        <input type="number" id="Fc_Hongos" className="form-control" value={Fc_Hongos} onChange={(e) => setFc_Hongos(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Fs_Desarrollo" className="form-label">Frascos sin desarrollo:</label>
        <input type="number" id="Fs_Desarrollo" className="form-control" value={Fs_Desarrollo} onChange={(e) => setFs_Desarrollo(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Fra_Desarrollo" className="form-label">Frascos con Desarrollo:</label>
        <input type="number" id="Fra_Desarrollo" className="form-control" value={Fra_Desarrollo} onChange={(e) => setFra_Desarrollo(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Fd_BR" className="form-label">Cuantos BR:</label>
        <input type="number" id="Fd_BR" className="form-control" value={Fd_BR} onChange={(e) => setFd_BR(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Fd_RA" className="form-label">Cuantos RA:</label>
        <input type="number" id="Fd_RA" className="form-control" value={Fd_RA} onChange={(e) => setFd_RA(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Fd_CA" className="form-label">Cuantos CA:</label>
        <input type="number" id="Fd_CA" className="form-control" value={Fd_CA} onChange={(e) => setFd_CA(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Fd_MOR" className="form-label">Cuantos MOR:</label>
        <input type="number" id="Fd_MOR" className="form-control" value={Fd_MOR} onChange={(e) => setFd_MOR(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Fd_GER" className="form-label">Cuantos GER:</label>
        <input type="number" id="Fd_GER" className="form-control" value={Fd_GER} onChange={(e) => setFd_GER(e.target.value)} />
      </div>

      <div className="mb-3">
        <label htmlFor="Num_endurecimiento" className="form-label">Num_endurecimiento:</label>
        <input type="number" id="Num_endurecimiento" className="form-control" value={Num_endurecimiento} onChange={(e) => setNum_endurecimiento(e.target.value)} />
      </div>

      <label className="form-label">Producción</label>
<select
  className="form-control"
  value={Id_produccion}
  onChange={e => setId_produccion(Number(e.target.value))}
>
  <option value="">Selecciona</option>
  {Producciones.map(p => (
    <option key={p.Id_produccion} value={p.Id_produccion}>
      {p.Tip_produccion}
      {p.Cod_produccion}
    </option>
  ))}
</select>


<label className="form-label">Especie</label>
<select
  className="form-control"
  value={Id_especie}
  onChange={e => setId_especie(Number(e.target.value))}
>
  <option value="">Selecciona</option>
  {Especies.map(e => (
    <option key={e.Id_especie} value={e.Id_especie}>
      {e.Nom_especie}
    </option>
  ))}
</select>


      <button className="btn btn-primary mt-3 w-50">
        Enviar
      </button>
    </form>
  );
};

export default Sup_PlantasForm;
