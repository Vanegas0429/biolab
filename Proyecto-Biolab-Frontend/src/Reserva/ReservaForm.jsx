import { useEffect, useMemo, useState } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL || "";

// Función auxiliar para obtener usuario
const getLoggedUser = () => {
  try {
    const user = localStorage.getItem("UsuarioLaboratorio");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const parseImages = (imgField) => {
  if (!imgField) return [];
  try {
    const parsed = JSON.parse(imgField);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return imgField ? [imgField] : [];
  }
};

const abrirFicha = (ficha) => {
  if (!ficha) {
    Swal.fire("Aviso", "No hay ficha técnica disponible para este recurso.", "info");
    return;
  }
  const url = `${API_URL}/uploads/${ficha}`;
  window.open(url, "_blank");
};

const ReservaForm = ({ hideModal, rowToEdit = {}, estados = [], isViewOnly = false }) => {
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
  const [historialEstados, setHistorialEstados] = useState([]);

  const resetForm = () => {
    const user = getLoggedUser();
    setTip_Reserva("Practica");
    setMot_RecCan("");
    setNom_Solicitante(user?.nombre || "");
    setDoc_Solicitante(user?.documento || "");
    setCor_Solicitante(user?.correo || "");
    setTel_Solicitante(user?.telefono || "");
    setCan_Aprendices("");
    setFec_Reserva("");
    setHor_Reserva("");
    setNum_Ficha("");
    setBooleano("Activo");
    setId_Estado("");
    setId_EstadoActual("");
    setHistorialEstados([]);
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
      // Si ya tenemos los detalles en rowToEdit (desde GestionReservas o CrudReserva actualizado)
      if (rowToEdit.actividades || rowToEdit.equipos || rowToEdit.materiales || rowToEdit.reactivos) {
        const reserva = rowToEdit;
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

        const ultimoEstado = reserva.Des_Estado;
        setId_EstadoActual(obtenerIdEstadoPorNombre(ultimoEstado));
        setId_Estado(obtenerIdEstadoPorNombre(ultimoEstado));
        setMot_RecCan(reserva.Mot_RecCan ?? "");
        setHistorialEstados(reserva.ReservaEstados || []);

        const actividadesIds = reserva.actividades?.map((a) => Number(a.Id_Actividad || a.id_actividad)) || [];
        setActividadesSeleccionadas(actividadesIds);

        setEquipos(reserva.equipos?.map((item) => ({
          Id_Equipo: Number(item.Id_Equipo),
          Can_Equipos: Number(item.Can_Equipos),
          Nom_Equipo: item.Nom_Equipo || item.nombre,
          ficha_tecnica: item.ficha_tecnica || item.Equipo?.ficha_tecnica,
          marca: item.marca || item.Equipo?.marca,
          img_equipo: item.img_equipo || item.Equipo?.img_equipo
        })) || []);
        setMateriales(reserva.materiales?.map((item) => ({
          Id_Material: Number(item.Id_Material),
          Can_Materiales: Number(item.Can_Materiales),
          Nom_Material: item.Nom_Material,
          img_material: item.img_material || item.Material?.img_material
        })) || []);
        setReactivos(reserva.reactivos?.map((item) => ({
          Id_Reactivo: Number(item.Id_Reactivo),
          Can_Reactivo: Number(item.Can_Reactivo),
          Nom_Reactivo: item.Nom_Reactivo || item.Nom_reactivo,
          Presentacion: item.Presentacion,
          Ficha_tecnica: item.Ficha_tecnica || item.Reactivo?.Ficha_tecnica
        })) || []);

        // En modo vista también cargamos actividades y recursos para ver imágenes y detalles
        await loadActividades();
        if (actividadesIds.length > 0) {
          await consultarRecursos(actividadesIds);
        }
        if (isViewOnly) return;
      }

      // De lo contrario, fetch normal
      const res = await apiAxios.get(`/api/Reserva/${reservaId}`);
      const data = res.data ?? {};
      // ... (resto del código existente)

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
      setHistorialEstados(estadosData || []);

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
          Nom_Equipo: item.Nom_Equipo || item.nombre,
          ficha_tecnica: item.ficha_tecnica || item.Equipo?.ficha_tecnica,
          marca: item.marca || item.Equipo?.marca,
          img_equipo: item.img_equipo || item.Equipo?.img_equipo
        }))
      );

      setMateriales(
        materialesData.map((item) => ({
          Id_Material: Number(item.Id_Material),
          Can_Materiales: Number(item.Can_Materiales),
          Nom_Material: item.Nom_Material,
          img_material: item.Material?.img_material
        }))
      );

      setReactivos(
        reactivosData.map((item) => ({
          Id_Reactivo: Number(item.Id_Reactivo),
          Can_Reactivo: Number(item.Can_Reactivo),
          Nom_Reactivo: item.Nom_Reactivo || item.Nom_reactivo,
          Presentacion: item.Presentacion,
          Ficha_tecnica: item.Ficha_tecnica || item.Reactivo?.Ficha_tecnica
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

  const agregarEquipoPorNombre = (nombre) => {
    if (!nombre) return;
    const grupo = equiposAgrupados.find((g) => g.nombre === nombre);
    if (!grupo) return;

    // Verificar cuántos ya tenemos seleccionados de este nombre
    const yaSeleccionados = equipos.filter((e) => {
      const info = equiposDisponibles.find((ed) => Number(ed.Id_Equipo) === Number(e.Id_Equipo));
      return info?.nombre === nombre;
    });

    if (yaSeleccionados.length < grupo.items.length) {
      // Buscar el siguiente ID disponible en el grupo que no esté ya seleccionado
      const nextItem = grupo.items.find(
        (item) => !equipos.some((e) => Number(e.Id_Equipo) === Number(item.Id_Equipo))
      );
      if (nextItem) {
        setEquipos((prev) => [...prev, { Id_Equipo: Number(nextItem.Id_Equipo), Can_Equipos: 1 }]);
      }
    }
  };

  const actualizarCantidadEquipoPorNombre = (nombre, nuevaCantidad) => {
    const cant = Number(nuevaCantidad) || 0;
    const grupo = equiposAgrupados.find((g) => g.nombre === nombre);
    if (!grupo) return;

    if (cant > grupo.items.length) {
      Swal.fire(
        "Atención",
        `Solo hay ${grupo.items.length} equipos de este tipo disponibles.`,
        "warning"
      );
      return;
    }

    // Filtrar los que NO son de este nombre para mantenerlos
    const otrosEquipos = equipos.filter((e) => {
      const info = equiposDisponibles.find((ed) => Number(ed.Id_Equipo) === Number(e.Id_Equipo));
      return info?.nombre !== nombre;
    });

    // Tomar los primeros N items del grupo disponible
    const nuevosItems = grupo.items.slice(0, cant).map((item) => ({
      Id_Equipo: Number(item.Id_Equipo),
      Can_Equipos: 1,
    }));

    setEquipos([...otrosEquipos, ...nuevosItems]);
  };

  const eliminarEquipoPorNombre = (nombre) => {
    setEquipos((prev) =>
      prev.filter((e) => {
        const info = equiposDisponibles.find((ed) => Number(ed.Id_Equipo) === Number(e.Id_Equipo));
        return info?.nombre !== nombre;
      })
    );
  };

  const agregarMaterial = (idMaterial) => {
    const id = Number(idMaterial);
    if (!id) return;

    const existe = materiales.some((m) => Number(m.Id_Material) === id);
    if (existe) return;

    setMateriales((prev) => [...prev, { Id_Material: id, Can_Materiales: 1 }]);
  };

  const actualizarCantidadMaterial = (idMaterial, cantidad) => {
    const id = Number(idMaterial);
    const cant = Number(cantidad) || 0;

    // Buscar el material en los detalles de recursos para saber el stock real
    const materialInfo = materialesDisponibles.find(m => Number(m.Id_Material) === id);
    const stockDisponible = materialInfo ? Number(materialInfo.Can_Material) : 99999;

    if (cant > stockDisponible) {
      Swal.fire("Atención", `La cantidad solicitada (${cant}) supera el stock disponible (${stockDisponible})`, "warning");
      return;
    }

    setMateriales((prev) =>
      prev.map((item) =>
        Number(item.Id_Material) === id
          ? { ...item, Can_Materiales: cant }
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

  const equiposDisponibles = useMemo(() => recursosActividad?.resumen?.equiposDetalle ?? [], [recursosActividad]);

  const equiposAgrupados = useMemo(() => {
    const groups = {};
    equiposDisponibles.forEach((eq) => {
      if (!groups[eq.nombre]) {
        groups[eq.nombre] = { nombre: eq.nombre, items: [] };
      }
      groups[eq.nombre].items.push(eq);
    });
    return Object.values(groups);
  }, [equiposDisponibles]);

  const selectedEquiposAgrupados = useMemo(() => {
    const groups = {};
    equipos.forEach((e) => {
      const dbInfo = equiposDisponibles.find(
        (ed) => Number(ed.Id_Equipo) === Number(e.Id_Equipo)
      );

      const info = dbInfo || {
        nombre: e.Nom_Equipo || `Equipo ${e.Id_Equipo}`,
        img_equipo: e.img_equipo,
        ficha_tecnica: e.ficha_tecnica,
        marca: e.marca
      };

      const name = info.nombre;
      if (!groups[name]) {
        groups[name] = { nombre: name, items: [] };
      }
      groups[name].items.push({ ...e, info });
    });
    return Object.values(groups);
  }, [equipos, equiposDisponibles]);

  const materialesDisponibles = useMemo(() => recursosActividad?.resumen?.materialesDetalle ?? [], [recursosActividad]);
  const reactivosDisponibles = useMemo(() => recursosActividad?.resumen?.reactivosDetalle ?? [], [recursosActividad]);

  useEffect(() => {
    if (!Id_Estado && nombreEstadoActual) {
      const idEncontrado = obtenerIdEstadoPorNombre(nombreEstadoActual);
      if (idEncontrado) {
        setId_Estado(idEncontrado);
      }
    }
  }, [Id_Estado, nombreEstadoActual, catalogoEstados]);

  const seleccionarTodosEquipos = () => {
    const nuevosEquipos = equiposDisponibles.map(eq => ({
      Id_Equipo: Number(eq.Id_Equipo),
      Can_Equipos: 1
    }));
    setEquipos(nuevosEquipos);
  };

  const seleccionarTodosMateriales = () => {
    const nuevosMateriales = materialesDisponibles.map(mat => ({
      Id_Material: Number(mat.Id_Material),
      Can_Materiales: 1
    }));
    setMateriales(nuevosMateriales);
  };

  const seleccionarTodosReactivos = () => {
    const nuevosReactivos = reactivosDisponibles.map(reac => ({
      Id_Reactivo: Number(reac.Id_Reactivo),
      Can_Reactivo: 1
    }));
    setReactivos(nuevosReactivos);
  };

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

      // Validar cantidades de materiales contra stock
      for (const mat of materiales) {
        const info = materialesDisponibles.find(m => Number(m.Id_Material) === Number(mat.Id_Material));
        if (info && Number(mat.Can_Materiales) > Number(info.Can_Material)) {
          Swal.fire("Error de Stock", `El material '${info.Nom_Material}' solo tiene ${info.Can_Material} unidades disponibles.`, "error");
          return;
        }
      }

      // Validar cantidades de reactivos contra stock
      for (const reac of reactivos) {
        const info = reactivosDisponibles.find(r => Number(r.Id_Reactivo) === Number(reac.Id_Reactivo));
        if (info && Number(reac.Can_Reactivo) > Number(info.cantidad_existente)) {
          Swal.fire("Error de Stock", `El reactivo '${info.Nom_reactivo || info.Nom_Reactivo}' solo tiene ${info.cantidad_existente} ${info.Uni_Medida || ''} disponibles.`, "error");
          return;
        }
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
        await Swal.fire("Registrado", "Reserva registrada", "success");
        resetForm();
        try { hideModal?.(); } catch (modalErr) { console.warn("Error cerrando modal:", modalErr); }
      } else {
        await apiAxios.put(`/api/Reserva/${reservaId}`, payload);

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
        try { hideModal?.(); } catch (modalErr) { console.warn("Error cerrando modal:", modalErr); }
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
            className="form-select rounded-pill shadow-sm"
            value={Tip_Reserva}
            onChange={(e) => setTip_Reserva(e.target.value)}
            required
            disabled={isViewOnly}
          >
            <option value="Practica">Practica</option>
            <option value="Visita">Visita</option>
          </select>
        </div>

        {isViewOnly && historialEstados && historialEstados.length > 0 && (
          <div className="col-12 mb-3 animate__animated animate__fadeIn">
            <span className="text-muted fw-bold small mb-2 d-flex align-items-center gap-1">
              <i className="fa-solid fa-clock-rotate-left"></i> Histórico:
            </span>
            <div className="row g-2 mt-1">
              {[...historialEstados]
                .sort((a, b) => (a.Id_ReservaEstado || 0) - (b.Id_ReservaEstado || 0))
                .map((item, idx) => {
                  const fechaStr = item.updatedAt || item.updatedat
                    ? new Date(item.updatedAt || item.updatedat).toLocaleString("es-CO", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                    : "";

                  const status = item.Estado?.Tip_Estado || "Estado Desconocido";

                  let badgeClass = 'bg-secondary';
                  if (status === 'Aprobado') badgeClass = 'bg-success';
                  else if (status === 'Rechazado' || status === 'Cancelado') badgeClass = 'bg-danger';
                  else if (status === 'En proceso') badgeClass = 'bg-warning text-dark';
                  else if (status === 'Solicitado') badgeClass = 'bg-info text-dark';

                  let colClass = "col-12";
                  const totalItems = historialEstados.length;
                  if (totalItems === 2) {
                    colClass = "col-6";
                  } else if (totalItems === 3) {
                    colClass = "col-6 col-md-4";
                  } else if (totalItems === 4) {
                    colClass = "col-6";
                  } else if (totalItems > 4) {
                    colClass = "col-6 col-md-3";
                  }

                  return (
                    <div key={item.Id_ReservaEstado || idx} className={colClass}>
                      <div className="d-flex align-items-center justify-content-between gap-2 bg-white border rounded-pill p-1 px-3 shadow-sm h-100 hover-scale" style={{ transition: 'all 0.2s' }}>
                        <div className="d-flex align-items-center gap-2 text-truncate">
                          <span className={`badge ${badgeClass} rounded-pill`} style={{ fontSize: '0.75rem', padding: '0.35em 0.65em' }}>
                            {status}
                          </span>
                          <span className="text-muted fw-medium text-truncate" style={{ fontSize: '0.7rem' }}>
                            {fechaStr}
                          </span>
                        </div>
                        {item.Mot_RecCan && (
                          <span 
                            className="text-danger small ms-1 flex-shrink-0" 
                            title={item.Mot_RecCan}
                            style={{ fontSize: '0.7rem', fontWeight: '500' }}
                          >
                            <i className="fa-solid fa-circle-info"></i>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}


        {isEditing && (
          ["Rechazado", "Cancelado"].includes(rowToEdit?.Des_Estado) ||
          ["Rechazado", "Cancelado"].includes(obtenerNombreEstado(Id_Estado)) ||
          ["Rechazado", "Cancelado"].includes(nombreEstadoActual) ||
          (String(Mot_RecCan).trim() !== "")
        ) && (
          <div className="col-md-12 mb-3 animate__animated animate__fadeIn">
            <label className="form-label fw-bold">Motivo Rechazo o Cancelación:</label>
            <input
              type="text"
              className="form-control rounded-pill shadow-sm px-3"
              value={Mot_RecCan}
              onChange={(e) => setMot_RecCan(e.target.value)}
              required
              readOnly={isViewOnly}
            />
          </div>
        )}

        {Tip_Reserva === "Practica" && (
          <div className="col-md-12 mb-3">
            <label className="form-label d-block">Actividades (mínimo 1, máximo 3):</label>

            <div className="border rounded p-3" style={{ maxHeight: "220px", overflowY: "auto" }}>
              {actividadesDisponibles.filter(a => a.Estado === 'Activo').map((actividad) => {
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
                      disabled={deshabilitada || isViewOnly}
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

        {Tip_Reserva === "Practica" && (
          <>
            {!isViewOnly && (
              <div className="col-md-4 mb-3">
                <label className="form-label">Equipos requeridos por actividades:</label>
                <select
                  className="form-select rounded-pill shadow-sm"
                  onChange={(e) => {
                    agregarEquipoPorNombre(e.target.value);
                    e.target.value = "";
                  }}
                  disabled={loadingRecursos || equiposAgrupados.length === 0}
                >
                  <option value="">Selecciona un equipo</option>
                  {equiposAgrupados.map((g) => (
                    <option key={g.nombre} value={g.nombre}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
                {equiposDisponibles.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary mt-2 w-100"
                    onClick={seleccionarTodosEquipos}
                  >
                    <i className="fa-solid fa-check-double me-1"></i> Seleccionar todos los equipos
                  </button>
                )}
              </div>
            )}

            {!isViewOnly && (
              <div className="col-md-4 mb-3">
                <label className="form-label">Materiales requeridos por actividades:</label>
                <select
                  className="form-select rounded-pill shadow-sm"
                  onChange={(e) => {
                    agregarMaterial(e.target.value);
                    e.target.value = "";
                  }}
                  disabled={loadingRecursos || materialesDisponibles.length === 0}
                >
                  <option value="">Selecciona un material</option>
                  {materialesDisponibles.map((mat) => (
                    <option key={mat.Id_Material} value={mat.Id_Material}>
                      {mat.Nom_Material}
                    </option>
                  ))}
                </select>
                {materialesDisponibles.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary mt-2 w-100"
                    onClick={seleccionarTodosMateriales}
                  >
                    <i className="fa-solid fa-check-double me-1"></i> Seleccionar todos los materiales
                  </button>
                )}
              </div>
            )}

            {!isViewOnly && (
              <div className="col-md-4 mb-3">
                <label className="form-label">Reactivos requeridos por actividades:</label>
                <select
                  className="form-select rounded-pill shadow-sm"
                  onChange={(e) => {
                    agregarReactivo(e.target.value);
                    e.target.value = "";
                  }}
                  disabled={loadingRecursos || reactivosDisponibles.length === 0}
                >
                  <option value="">Selecciona un reactivo</option>
                  {reactivosDisponibles.map((reac) => (
                    <option key={reac.Id_Reactivo} value={reac.Id_Reactivo}>
                      {reac.Nom_reactivo} {reac.Presentacion ? `(${reac.Presentacion})` : ''} - {(reac.cantidad_existente !== undefined ? reac.cantidad_existente : 0)} {reac.Uni_Medida || ''} disponibles
                    </option>
                  ))}
                </select>
                {reactivosDisponibles.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary mt-2 w-100"
                    onClick={seleccionarTodosReactivos}
                  >
                    <i className="fa-solid fa-check-double me-1"></i> Seleccionar todos los reactivos
                  </button>
                )}
              </div>
            )}

            <div className="col-md-12 mb-3">
              <div className="row">
                <div className="col-md-4">
                  <h6>Equipos seleccionados</h6>
                  {selectedEquiposAgrupados.length === 0 && <p className="text-muted">No hay equipos seleccionados</p>}
                  {selectedEquiposAgrupados.map((group) => {
                    const availableGroup = equiposAgrupados.find(g => g.nombre === group.nombre);
                    const maxStock = availableGroup ? availableGroup.items.length : group.items.length;

                    return (
                      <div key={group.nombre} className="border rounded p-2 mb-2 bg-light shadow-sm">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div className="flex-grow-1 min-width-0">
                            <div className="d-flex justify-content-between align-items-start">
                              <strong className="small text-truncate d-block" title={group.nombre}>
                                {group.nombre}
                              </strong>
                              {!isViewOnly && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                                  onClick={() => eliminarEquipoPorNombre(group.nombre)}
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              )}
                            </div>
                            <span className="badge bg-primary-soft text-primary small mt-1">Disponibles: {maxStock}</span>
                          </div>
                        </div>

                        {/* Contenedor de imágenes */}
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          {group.items.map((item, idx) => {
                            const imgs = parseImages(item.info?.img_equipo);
                            return (
                              <div key={`${item.Id_Equipo}-${idx}`} className="flex-shrink-0 text-center">
                                {imgs.length > 0 ? (
                                  <img
                                    src={`${API_URL}/uploads/${imgs[0]}`}
                                    alt={group.nombre}
                                    className="rounded border"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    title={`Equipo ID: ${item.Id_Equipo}`}
                                  />
                                ) : (
                                  <div className="bg-white border rounded d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                    <i className="fa-solid fa-microscope text-muted opacity-50"></i>
                                  </div>
                                )}
                                <div className="mt-1">
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-outline-info p-0 px-1"
                                    style={{ fontSize: '10px' }}
                                    onClick={() => abrirFicha(item.info?.ficha_tecnica)}
                                    title={`Ver ficha técnica`}
                                  >
                                    <i className="fa-solid fa-file-pdf"></i> Ficha
                                  </button>
                                  {item.info?.marca && (
                                    <div className="text-muted" style={{ fontSize: '9px' }}></div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Selector de cantidad */}
                        <div className="d-flex align-items-center gap-2">
                          <label className="small text-muted">Cantidad:</label>
                          <input
                            type="number"
                            min="1"
                            max={maxStock}
                            className="form-control form-control-sm"
                            style={{ width: '70px' }}
                            value={group.items.length}
                            onChange={(e) => actualizarCantidadEquipoPorNombre(group.nombre, e.target.value)}
                            readOnly={isViewOnly}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="col-md-4">
                  <h6>Materiales seleccionados</h6>
                  {materiales.length === 0 && <p className="text-muted">No hay materiales seleccionados</p>}
                  {materiales.map((item) => {
                    const info = materialesDisponibles.find(m => Number(m.Id_Material) === Number(item.Id_Material));
                    const maxStock = info ? Number(info.Can_Material) : 0;
                    const imgs = parseImages(info?.img_material || item.img_material);

                    return (
                      <div key={item.Id_Material} className="border rounded p-2 mb-2 bg-light shadow-sm">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div className="flex-shrink-0">
                            {imgs.length > 0 ? (
                              <img
                                src={`${API_URL}/uploads/${imgs[0]}`}
                                alt={info?.Nom_Material}
                                className="rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="bg-white border rounded d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                <i className="fa-solid fa-flask text-muted opacity-50"></i>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow-1 min-width-0">
                            <div className="d-flex justify-content-between align-items-start">
                              <strong className="small text-truncate d-block" title={info?.Nom_Material || item.Nom_Material}>{info?.Nom_Material || item.Nom_Material || `Material ${item.Id_Material}`}</strong>
                              {!isViewOnly && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                                  onClick={() => eliminarMaterial(item.Id_Material)}
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              )}
                            </div>
                            <span className="badge bg-primary-soft text-primary small mt-1">Stock: {maxStock}</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max={maxStock}
                            className="form-control form-control-sm"
                            value={item.Can_Materiales}
                            onChange={(e) => actualizarCantidadMaterial(item.Id_Material, e.target.value)}
                            readOnly={isViewOnly}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="col-md-4">
                  <h6>Reactivos seleccionados</h6>
                  {reactivos.length === 0 && <p className="text-muted">No hay reactivos seleccionados</p>}
                  {reactivos.map((item) => {
                    const info = reactivosDisponibles.find(r => Number(r.Id_Reactivo) === Number(item.Id_Reactivo)) || {};
                    const stockDisponible = info.cantidad_existente !== undefined ? info.cantidad_existente : 0;
                    const uniMedida = info.Uni_Medida || item.Uni_Medida || '';

                    return (
                      <div key={item.Id_Reactivo} className="border rounded p-2 mb-2 bg-light shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="flex-grow-1 min-width-0">
                            <strong className="small text-truncate d-block" title={info.Nom_reactivo || item.Nom_Reactivo || `Reactivo ${item.Id_Reactivo}`}>
                              {info.Nom_reactivo || item.Nom_Reactivo || `Reactivo ${item.Id_Reactivo}`}
                              {' '}
                              {(info.Presentacion || item.Presentacion) ? `(${info.Presentacion || item.Presentacion})` : ''}
                            </strong>
                            <span className="badge bg-primary-soft text-primary small mt-1">Stock: {stockDisponible} {uniMedida}</span>
                          </div>
                          <div className="d-flex gap-1 align-items-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info"
                              onClick={() => {
                                abrirFicha(info.Ficha_tecnica || item.Ficha_tecnica);
                              }}
                              title="Ver ficha técnica"
                            >
                              <i className="fa-solid fa-file-pdf"></i>
                            </button>
                            {!isViewOnly && (
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                                onClick={() => eliminarReactivo(item.Id_Reactivo)}
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max={stockDisponible}
                            className="form-control form-control-sm"
                            value={item.Can_Reactivo}
                            onChange={(e) => actualizarCantidadReactivo(item.Id_Reactivo, e.target.value)}
                            readOnly={isViewOnly}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="col-md-6 mb-3">
          <label className="form-label">Nombre del solicitante:</label>
          <input
            type="text"
            className="form-control rounded-pill shadow-sm px-3"
            value={Nom_Solicitante}
            onChange={(e) => setNom_Solicitante(e.target.value)}
            readOnly={isViewOnly || getLoggedUser()?.rol === 'solicitante'}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Documento del solicitante:</label>
          <input
            type="text"
            className="form-control rounded-pill shadow-sm px-3"
            value={Doc_Solicitante}
            onChange={(e) => setDoc_Solicitante(e.target.value)}
            readOnly={isViewOnly || getLoggedUser()?.rol === 'solicitante'}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Correo del solicitante:</label>
          <input
            type="email"
            className="form-control rounded-pill shadow-sm px-3"
            value={Cor_Solicitante}
            onChange={(e) => setCor_Solicitante(e.target.value)}
            readOnly={isViewOnly || getLoggedUser()?.rol === 'solicitante'}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Teléfono del solicitante:</label>
          <input
            type="text"
            className="form-control rounded-pill shadow-sm px-3"
            value={Tel_Solicitante}
            onChange={(e) => setTel_Solicitante(e.target.value)}
            readOnly={isViewOnly}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Cantidad de aprendices:</label>
          <input
            type="text"
            className="form-control rounded-pill shadow-sm px-3"
            value={Can_Aprendices}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              if (val.length <= 2) setCan_Aprendices(val);
            }}
            maxLength="2"
            readOnly={isViewOnly}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Fecha de la reserva:</label>
          <input
            type="date"
            className="form-control rounded-pill shadow-sm px-3"
            value={Fec_Reserva}
            onChange={(e) => setFec_Reserva(e.target.value)}
            min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
            required
            readOnly={isViewOnly}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Hora de la reserva:</label>
          <input
            type="time"
            className="form-control rounded-pill shadow-sm px-3"
            value={Hor_Reserva}
            onChange={(e) => setHor_Reserva(e.target.value)}
            required
            readOnly={isViewOnly}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Número de ficha:</label>
          <input
            type="text"
            className="form-control rounded-pill shadow-sm px-3"
            value={Num_Ficha}
            onChange={(e) => setNum_Ficha(e.target.value)}
            readOnly={isViewOnly}
          />
        </div>




        {!isViewOnly && (
          <div className="col-12 text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold"
              disabled={loadingRecursos}
            >
              <i className="fa-solid fa-paper-plane me-2"></i>
              {isEditing ? "Actualizar Reserva" : "Crear Reserva"}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default ReservaForm;