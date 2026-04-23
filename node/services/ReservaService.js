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

class ReservaService {
  async getAll() {
    const reservas = await ReservaModel.findAll({
      order: [["Id_Reserva", "DESC"]],
    });

    const reservasConEstado = await Promise.all(
      reservas.map(async (reserva) => {
        const ultimoHistorial = await ReservaEstadoModel.findOne({
          where: { Id_Reserva: reserva.Id_Reserva },
          order: [["Id_ReservaEstado", "DESC"]],
        });

        let estadoActual = "";
        let motivoActual = "";

        if (ultimoHistorial) {
          const estado = await EstadoModel.findByPk(ultimoHistorial.Id_Estado);
          estadoActual = estado?.Tip_Estado ?? "";
          motivoActual = ultimoHistorial.Mot_RecCan ?? "";
        }

        return {
          ...reserva.toJSON(),
          Des_Estado: estadoActual,
          Mot_RecCan: motivoActual,
        };
      })
    );

    return reservasConEstado;
  }

  async getById(id) {
    const reserva = await ReservaModel.findByPk(id);

    if (!reserva) throw new Error("Reserva no encontrada");

    const actividades = await ReservaActividadModel.findAll({
      where: { Id_Reserva: id },
    });

    const equipos = await ReservaEquipoModel.findAll({
      where: { Id_Reserva: id },
    });

    const materiales = await ReservaMaterialModel.findAll({
      where: { Id_Reserva: id },
    });

    const reactivos = await ReservaReactivoModel.findAll({
      where: { Id_Reserva: id },
    });

    const estados = await ReservaEstadoModel.findAll({
      where: { Id_Reserva: id },
      order: [["Id_ReservaEstado", "DESC"]],
    });

    return {
      reserva,
      actividades,
      equipos,
      materiales,
      reactivos,
      estados,
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

      const reservaActivaMismoTipo = await ReservaModel.findOne({
        where: {
          Fec_Reserva,
          Tip_Reserva,
          Booleano: "Activo",
        },
        transaction,
      });

      if (reservaActivaMismoTipo) {
        throw new Error(
          `Ya existe una reserva activa de tipo ${Tip_Reserva} para la fecha ${Fec_Reserva}`
        );
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

  async cambiarEstado(idReserva, Id_Estado, Mot_RecCan = null) {
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
      }

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(id, data) {
    const result = await ReservaModel.update(data, { where: { Id_Reserva: id } });
    const updated = result[0];

    if (updated === 0) throw new Error("Reserva no encontrada o sin cambios");

    return true;
  }

  async delete(id) {
    const deleted = await ReservaModel.destroy({ where: { Id_Reserva: id } });
    if (deleted === 0) throw new Error("Reserva no encontrada");
    return true;
  }
}

export default new ReservaService();