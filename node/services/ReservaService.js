import { Op } from "sequelize";
import db_store from "../database/db.js";

import ReservaModel from "../models/ReservaModel.js";
import ReservaActividadModel from "../models/ReservaActividadModel.js";
import ReservaEquipoModel from "../models/ReservaEquipoModel.js";
import ReservaMaterialModel from "../models/ReservaMaterialModel.js";
import ReservaReactivoModel from "../models/ReservaReactivoModel.js";
import ReservaEstadoModel from "../models/ReservaEstadoModel.js";

import EstadoModel from "../models/EstadoModel.js";
import ActividadModel from "../models/ActividadModel.js";
import ActividadEquipoModel from "../models/ActividadEquipoModel.js";
import ActividadMaterialModel from "../models/ActividadMaterialModel.js";
import ActividadReactivoModel from "../models/ActividadReactivoModel.js";
import EquipoModel from "../models/EquipoModel.js";
import MaterialModel from "../models/MaterialModel.js";
import ReactivosModel from "../models/ReactivosModel.js";
import EntradaModel from "../models/EntradaModel.js";
import MovimientoReactivoModel from "../models/MovimientoReactivoModel.js";
import { enviarCorreoRechazo, enviarCorreoAprobacion } from "./EmailService.js";

async function discountReactivoStock(idReactivo, quantity, idReserva, transaction) {
  let remainingToDiscount = Number(quantity);
  if (remainingToDiscount <= 0) return;

  const entries = await EntradaModel.findAll({
    where: {
      Id_reactivo: idReactivo,
      Estado: 'Activo',
      Can_Existente: { [Op.gt]: 0 }
    },
    order: [
      ['Fec_Vencimiento', 'ASC'],
      ['Id_Entrada', 'ASC']
    ],
    transaction
  });

  const totalAvailable = entries.reduce((sum, entry) => sum + Number(entry.Can_Existente || 0), 0);
  if (totalAvailable < remainingToDiscount) {
    throw new Error(`Stock insuficiente para el reactivo con ID ${idReactivo}. Solicitado: ${remainingToDiscount}, Disponible: ${totalAvailable}`);
  }

  for (const entry of entries) {
    if (remainingToDiscount <= 0) break;

    const available = Number(entry.Can_Existente || 0);
    const toSubtract = Math.min(available, remainingToDiscount);
    entry.Can_Existente = available - toSubtract;
    await entry.save({ transaction });

    // Log movement
    await MovimientoReactivoModel.create({
      Id_Entrada: entry.Id_Entrada,
      Id_Reserva: idReserva,
      Tipo: 'Salida',
      Cantidad: toSubtract,
      Detalle: `Descuento por Reserva #${idReserva}`
    }, { transaction });

    remainingToDiscount -= toSubtract;
  }
}

async function restoreReactivoStock(idReactivo, quantity, idReserva, detalle, transaction) {
  let remainingToRestore = Number(quantity);
  if (remainingToRestore <= 0) return;

  const entries = await EntradaModel.findAll({
    where: {
      Id_reactivo: idReactivo,
      Estado: 'Activo'
    },
    order: [
      ['Fec_Vencimiento', 'DESC'],
      ['Id_Entrada', 'DESC']
    ],
    transaction
  });

  for (const entry of entries) {
    if (remainingToRestore <= 0) break;

    const spaceAvailable = Number(entry.Can_Inicial || 0) - Number(entry.Can_Existente || 0);
    if (spaceAvailable > 0) {
      const toAdd = Math.min(spaceAvailable, remainingToRestore);
      entry.Can_Existente = Number(entry.Can_Existente || 0) + toAdd;
      await entry.save({ transaction });

      // Log movement
      await MovimientoReactivoModel.create({
        Id_Entrada: entry.Id_Entrada,
        Id_Reserva: idReserva,
        Tipo: 'Devolución',
        Cantidad: toAdd,
        Detalle: detalle || `Devolución por Reserva #${idReserva}`
      }, { transaction });

      remainingToRestore -= toAdd;
    }
  }

  if (remainingToRestore > 0 && entries.length > 0) {
    const oldVal = Number(entries[0].Can_Existente || 0);
    entries[0].Can_Existente = oldVal + remainingToRestore;
    await entries[0].save({ transaction });

    // Log movement for fallback
    await MovimientoReactivoModel.create({
      Id_Entrada: entries[0].Id_Entrada,
      Id_Reserva: idReserva,
      Tipo: 'Devolución',
      Cantidad: remainingToRestore,
      Detalle: (detalle || `Devolución por Reserva #${idReserva}`) + ' (Excedente restaurado en primer lote)'
    }, { transaction });
  }
}

class ReservaService {
  async getAll() {
    const reservas = await ReservaModel.findAll({
      order: [["Id_Reserva", "DESC"]],
      include: [
        {
          model: ReservaActividadModel,
          as: 'ReservaActividades',
          include: [{ model: ActividadModel, as: 'Actividad' }]
        },
        {
          model: ReservaEquipoModel,
          as: 'ReservaEquipos',
          include: [{ model: EquipoModel, as: 'Equipo' }]
        },
        {
          model: ReservaMaterialModel,
          as: 'ReservaMateriales',
          include: [{ model: MaterialModel, as: 'Material' }]
        },
        {
          model: ReservaReactivoModel,
          as: 'ReservaReactivos',
          include: [{ model: ReactivosModel, as: 'Reactivo' }]
        },
        {
          model: ReservaEstadoModel,
          as: 'ReservaEstados',
          include: [{ model: EstadoModel, as: 'Estado' }]
        }
      ]
    });

    return reservas.map(reserva => {
      const json = reserva.toJSON();
      
      // Obtener último estado
      const ultimoHistorial = json.ReservaEstados?.sort((a, b) => b.Id_ReservaEstado - a.Id_ReservaEstado)[0];
      const estadoActual = ultimoHistorial?.Estado?.Tip_Estado ?? "";
      const motivoActual = ultimoHistorial?.Mot_RecCan ?? "";

      // Mapear detalles para facilitar el uso en frontend
      const equipos = json.ReservaEquipos?.map(re => ({
        ...re,
        Nom_Equipo: re.Equipo?.nombre,
        Uni_Medida: 'Unidades',
        ficha_tecnica: re.Equipo?.ficha_tecnica,
        marca: re.Equipo?.marca,
        img_equipo: re.Equipo?.img_equipo
      })) || [];

      const materiales = json.ReservaMateriales?.map(rm => ({
        ...rm,
        Nom_Material: rm.Material?.Nom_Material,
        Uni_Medida: rm.Material?.Uni_Medida || 'Unidades',
        img_material: rm.Material?.img_material
      })) || [];

      const reactivos = json.ReservaReactivos?.map(rr => ({
        ...rr,
        Nom_Reactivo: rr.Reactivo?.Nom_reactivo,
        Uni_Medida: rr.Reactivo?.Uni_Medida || 'ml/g',
        Ficha_tecnica: rr.Reactivo?.Ficha_tecnica
      })) || [];

      return {
        ...json,
        Des_Estado: estadoActual,
        Mot_RecCan: motivoActual,
        equipos,
        materiales,
        reactivos,
        actividades: json.ReservaActividades?.map(ra => ra.Actividad) || []
      };
    });
  }

  async getById(id) {
    const reserva = await ReservaModel.findByPk(id, {
      include: [
        {
          model: ReservaActividadModel,
          as: 'ReservaActividades',
          include: [{ model: ActividadModel, as: 'Actividad' }]
        },
        {
          model: ReservaEquipoModel,
          as: 'ReservaEquipos',
          include: [{ model: EquipoModel, as: 'Equipo' }]
        },
        {
          model: ReservaMaterialModel,
          as: 'ReservaMateriales',
          include: [{ model: MaterialModel, as: 'Material' }]
        },
        {
          model: ReservaReactivoModel,
          as: 'ReservaReactivos',
          include: [{ model: ReactivosModel, as: 'Reactivo' }]
        },
        {
          model: ReservaEstadoModel,
          as: 'ReservaEstados',
          include: [{ model: EstadoModel, as: 'Estado' }]
        }
      ]
    });

    if (!reserva) throw new Error("Reserva no encontrada");

    const json = reserva.toJSON();
    
    // Obtener último estado
    const ultimoHistorial = json.ReservaEstados?.sort((a, b) => b.Id_ReservaEstado - a.Id_ReservaEstado)[0];
    const estadoActual = ultimoHistorial?.Estado?.Tip_Estado ?? "";
    const motivoActual = ultimoHistorial?.Mot_RecCan ?? "";

    // Mapear detalles
    const equipos = json.ReservaEquipos?.map(re => ({
      ...re,
      Nom_Equipo: re.Equipo?.nombre,
      Uni_Medida: 'Unidades',
      ficha_tecnica: re.Equipo?.ficha_tecnica,
      marca: re.Equipo?.marca,
      img_equipo: re.Equipo?.img_equipo
    })) || [];

    const materiales = json.ReservaMateriales?.map(rm => ({
      ...rm,
      Nom_Material: rm.Material?.Nom_Material,
      Uni_Medida: rm.Material?.Uni_Medida || 'Unidades'
    })) || [];

    const reactivos = json.ReservaReactivos?.map(rr => ({
      ...rr,
      Nom_Reactivo: rr.Reactivo?.Nom_reactivo,
      Uni_Medida: rr.Reactivo?.Uni_Medida || 'ml/g',
      Presentacion: rr.Reactivo?.Presentacion,
      Ficha_tecnica: rr.Reactivo?.Ficha_tecnica
    })) || [];

    return {
      reserva: {
        ...json,
        Des_Estado: estadoActual,
        Mot_RecCan: motivoActual
      },
      actividades: json.ReservaActividades?.map(ra => ra.Actividad) || [],
      equipos,
      materiales,
      reactivos,
      estados: json.ReservaEstados || []
    };
  }

  async create(data) {
    const transaction = await db_store.transaction();

    try {
      const {
        Tip_Reserva,
        Nom_Solicitante,
        Doc_Solicitante,
        Tel_Solicitante,
        Cor_Solicitante,
        Can_Aprendices,
        Fec_Reserva,
        Hor_Reserva,
        Num_Ficha,
        Booleano,
        actividades,
        equipos,
        materiales,
        reactivos,
      } = data;

      if (!Tip_Reserva) {
        throw new Error("Tip_Reserva es obligatorio");
      }

      if (!Fec_Reserva) {
        throw new Error("Fec_Reserva es obligatoria");
      }

      if (!Hor_Reserva) {
        throw new Error("Hor_Reserva es obligatoria");
      }

      const actividadesIds = Array.isArray(actividades)
        ? [...new Set(actividades.map((id) => Number(id)).filter(Boolean))]
        : [];

      if (Tip_Reserva === "Practica") {
        if (actividadesIds.length < 1) {
          throw new Error("La reserva de práctica debe tener mínimo una actividad");
        }

        if (actividadesIds.length > 3) {
          throw new Error("La reserva de práctica permite máximo 3 actividades");
        }
      }

      if (Tip_Reserva === "Visita" && actividadesIds.length > 0) {
        throw new Error("La reserva de visita no debe tener actividades");
      }



      let equiposPermitidos = new Set();
      let materialesPermitidos = new Set();
      let reactivosPermitidos = new Set();

      if (actividadesIds.length > 0) {
        const actividadesDb = await ActividadModel.findAll({
          where: {
            Id_Actividad: {
              [Op.in]: actividadesIds,
            },
          },
          transaction,
        });

        if (actividadesDb.length !== actividadesIds.length) {
          throw new Error("Una o más actividades no existen");
        }

        const actividadEquipos = await ActividadEquipoModel.findAll({
          where: {
            Id_Actividad: {
              [Op.in]: actividadesIds,
            },
          },
          transaction,
        });

        const actividadMateriales = await ActividadMaterialModel.findAll({
          where: {
            Id_Actividad: {
              [Op.in]: actividadesIds,
            },
          },
          transaction,
        });

        const actividadReactivos = await ActividadReactivoModel.findAll({
          where: {
            Id_Actividad: {
              [Op.in]: actividadesIds,
            },
          },
          transaction,
        });

        equiposPermitidos = new Set(
          actividadEquipos.map((item) => Number(item.Id_Equipo))
        );
        materialesPermitidos = new Set(
          actividadMateriales.map((item) => Number(item.Id_Material))
        );
        reactivosPermitidos = new Set(
          actividadReactivos.map((item) => Number(item.Id_Reactivo))
        );
      }

      const equiposBody = Array.isArray(equipos) ? equipos : [];
      const materialesBody = Array.isArray(materiales) ? materiales : [];
      const reactivosBody = Array.isArray(reactivos) ? reactivos : [];

      if (Tip_Reserva === "Visita") {
        if (
          equiposBody.length > 0 ||
          materialesBody.length > 0 ||
          reactivosBody.length > 0
        ) {
          throw new Error("La reserva de visita no debe registrar recursos de actividades");
        }
      }

      for (const item of equiposBody) {
        if (!equiposPermitidos.has(Number(item.Id_Equipo))) {
          throw new Error(
            `El equipo ${item.Id_Equipo} no pertenece a las actividades seleccionadas`
          );
        }

        if (!item.Can_Equipos || Number(item.Can_Equipos) <= 0) {
          throw new Error(
            `La cantidad del equipo ${item.Id_Equipo} debe ser mayor a cero`
          );
        }
      }

      for (const item of materialesBody) {
        if (!materialesPermitidos.has(Number(item.Id_Material))) {
          throw new Error(
            `El material ${item.Id_Material} no pertenece a las actividades seleccionadas`
          );
        }

        if (!item.Can_Materiales || Number(item.Can_Materiales) <= 0) {
          throw new Error(
            `La cantidad del material ${item.Id_Material} debe ser mayor a cero`
          );
        }
      }

      for (const item of reactivosBody) {
        if (!reactivosPermitidos.has(Number(item.Id_Reactivo))) {
          throw new Error(
            `El reactivo ${item.Id_Reactivo} no pertenece a las actividades seleccionadas`
          );
        }

        if (!item.Can_Reactivo || Number(item.Can_Reactivo) <= 0) {
          throw new Error(
            `La cantidad del reactivo ${item.Id_Reactivo} debe ser mayor a cero`
          );
        }
      }

      const estadoSolicitado = await EstadoModel.findOne({
        where: { Tip_Estado: "Solicitado" },
        transaction,
      });

      if (!estadoSolicitado) {
        throw new Error("No existe el estado inicial 'Solicitado'");
      }

      const reserva = await ReservaModel.create(
        {
          Tip_Reserva,
          Nom_Solicitante,
          Doc_Solicitante,
          Tel_Solicitante,
          Cor_Solicitante,
          Can_Aprendices,
          Fec_Reserva,
          Hor_Reserva,
          Num_Ficha,
          Booleano: Booleano || "Activo",
        },
        { transaction }
      );

      for (const idActividad of actividadesIds) {
        await ReservaActividadModel.create(
          {
            Id_Reserva: reserva.Id_Reserva,
            Id_Actividad: idActividad,
          },
          { transaction }
        );
      }

      for (const item of equiposBody) {
        await ReservaEquipoModel.create(
          {
            Id_Reserva: reserva.Id_Reserva,
            Id_Equipo: Number(item.Id_Equipo),
            Can_Equipos: Number(item.Can_Equipos),
          },
          { transaction }
        );
      }

      for (const item of materialesBody) {
        await ReservaMaterialModel.create(
          {
            Id_Reserva: reserva.Id_Reserva,
            Id_Material: Number(item.Id_Material),
            Can_Materiales: Number(item.Can_Materiales),
          },
          { transaction }
        );
      }

      for (const item of reactivosBody) {
        await discountReactivoStock(Number(item.Id_Reactivo), Number(item.Can_Reactivo), reserva.Id_Reserva, transaction);
        await ReservaReactivoModel.create(
          {
            Id_Reserva: reserva.Id_Reserva,
            Id_Reactivo: Number(item.Id_Reactivo),
            Can_Reactivo: Number(item.Can_Reactivo),
          },
          { transaction }
        );
      }

      await ReservaEstadoModel.create(
        {
          Id_Reserva: reserva.Id_Reserva,
          Id_Estado: estadoSolicitado.Id_Estado,
          Mot_RecCan: null,
        },
        { transaction }
      );

      await transaction.commit();

      return reserva;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async cambiarEstado(idReserva, Id_Estado, Mot_RecCan = null, reactivosUtilizados = []) {
    const transaction = await db_store.transaction();

    try {
      const reserva = await ReservaModel.findByPk(idReserva, { transaction });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      const nuevoEstado = await EstadoModel.findByPk(Id_Estado, { transaction });

      if (!nuevoEstado) {
        throw new Error("Estado no encontrado");
      }

      const ultimoHistorial = await ReservaEstadoModel.findOne({
        where: { Id_Reserva: idReserva },
        order: [["Id_ReservaEstado", "DESC"]],
        transaction,
      });

      if (!ultimoHistorial) {
        throw new Error("La reserva no tiene historial de estados");
      }

      const estadoActual = await EstadoModel.findByPk(ultimoHistorial.Id_Estado, {
        transaction,
      });

      if (!estadoActual) {
        throw new Error("No se pudo determinar el estado actual de la reserva");
      }

      const transicionesValidas = {
        Solicitado: ["Aprobado", "Rechazado"],
        Aprobado: ["En proceso", "Cancelado"],
        "En proceso": ["Finalizado"],
        Rechazado: [],
        Cancelado: [],
        Finalizado: [],
      };

      const permitidos = transicionesValidas[estadoActual.Tip_Estado] || [];

      if (!permitidos.includes(nuevoEstado.Tip_Estado)) {
        throw new Error(
            `No se puede pasar de '${estadoActual.Tip_Estado}' a '${nuevoEstado.Tip_Estado}'`
        );
      }

      const requiereMotivo = ["Rechazado", "Cancelado"].includes(nuevoEstado.Tip_Estado);

      if (requiereMotivo && !String(Mot_RecCan || "").trim()) {
        throw new Error(`Debe registrar el motivo para el estado '${nuevoEstado.Tip_Estado}'`);
      }

      await ReservaEstadoModel.create(
        {
          Id_Reserva: Number(idReserva),
          Id_Estado: Number(Id_Estado),
          Mot_RecCan: requiereMotivo ? String(Mot_RecCan).trim() : null,
        },
        { transaction }
      );

      const estadosFinales = ["Rechazado", "Cancelado", "Finalizado"];
      if (estadosFinales.includes(nuevoEstado.Tip_Estado)) {
        await ReservaModel.update(
          { Booleano: "Inactivo" },
          { where: { Id_Reserva: idReserva }, transaction }
        );

        // Fetch reagents requested
        const oldReactivos = await ReservaReactivoModel.findAll({
          where: { Id_Reserva: idReserva },
          transaction
        });

        if (["Rechazado", "Cancelado"].includes(nuevoEstado.Tip_Estado)) {
          // Restore 100% of the requested reagents to stock
          for (const item of oldReactivos) {
            await restoreReactivoStock(
              Number(item.Id_Reactivo),
              Number(item.Can_Reactivo),
              idReserva,
              `Devolución por reserva ${nuevoEstado.Tip_Estado.toLowerCase()}`,
              transaction
            );
            // Registrar devolución de todos los reactivos solicitados
            await ReservaReactivoModel.update(
              { 
                Reac_Utilizados: 0,
                Reac_Devueltos: item.Can_Reactivo
              },
              { where: { Id_ReservaReactivo: item.Id_ReservaReactivo }, transaction }
            );
          }
        } else if (nuevoEstado.Tip_Estado === "Finalizado") {
          // Restore the unused difference to stock
          for (const item of oldReactivos) {
            const util = (reactivosUtilizados || []).find(
              (ru) => Number(ru.Id_Reactivo) === Number(item.Id_Reactivo)
            );
            const cantUtilizada = util ? Number(util.CantidadUtilizada) : Number(item.Can_Reactivo);

            if (cantUtilizada > Number(item.Can_Reactivo)) {
              throw new Error(`La cantidad utilizada del reactivo con ID ${item.Id_Reactivo} (${cantUtilizada}) no puede superar la cantidad pedida (${item.Can_Reactivo}).`);
            }

            const unused = Number(item.Can_Reactivo) - cantUtilizada;
            if (unused > 0) {
              await restoreReactivoStock(
                Number(item.Id_Reactivo),
                unused,
                idReserva,
                `Devolución de reactivo no utilizado por finalización de reserva`,
                transaction
              );
            }

            // Registrar cantidades reales utilizadas y devueltas, manteniendo Can_Reactivo
            await ReservaReactivoModel.update(
              { 
                Reac_Utilizados: cantUtilizada,
                Reac_Devueltos: unused
              },
              { where: { Id_ReservaReactivo: item.Id_ReservaReactivo }, transaction }
            );
          }
        }
      }

      // ============================================================
      // RECHAZO AUTOMÁTICO: Al aprobar, rechazar las demás del mismo día
      // ============================================================
      let reservasARechazar = [];
      if (nuevoEstado.Tip_Estado === "Aprobado") {
        const estadoRechazado = await EstadoModel.findOne({
          where: { Tip_Estado: 'Rechazado' },
          transaction
        });

        if (estadoRechazado) {
          // Buscar todas las reservas activas del mismo día, excluyendo la actual
          const otrasReservas = await ReservaModel.findAll({
            where: {
              Fec_Reserva: reserva.Fec_Reserva,
              Booleano: 'Activo',
              Id_Reserva: { [Op.ne]: idReserva }
            },
            transaction
          });

          const MOTIVO_AUTO = "Rechazada automáticamente: se aprobó otra reserva para la misma fecha. Por favor solicite una nueva reserva con otra fecha disponible.";

          for (const otraReserva of otrasReservas) {
            // Verificar que esté en estado Solicitado
            const ultimoHist = await ReservaEstadoModel.findOne({
              where: { Id_Reserva: otraReserva.Id_Reserva },
              order: [["Id_ReservaEstado", "DESC"]],
              transaction
            });

            if (!ultimoHist) continue;

            const estActual = await EstadoModel.findByPk(ultimoHist.Id_Estado, { transaction });
            if (!estActual || estActual.Tip_Estado !== 'Solicitado') continue;

            // Crear historial de rechazo
            await ReservaEstadoModel.create({
              Id_Reserva: otraReserva.Id_Reserva,
              Id_Estado: estadoRechazado.Id_Estado,
              Mot_RecCan: MOTIVO_AUTO
            }, { transaction });

            // Marcar como inactiva
            await ReservaModel.update(
              { Booleano: 'Inactivo' },
              { where: { Id_Reserva: otraReserva.Id_Reserva }, transaction }
            );

            // Restaurar reactivos de la reserva rechazada
            const reactivosOtra = await ReservaReactivoModel.findAll({
              where: { Id_Reserva: otraReserva.Id_Reserva },
              transaction
            });

            for (const item of reactivosOtra) {
              await restoreReactivoStock(
                Number(item.Id_Reactivo),
                Number(item.Can_Reactivo),
                otraReserva.Id_Reserva,
                `Devolución por rechazo automático de reserva`,
                transaction
              );
              await ReservaReactivoModel.update(
                { Reac_Utilizados: 0, Reac_Devueltos: item.Can_Reactivo },
                { where: { Id_ReservaReactivo: item.Id_ReservaReactivo }, transaction }
              );
            }

            // Guardar datos para enviar emails después del commit
            reservasARechazar.push({
              correo: otraReserva.Cor_Solicitante,
              nombre: otraReserva.Nom_Solicitante,
              idReserva: otraReserva.Id_Reserva,
              fecha: otraReserva.Fec_Reserva,
              motivo: MOTIVO_AUTO
            });

            console.log(`[AUTO-RECHAZO] Reserva #${otraReserva.Id_Reserva} rechazada automáticamente por aprobación de #${idReserva}`);
          }
        }
      }

      await transaction.commit();

      // ============================================================
      // ENVÍO DE EMAILS (después del commit para no bloquear la BD)
      // ============================================================

      // Emails para reservas rechazadas automáticamente
      for (const data of reservasARechazar) {
        try {
          await enviarCorreoRechazo(
            data.correo,
            data.nombre,
            data.idReserva,
            data.fecha,
            data.motivo
          );
        } catch (emailError) {
          console.error(`[EMAIL] Error enviando correo a ${data.correo}:`, emailError.message);
        }
      }

      // Email al rechazar o cancelar manualmente
      if (["Rechazado", "Cancelado"].includes(nuevoEstado.Tip_Estado)) {
        try {
          await enviarCorreoRechazo(
            reserva.Cor_Solicitante,
            reserva.Nom_Solicitante,
            reserva.Id_Reserva,
            reserva.Fec_Reserva,
            String(Mot_RecCan).trim()
          );
        } catch (emailError) {
          console.error(`[EMAIL] Error enviando correo de rechazo manual a ${reserva.Cor_Solicitante}:`, emailError.message);
        }
      }

      // Email al aprobar la reserva manualmente
      if (nuevoEstado.Tip_Estado === "Aprobado") {
        try {
          await enviarCorreoAprobacion(
            reserva.Cor_Solicitante,
            reserva.Nom_Solicitante,
            reserva.Id_Reserva,
            reserva.Fec_Reserva
          );
        } catch (emailError) {
          console.error(`[EMAIL] Error enviando correo de aprobación a ${reserva.Cor_Solicitante}:`, emailError.message);
        }
      }

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(id, data) {
    const transaction = await db_store.transaction();
    try {
      const {
        Tip_Reserva,
        Nom_Solicitante,
        Doc_Solicitante,
        Tel_Solicitante,
        Cor_Solicitante,
        Can_Aprendices,
        Fec_Reserva,
        Hor_Reserva,
        Num_Ficha,
        Booleano,
        actividades,
        equipos,
        materiales,
        reactivos,
      } = data;

      // Actualizar datos básicos
      await ReservaModel.update({
        Tip_Reserva,
        Nom_Solicitante,
        Doc_Solicitante,
        Tel_Solicitante,
        Cor_Solicitante,
        Can_Aprendices,
        Fec_Reserva,
        Hor_Reserva,
        Num_Ficha,
        Booleano,
      }, { 
        where: { Id_Reserva: id },
        transaction 
      });

      // Si vienen recursos (edición completa), actualizar tablas intermedias
      if (actividades || equipos || materiales || reactivos) {
        // Find old reactivos and restore stock before destroying
        const oldReactivos = await ReservaReactivoModel.findAll({ where: { Id_Reserva: id }, transaction });
        for (const old of oldReactivos) {
          await restoreReactivoStock(
            Number(old.Id_Reactivo),
            Number(old.Can_Reactivo),
            id,
            `Devolución por edición de reserva`,
            transaction
          );
        }

        // 1. Eliminar asociaciones actuales
        await ReservaActividadModel.destroy({ where: { Id_Reserva: id }, transaction });
        await ReservaEquipoModel.destroy({ where: { Id_Reserva: id }, transaction });
        await ReservaMaterialModel.destroy({ where: { Id_Reserva: id }, transaction });
        await ReservaReactivoModel.destroy({ where: { Id_Reserva: id }, transaction });

        // 2. Crear nuevas asociaciones
        if (Array.isArray(actividades)) {
          for (const idAct of actividades) {
            await ReservaActividadModel.create({ Id_Reserva: id, Id_Actividad: idAct }, { transaction });
          }
        }

        if (Array.isArray(equipos)) {
          for (const eq of equipos) {
            await ReservaEquipoModel.create({ 
              Id_Reserva: id, 
              Id_Equipo: eq.Id_Equipo, 
              Can_Equipos: eq.Can_Equipos 
            }, { transaction });
          }
        }

        if (Array.isArray(materiales)) {
          for (const mat of materiales) {
            await ReservaMaterialModel.create({ 
              Id_Reserva: id, 
              Id_Material: mat.Id_Material, 
              Can_Materiales: mat.Can_Materiales 
            }, { transaction });
          }
        }

        if (Array.isArray(reactivos)) {
          for (const reac of reactivos) {
            await discountReactivoStock(Number(reac.Id_Reactivo), Number(reac.Can_Reactivo), id, transaction);
            await ReservaReactivoModel.create({ 
              Id_Reserva: id, 
              Id_Reactivo: reac.Id_Reactivo, 
              Can_Reactivo: reac.Can_Reactivo 
            }, { transaction });
          }
        }
      }

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id) {
    const transaction = await db_store.transaction();
    try {
      const oldReactivos = await ReservaReactivoModel.findAll({ where: { Id_Reserva: id }, transaction });
      for (const old of oldReactivos) {
        await restoreReactivoStock(
          Number(old.Id_Reactivo),
          Number(old.Can_Reactivo),
          id,
          `Devolución por eliminación de reserva`,
          transaction
        );
      }

      await ReservaActividadModel.destroy({ where: { Id_Reserva: id }, transaction });
      await ReservaEquipoModel.destroy({ where: { Id_Reserva: id }, transaction });
      await ReservaMaterialModel.destroy({ where: { Id_Reserva: id }, transaction });
      await ReservaReactivoModel.destroy({ where: { Id_Reserva: id }, transaction });
      await ReservaEstadoModel.destroy({ where: { Id_Reserva: id }, transaction });

      const deleted = await ReservaModel.destroy({ where: { Id_Reserva: id }, transaction });
      if (deleted === 0) throw new Error("Reserva no encontrada");

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new ReservaService();