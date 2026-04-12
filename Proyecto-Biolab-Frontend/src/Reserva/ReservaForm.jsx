import { useEffect, useMemo, useState } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

const ReservaForm = ({ hideModal, rowToEdit = {}, estados = [] }) => {
  const reservaId = rowToEdit?.Id_Reserva;
  const isEditing = Boolean(reservaId);

  const [Tip_Reserva, setTip_Reserva] = useState("Practica");
  const [Mot_RecCan, setMot_RecCan] = useState("");
  const [Nom_Solicitante, setNom_Solicitante] = useState("");
  const [Doc_Solicitante, setDoc_Solicitante] = useState("");
  const [Cor_Solicitante, setCor_Solicitante] = useState("");
  const [Tel_Solicitante, setTel_Solicitante] = useState("");
  const [Can_Aprendices, setCan_Aprendices] = useState("");
  const [Fec_Reserva, setFec_Reserva] = useState("");
  const [Hor_Reserva, setHor_Reserva] = useState("");
  const [Num_Ficha, setNum_Ficha] = useState("");
  const [Booleano, setBooleano] = useState("Activo");

  const [Id_Estado, setId_Estado] = useState("");
  const [Id_EstadoActual, setId_EstadoActual] = useState("");
  const [catalogoEstados, setCatalogoEstados] = useState([]);

  const [actividadesDisponibles, setActividadesDisponibles] = useState([]);
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);

  const [recursosActividad, setRecursosActividad] = useState({
    actividades: [],
    actividadEquipos: [],
    actividadMateriales: [],
    actividadReactivos: [],
    resumen: {
      equipos: [],
      materiales: [],
      reactivos: [],
    },
  });

  const [equipos, setEquipos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [reactivos, setReactivos] = useState([]);

  const [textFormButton, setTextFormButton] = useState("Enviar");
  const [loadingRecursos, setLoadingRecursos] = useState(false);

  const resetForm = () => {
    setTip_Reserva("Practica");
    setMot_RecCan("");
    setNom_Solicitante("");
    setDoc_Solicitante("");
    setCor_Solicitante("");
    setTel_Solicitante("");
    setCan_Aprendices("");
    setFec_Reserva("");
    setHor_Reserva("");
    setNum_Ficha("");
    setBooleano("Activo");
    setId_Estado("");
    setId_EstadoActual("");
    setActividadesSeleccionadas([]);
    setRecursosActividad({
      actividades: [],
      actividadEquipos: [],
      actividadMateriales: [],
      actividadReactivos: [],
      resumen: { equipos: [], materiales: [], reactivos: [] },
    });
    setEquipos([]);
    setMateriales([]);
    setReactivos([]);
  };

  const limpiarActividadesYRecursos = () => {
    setActividadesSeleccionadas([]);
    setRecursosActividad({
      actividades: [],
      actividadEquipos: [],
      actividadMateriales: [],
      actividadReactivos: [],
      resumen: { equipos: [], materiales: [], reactivos: [] },
    });
    setEquipos([]);
    setMateriales([]);
    setReactivos([]);
  };

  const loadEstados = async () => {
    try {
      if (Array.isArray(estados) && estados.length > 0) {
        setCatalogoEstados(estados);
        return;
      }

      const res = await apiAxios.get("/api/Estado");
      setCatalogoEstados(res.data ?? []);
    } catch (error) {
      console.error("Error cargando estados:", error.response?.data ?? error.message);
      setCatalogoEstados(Array.isArray(estados) ? estados : []);
    }
  };

  const loadActividades = async () => {
    try {
      const res = await apiAxios.get("/api/Actividad");
      setActividadesDisponibles(res.data ?? []);
    } catch (error) {
      console.error("Error cargando actividades:", error.response?.data ?? error.message);
      Swal.fire("Error", "No se pudieron cargar las actividades", "error");
    }
  };

  const loadDataInForm = async () => {
    try {
      const res = await apiAxios.get(`/api/Reserva/${reservaId}`);
      const data = res.data ?? {};

      const reserva = data?.reserva ?? {};
      const actividades = data?.actividades ?? [];
      const equiposData = data?.equipos ?? [];
      const materialesData = data?.materiales ?? [];
      const reactivosData = data?.reactivos ?? [];
      const estadosData = data?.estados ?? [];

      setTip_Reserva(reserva.Tip_Reserva ?? "Practica");
      setNom_Solicitante(reserva.Nom_Solicitante ?? "");
      setDoc_Solicitante(reserva.Doc_Solicitante ?? "");
      setCor_Solicitante(reserva.Cor_Solicitante ?? "");
      setTel_Solicitante(reserva.Tel_Solicitante ?? "");
      setCan_Aprendices(reserva.Can_Aprendices ?? "");
      setFec_Reserva(reserva.Fec_Reserva ?? "");
      setHor_Reserva(reserva.Hor_Reserva ?? "");
      setNum_Ficha(reserva.Num_Ficha ?? "");
      setBooleano(reserva.Booleano ?? "Activo");

      const ultimoEstadoObj = estadosData?.[0] ?? {};
      const ultimoEstado = ultimoEstadoObj?.Id_Estado ?? "";
      setId_Estado(ultimoEstado || "");
      setId_EstadoActual(ultimoEstado || "");
      setMot_RecCan(ultimoEstadoObj?.Mot_RecCan ?? "");

      const actividadesIds = actividades.map((a) => Number(a.Id_Actividad));
      setActividadesSeleccionadas(actividadesIds);

      setEquipos(
        equiposData.map((item) => ({
          Id_Equipo: Number(item.Id_Equipo),
          Can_Equipos: Number(item.Can_Equipos),
        }))
      );

      setMateriales(
        materialesData.map((item) => ({
          Id_Material: Number(item.Id_Material),
          Can_Materiales: Number(item.Can_Materiales),
        }))
      );

      setReactivos(
        reactivosData.map((item) => ({
          Id_Reactivo: Number(item.Id_Reactivo),
          Can_Reactivo: Number(item.Can_Reactivo),
        }))
      );

      if (actividadesIds.length > 0) {
        await consultarRecursos(actividadesIds);
      } else {
        setRecursosActividad({
          actividades: [],
          actividadEquipos: [],
          actividadMateriales: [],
          actividadReactivos: [],
          resumen: { equipos: [], materiales: [], reactivos: [] },
        });
        setEquipos([]);
        setMateriales([]);
        setReactivos([]);
      }
    } catch (error) {
      console.error("Error cargando reserva:", error.response?.data ?? error.message);
      Swal.fire("Error", "No se pudo cargar la reserva para edición", "error");
    }
  };

  useEffect(() => {
    loadEstados();
    loadActividades();
  }, []);

  useEffect(() => {
    if (Array.isArray(estados) && estados.length > 0) {
      setCatalogoEstados(estados);
    }
  }, [estados]);

  useEffect(() => {
    if (isEditing) {
      setTextFormButton("Actualizar");
      loadDataInForm();
    } else {
      setTextFormButton("Enviar");
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, reservaId, rowToEdit]);

  useEffect(() => {
    if (Tip_Reserva === "Visita") {
      limpiarActividadesYRecursos();
    }
  }, [Tip_Reserva]);

  const consultarRecursos = async (actividades) => {
    try {
      setLoadingRecursos(true);
      const res = await apiAxios.post("/api/Actividad/recursos", { actividades });
      const data = res.data ?? {};
      setRecursosActividad(data);

      const equiposPermitidos = data?.resumen?.equipos ?? [];
      const materialesPermitidos = data?.resumen?.materiales ?? [];
      const reactivosPermitidos = data?.resumen?.reactivos ?? [];

      setEquipos((prev) => prev.filter((e) => equiposPermitidos.includes(Number(e.Id_Equipo))));
      setMateriales((prev) => prev.filter((m) => materialesPermitidos.includes(Number(m.Id_Material))));
      setReactivos((prev) => prev.filter((r) => reactivosPermitidos.includes(Number(r.Id_Reactivo))));
    } catch (error) {
      console.error("Error consultando recursos:", error.response?.data ?? error.message);
      Swal.fire(
        "Error",
        error.response?.data?.message ?? "No se pudieron consultar los recursos de las actividades",
        "error"
      );
      setRecursosActividad({
        actividades: [],
        actividadEquipos: [],
        actividadMateriales: [],
        actividadReactivos: [],
        resumen: { equipos: [], materiales: [], reactivos: [] },
      });
      setEquipos([]);
      setMateriales([]);
      setReactivos([]);
    } finally {
      setLoadingRecursos(false);
    }
  };

  const toggleActividad = async (idActividad) => {
    const id = Number(idActividad);
    const yaSeleccionada = actividadesSeleccionadas.includes(id);

    let nuevasActividades = [];

    if (yaSeleccionada) {
      nuevasActividades = actividadesSeleccionadas.filter((item) => item !== id);
    } else {
      if (Tip_Reserva === "Practica" && actividadesSeleccionadas.length >= 3) {
        Swal.fire("Atención", "La reserva de práctica permite máximo 3 actividades", "warning");
        return;
      }

      nuevasActividades = [...actividadesSeleccionadas, id];
    }

    setActividadesSeleccionadas(nuevasActividades);

    if (nuevasActividades.length > 0) {
      await consultarRecursos(nuevasActividades);
    } else {
      setRecursosActividad({
        actividades: [],
        actividadEquipos: [],
        actividadMateriales: [],
        actividadReactivos: [],
        resumen: { equipos: [], materiales: [], reactivos: [] },
      });
      setEquipos([]);
      setMateriales([]);
      setReactivos([]);
    }
  };

  const agregarEquipo = (idEquipo) => {
    const id = Number(idEquipo);
    if (!id) return;

    const existe = equipos.some((e) => Number(e.Id_Equipo) === id);
    if (existe) return;

    setEquipos((prev) => [...prev, { Id_Equipo: id, Can_Equipos: 1 }]);
  };

  const actualizarCantidadEquipo = (idEquipo, cantidad) => {
    setEquipos((prev) =>
      prev.map((item) =>
        Number(item.Id_Equipo) === Number(idEquipo)
          ? { ...item, Can_Equipos: Number(cantidad) || 0 }
          : item
      )
    );
  };

  const eliminarEquipo = (idEquipo) => {
    setEquipos((prev) => prev.filter((item) => Number(item.Id_Equipo) !== Number(idEquipo)));
  };

  const agregarMaterial = (idMaterial) => {
    const id = Number(idMaterial);
    if (!id) return;

    const existe = materiales.some((m) => Number(m.Id_Material) === id);
    if (existe) return;

    setMateriales((prev) => [...prev, { Id_Material: id, Can_Materiales: 1 }]);
  };

  const actualizarCantidadMaterial = (idMaterial, cantidad) => {
    setMateriales((prev) =>
      prev.map((item) =>
        Number(item.Id_Material) === Number(idMaterial)
          ? { ...item, Can_Materiales: Number(cantidad) || 0 }
          : item
      )
    );
  };

  const eliminarMaterial = (idMaterial) => {
    setMateriales((prev) => prev.filter((item) => Number(item.Id_Material) !== Number(idMaterial)));
  };

  const agregarReactivo = (idReactivo) => {
    const id = Number(idReactivo);
    if (!id) return;

    const existe = reactivos.some((r) => Number(r.Id_Reactivo) === id);
    if (existe) return;

    setReactivos((prev) => [...prev, { Id_Reactivo: id, Can_Reactivo: 1 }]);
  };

  const actualizarCantidadReactivo = (idReactivo, cantidad) => {
    setReactivos((prev) =>
      prev.map((item) =>
        Number(item.Id_Reactivo) === Number(idReactivo)
          ? { ...item, Can_Reactivo: Number(cantidad) || 0 }
          : item
      )
    );
  };

  const eliminarReactivo = (idReactivo) => {
    setReactivos((prev) => prev.filter((item) => Number(item.Id_Reactivo) !== Number(idReactivo)));
  };

  const nombreActividad = (id) => {
    const item = actividadesDisponibles.find((a) => Number(a.Id_Actividad) === Number(id));
    return item?.Nom_Actividad ?? `Actividad ${id}`;
  };

  const obtenerNombreEstado = (idEstado) => {
    const estado = catalogoEstados.find((item) => Number(item.Id_Estado) === Number(idEstado));
    return estado?.Tip_Estado ?? "";
  };

  const obtenerIdEstadoPorNombre = (nombre) => {
    const estado = catalogoEstados.find(
      (item) => String(item.Tip_Estado).trim().toLowerCase() === String(nombre).trim().toLowerCase()
    );
    return estado?.Id_Estado ?? "";
  };

  const nombreEstadoActual = useMemo(() => {
    return obtenerNombreEstado(Id_EstadoActual) || "";
  }, [Id_EstadoActual, catalogoEstados]);

  const estadosPermitidos = useMemo(() => {
    if (!isEditing) return [];

    const transicionesValidas = {
      Solicitado: ["Aprobado", "Rechazado"],
      Aprobado: ["En proceso", "Cancelado"],
      "En proceso": ["Finalizado"],
      Rechazado: [],
      Cancelado: [],
      Finalizado: [],
    };

    const permitidosPorNombre = transicionesValidas[nombreEstadoActual] ?? [];

    return permitidosPorNombre
      .map((nombre) => {
        const estado = catalogoEstados.find((item) => item.Tip_Estado === nombre);
        return estado ?? null;
      })
      .filter(Boolean);
  }, [catalogoEstados, isEditing, nombreEstadoActual]);

  const esEstadoFinal = useMemo(() => {
    return ["Rechazado", "Cancelado", "Finalizado"].includes(nombreEstadoActual);
  }, [nombreEstadoActual]);

  const equiposDisponibles = useMemo(() => recursosActividad?.resumen?.equipos ?? [], [recursosActividad]);
  const materialesDisponibles = useMemo(() => recursosActividad?.resumen?.materiales ?? [], [recursosActividad]);
  const reactivosDisponibles = useMemo(() => recursosActividad?.resumen?.reactivos ?? [], [recursosActividad]);

  useEffect(() => {
    if (!Id_Estado && nombreEstadoActual) {
      const idEncontrado = obtenerIdEstadoPorNombre(nombreEstadoActual);
      if (idEncontrado) {
        setId_Estado(idEncontrado);
      }
    }
  }, [Id_Estado, nombreEstadoActual, catalogoEstados]);

  const gestionarForm = async (e) => {
    e.preventDefault();

    if (Tip_Reserva === "Practica") {
      if (actividadesSeleccionadas.length < 1) {
        Swal.fire("Atención", "Debe seleccionar al menos una actividad", "warning");
        return;
      }

      if (actividadesSeleccionadas.length > 3) {
        Swal.fire("Atención", "La reserva de práctica permite máximo 3 actividades", "warning");
        return;
      }
    }

    const payload = {
      Tip_Reserva,
      Nom_Solicitante,
      Doc_Solicitante,
      Cor_Solicitante,
      Tel_Solicitante,
      Can_Aprendices: Number(Can_Aprendices) || 0,
      Fec_Reserva,
      Hor_Reserva,
      Num_Ficha,
      Booleano,
      actividades: Tip_Reserva === "Practica" ? actividadesSeleccionadas : [],
      equipos:
        Tip_Reserva === "Practica"
          ? equipos.filter((e) => Number(e.Can_Equipos) > 0)
          : [],
      materiales:
        Tip_Reserva === "Practica"
          ? materiales.filter((m) => Number(m.Can_Materiales) > 0)
          : [],
      reactivos:
        Tip_Reserva === "Practica"
          ? reactivos.filter((r) => Number(r.Can_Reactivo) > 0)
          : [],
    };

    try {
      if (!isEditing) {
        await apiAxios.post("/api/Reserva", payload);
        await Swal.fire("OK", "Reserva creada correctamente", "success");
        resetForm();
        hideModal?.();
      } else {
        await apiAxios.put(`/api/Reserva/${reservaId}`, {
          Tip_Reserva,
          Nom_Solicitante,
          Doc_Solicitante,
          Cor_Solicitante,
          Tel_Solicitante,
          Can_Aprendices: Number(Can_Aprendices) || 0,
          Fec_Reserva,
          Hor_Reserva,
          Num_Ficha,
          Booleano,
        });

        const cambioDeEstado = Number(Id_Estado) !== Number(Id_EstadoActual);
        const nombreEstadoSeleccionado = obtenerNombreEstado(Id_Estado);

        if (
          cambioDeEstado &&
          ["Rechazado", "Cancelado"].includes(nombreEstadoSeleccionado) &&
          !String(Mot_RecCan || "").trim()
        ) {
          Swal.fire(
            "Atención",
            `Debe ingresar el motivo para el estado '${nombreEstadoSeleccionado}'`,
            "warning"
          );
          return;
        }

        if (Id_Estado && cambioDeEstado) {
          await apiAxios.put(`/api/Reserva/${reservaId}/estado`, {
            Id_Estado: Number(Id_Estado),
            Mot_RecCan,
          });
        }

        await Swal.fire("OK", "Reserva actualizada correctamente", "success");
        hideModal?.();
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      Swal.fire(
        "Error",
        error.response?.data?.message ?? "Error procesando la reserva",
        "error"
      );
    }
  };

  return (
    <form onSubmit={gestionarForm} className="col-12">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Tipo de reserva:</label>
          <select
            className="form-control"
            value={Tip_Reserva}
            onChange={(e) => setTip_Reserva(e.target.value)}
            required
          >
            <option value="Practica">Practica</option>
            <option value="Visita">Visita</option>
          </select>
        </div>

        {isEditing && (
          <div className="col-md-6 mb-3">
            <label className="form-label">Estado:</label>
            <select
              className="form-control"
              value={Id_Estado || ""}
              onChange={(e) => {
                setId_Estado(Number(e.target.value));
                setMot_RecCan("");
              }}
              disabled={esEstadoFinal}
            >
              {!nombreEstadoActual && <option value="">Selecciona uno</option>}

              {nombreEstadoActual && (
                <option value={obtenerIdEstadoPorNombre(nombreEstadoActual) || Id_EstadoActual || ""}>
                  {nombreEstadoActual}
                </option>
              )}

              {estadosPermitidos.map((estado) => (
                <option key={estado.Id_Estado} value={estado.Id_Estado}>
                  {estado.Tip_Estado}
                </option>
              ))}
            </select>

            {!esEstadoFinal && estadosPermitidos.length > 0 && (
              <small className="text-muted">
                Solo se muestran los estados permitidos según el flujo actual.
              </small>
            )}

            {!esEstadoFinal && nombreEstadoActual && estadosPermitidos.length === 0 && (
              <small className="text-muted">
                No hay más transiciones disponibles para este estado.
              </small>
            )}

            {esEstadoFinal && (
              <small className="text-muted">
                Esta reserva ya terminó su flujo y no admite más cambios de estado.
              </small>
            )}
          </div>
        )}

        {isEditing &&
          ["Rechazado", "Cancelado"].includes(
            obtenerNombreEstado(Id_Estado) || nombreEstadoActual
          ) && (
            <div className="col-md-12 mb-3">
              <label className="form-label">Motivo Rechazo o Cancelación:</label>
              <input
                type="text"
                className="form-control"
                value={Mot_RecCan}
                onChange={(e) => setMot_RecCan(e.target.value)}
                required
              />
            </div>
          )}

        {Tip_Reserva === "Practica" && !isEditing && (
          <div className="col-md-12 mb-3">
            <label className="form-label d-block">Actividades (mínimo 1, máximo 3):</label>

            <div className="border rounded p-3" style={{ maxHeight: "220px", overflowY: "auto" }}>
              {actividadesDisponibles.map((actividad) => {
                const id = Number(actividad.Id_Actividad);
                const checked = actividadesSeleccionadas.includes(id);
                const deshabilitada = !checked && actividadesSeleccionadas.length >= 3;

                return (
                  <div key={actividad.Id_Actividad} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`actividad-${id}`}
                      checked={checked}
                      disabled={deshabilitada}
                      onChange={() => toggleActividad(id)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`actividad-${id}`}
                      style={{ cursor: deshabilitada ? "not-allowed" : "pointer" }}
                    >
                      {actividad.Nom_Actividad}
                    </label>
                  </div>
                );
              })}
            </div>

            <small className="text-muted d-block mt-2">
              Selecciona entre 1 y 3 actividades.
            </small>
          </div>
        )}

        {Tip_Reserva === "Practica" && actividadesSeleccionadas.length > 0 && (
          <div className="col-md-12 mb-3">
            <div className="alert alert-secondary">
              <strong>Actividades seleccionadas:</strong>{" "}
              {actividadesSeleccionadas.map((id) => nombreActividad(id)).join(", ")}
            </div>
          </div>
        )}

        {Tip_Reserva === "Practica" && !isEditing && (
          <>
            <div className="col-md-4 mb-3">
              <label className="form-label">Equipos requeridos por actividades:</label>
              <select
                className="form-control"
                onChange={(e) => {
                  agregarEquipo(e.target.value);
                  e.target.value = "";
                }}
                disabled={loadingRecursos || equiposDisponibles.length === 0}
              >
                <option value="">Selecciona un equipo</option>
                {equiposDisponibles.map((id) => (
                  <option key={id} value={id}>
                    Equipo {id}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Materiales requeridos por actividades:</label>
              <select
                className="form-control"
                onChange={(e) => {
                  agregarMaterial(e.target.value);
                  e.target.value = "";
                }}
                disabled={loadingRecursos || materialesDisponibles.length === 0}
              >
                <option value="">Selecciona un material</option>
                {materialesDisponibles.map((id) => (
                  <option key={id} value={id}>
                    Material {id}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Reactivos requeridos por actividades:</label>
              <select
                className="form-control"
                onChange={(e) => {
                  agregarReactivo(e.target.value);
                  e.target.value = "";
                }}
                disabled={loadingRecursos || reactivosDisponibles.length === 0}
              >
                <option value="">Selecciona un reactivo</option>
                {reactivosDisponibles.map((id) => (
                  <option key={id} value={id}>
                    Reactivo {id}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-12 mb-3">
              <div className="row">
                <div className="col-md-4">
                  <h6>Equipos seleccionados</h6>
                  {equipos.length === 0 && <p className="text-muted">No hay equipos seleccionados</p>}
                  {equipos.map((item) => (
                    <div key={item.Id_Equipo} className="border rounded p-2 mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Equipo {item.Id_Equipo}</strong>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarEquipo(item.Id_Equipo)}
                        >
                          Quitar
                        </button>
                      </div>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={item.Can_Equipos}
                        onChange={(e) => actualizarCantidadEquipo(item.Id_Equipo, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="col-md-4">
                  <h6>Materiales seleccionados</h6>
                  {materiales.length === 0 && <p className="text-muted">No hay materiales seleccionados</p>}
                  {materiales.map((item) => (
                    <div key={item.Id_Material} className="border rounded p-2 mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Material {item.Id_Material}</strong>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarMaterial(item.Id_Material)}
                        >
                          Quitar
                        </button>
                      </div>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={item.Can_Materiales}
                        onChange={(e) => actualizarCantidadMaterial(item.Id_Material, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="col-md-4">
                  <h6>Reactivos seleccionados</h6>
                  {reactivos.length === 0 && <p className="text-muted">No hay reactivos seleccionados</p>}
                  {reactivos.map((item) => (
                    <div key={item.Id_Reactivo} className="border rounded p-2 mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Reactivo {item.Id_Reactivo}</strong>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarReactivo(item.Id_Reactivo)}
                        >
                          Quitar
                        </button>
                      </div>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={item.Can_Reactivo}
                        onChange={(e) => actualizarCantidadReactivo(item.Id_Reactivo, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="col-md-6 mb-3">
          <label className="form-label">Nombre del solicitante:</label>
          <input
            type="text"
            className="form-control"
            value={Nom_Solicitante}
            onChange={(e) => setNom_Solicitante(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Documento del solicitante:</label>
          <input
            type="text"
            className="form-control"
            value={Doc_Solicitante}
            onChange={(e) => setDoc_Solicitante(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Correo del solicitante:</label>
          <input
            type="email"
            className="form-control"
            value={Cor_Solicitante}
            onChange={(e) => setCor_Solicitante(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Teléfono del solicitante:</label>
          <input
            type="text"
            className="form-control"
            value={Tel_Solicitante}
            onChange={(e) => setTel_Solicitante(e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Cantidad de aprendices:</label>
          <input
            type="number"
            className="form-control"
            value={Can_Aprendices}
            onChange={(e) => setCan_Aprendices(e.target.value)}
            min={0}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Fecha de la reserva:</label>
          <input
            type="date"
            className="form-control"
            value={Fec_Reserva}
            onChange={(e) => setFec_Reserva(e.target.value)}
            required
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Hora de la reserva:</label>
          <input
            type="time"
            className="form-control"
            value={Hor_Reserva}
            onChange={(e) => setHor_Reserva(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Número de ficha:</label>
          <input
            type="text"
            className="form-control"
            value={Num_Ficha}
            onChange={(e) => setNum_Ficha(e.target.value)}
          />
        </div>

        {isEditing && (
          <div className="col-md-6 mb-3">
            <label className="form-label">Actividad de reserva:</label>
            <select
              className="form-control"
              value={Booleano}
              onChange={(e) => setBooleano(e.target.value)}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        )}

        <div className="col-md-12 mt-2">
          <input type="submit" className="btn btn-primary w-25" value={textFormButton} />
        </div>
      </div>
    </form>
  );
};

export default ReservaForm;