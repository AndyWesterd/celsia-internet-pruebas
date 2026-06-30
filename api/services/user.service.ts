import { Op } from "sequelize";

import { sequelize } from "../database/sequelize";
import { Cliente, Servicio } from "../models";
import type { ClienteFilters, ClientePayload, ServicioPayload } from "../types/user.types";
import { HttpError } from "../utils/httpError";

const clienteInclude = [{ model: Servicio, as: "servicios" }];

const splitClientePayload = (payload: ClientePayload | Partial<ClientePayload>) => {
  const { servicios, ...cliente } = payload;
  return { cliente, servicios };
};

const withClienteId = (identificacion: string, servicios: ServicioPayload[] = []) =>
  servicios.map((servicio) => ({ ...servicio, identificacion }));

export const clienteService = {
  async findAll(filters: ClienteFilters) {
    const where = {
      ...(filters.tipoIdentificacion ? { tipoIdentificacion: filters.tipoIdentificacion } : {}),
      ...(filters.q
        ? {
            [Op.or]: [
              { identificacion: { [Op.iLike]: `%${filters.q}%` } },
              { nombres: { [Op.iLike]: `%${filters.q}%` } },
              { apellidos: { [Op.iLike]: `%${filters.q}%` } },
              { correoElectronico: { [Op.iLike]: `%${filters.q}%` } },
              { numeroCelular: { [Op.iLike]: `%${filters.q}%` } },
            ],
          }
        : {}),
    };

    return Cliente.findAll({
      where,
      include: clienteInclude,
      order: [
        ["apellidos", "ASC"],
        ["nombres", "ASC"],
        [{ model: Servicio, as: "servicios" }, "servicio", "ASC"],
      ],
    });
  },

  async findByIdentificacion(identificacion: string) {
    const cliente = await Cliente.findByPk(identificacion, { include: clienteInclude });
    if (!cliente) throw new HttpError(404, "Cliente no encontrado.");
    return cliente;
  },

  async create(payload: ClientePayload) {
    await this.ensureIdentificacionIsAvailable(payload.identificacion);
    await this.ensureEmailIsAvailable(payload.correoElectronico);
    this.ensureServiciosPayloadHasNoDuplicates(payload.servicios);

    const { cliente, servicios } = splitClientePayload(payload);

    await sequelize.transaction(async (transaction) => {
      await Cliente.create(cliente as ClientePayload, { transaction });
      if (servicios?.length) {
        await Servicio.bulkCreate(withClienteId(payload.identificacion, servicios), { transaction });
      }
    });

    return this.findByIdentificacion(payload.identificacion);
  },

  async update(identificacion: string, payload: Partial<ClientePayload>) {
    const clienteActual = await this.findByIdentificacion(identificacion);
    const nuevaIdentificacion = payload.identificacion ?? identificacion;

    if (payload.identificacion && payload.identificacion !== identificacion) {
      await this.ensureIdentificacionIsAvailable(payload.identificacion);
    }
    if (payload.correoElectronico && payload.correoElectronico !== clienteActual.correoElectronico) {
      await this.ensureEmailIsAvailable(payload.correoElectronico, identificacion);
    }
    this.ensureServiciosPayloadHasNoDuplicates(payload.servicios);

    const { cliente, servicios } = splitClientePayload(payload);

    await sequelize.transaction(async (transaction) => {
      await clienteActual.update(cliente, { transaction });

      if (servicios) {
        await Servicio.destroy({ where: { identificacion: nuevaIdentificacion }, transaction });
        if (servicios.length) {
          await Servicio.bulkCreate(withClienteId(nuevaIdentificacion, servicios), { transaction });
        }
      }
    });

    return this.findByIdentificacion(nuevaIdentificacion);
  },

  async remove(identificacion: string) {
    const cliente = await this.findByIdentificacion(identificacion);
    await sequelize.transaction(async (transaction) => {
      await Servicio.destroy({ where: { identificacion }, transaction });
      await cliente.destroy({ transaction });
    });
  },

  async createServicio(identificacion: string, payload: ServicioPayload) {
    await this.findByIdentificacion(identificacion);
    await this.ensureServicioIsAvailable(identificacion, payload.servicio);

    await Servicio.create({ ...payload, identificacion });

    return this.findByIdentificacion(identificacion);
  },

  async ensureIdentificacionIsAvailable(identificacion: string) {
    const existing = await Cliente.findByPk(identificacion);
    if (existing) {
      throw new HttpError(409, "El registro ya existe");
    }
  },

  async ensureEmailIsAvailable(correoElectronico: string, ignoredIdentificacion?: string) {
    const existing = await Cliente.findOne({ where: { correoElectronico } });
    if (existing && existing.identificacion !== ignoredIdentificacion) {
      throw new HttpError(409, "El registro ya existe");
    }
  },

  async ensureServicioIsAvailable(identificacion: string, servicio: string) {
    const existing = await Servicio.findOne({ where: { identificacion, servicio } });
    if (existing) {
      throw new HttpError(409, "El registro ya existe");
    }
  },

  ensureServiciosPayloadHasNoDuplicates(servicios: ServicioPayload[] = []) {
    const nombresServicios = servicios.map((servicio) => servicio.servicio);
    const serviciosUnicos = new Set(nombresServicios);

    if (serviciosUnicos.size !== nombresServicios.length) {
      throw new HttpError(409, "El registro ya existe");
    }
  },
};
