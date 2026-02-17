import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";

const EquiposForm = ({ modoEdicion, equipoEditando, recargarEquipos }) => {
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [grupo, setGrupo] = useState("");
  const [linea, setLinea] = useState("");
  const [centro_costos, setCentroCostos] = useState("");
  const [subcentro_costos, setSubcentroCostos] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    if (modoEdicion && equipoEditando) {
      setNombre(equipoEditando.nombre || "");
      setMarca(equipoEditando.marca || "");
      setGrupo(equipoEditando.grupo || "");
      setLinea(equipoEditando.linea || "");
      setCentroCostos(equipoEditando.centro_costos || "");
      setSubcentroCostos(equipoEditando.subcentro_costos || "");
      setObservaciones(equipoEditando.observaciones || "");
    } else {
      setNombre(""); setMarca(""); setGrupo(""); setLinea("");
      setCentroCostos(""); setSubcentroCostos(""); setObservaciones("");
    }
    setImagen(null);
  }, [modoEdicion, equipoEditando]);

  const gestionarForm = async (e) => {
    e.preventDefault();
    try {
      
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("marca", marca);
      formData.append("grupo", grupo);
      formData.append("linea", linea);
      formData.append("centro_costos", centro_costos);
      formData.append("subcentro_costos", subcentro_costos);
      formData.append("observaciones", observaciones);
      if (imagen) formData.append("equipo_img", imagen);

      if (modoEdicion && equipoEditando) {
        await apiAxios.put(`/api/Equipo/${equipoEditando.id_equipo}`, formData);
        alert("Equipo actualizado correctamente");
      } else {
        await apiAxios.post("/api/Equipo", formData);
        alert("Equipo creado correctamente");
      }

      recargarEquipos();

      // Cerrar modal
      const modal = document.getElementById("modalEquipos");
      const modalInstance = window.bootstrap.Modal.getInstance(modal);
      modalInstance?.hide();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al procesar la solicitud");
    }
  };

  return (
    <form onSubmit={gestionarForm} encType="multipart/form-data">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Nombre:</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Marca:</label>
          <input
            type="text"
            className="form-control"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Grupo:</label>
          <input
            type="text"
            className="form-control"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Línea:</label>
          <input
            type="text"
            className="form-control"
            value={linea}
            onChange={(e) => setLinea(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Centro de costos:</label>
        <input
          type="text"
          className="form-control"
          value={centro_costos}
          onChange={(e) => setCentroCostos(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Subcentro de costos:</label>
        <input
          type="text"
          className="form-control"
          value={subcentro_costos}
          onChange={(e) => setSubcentroCostos(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Observaciones:</label>
        <input
          type="text"
          className="form-control"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Imagen:</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
        />
      </div>
      <div className="text-center">
        <button type="submit" className="btn btn-primary w-50">
          {modoEdicion ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default EquiposForm;
