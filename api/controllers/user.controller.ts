import type { Request, Response } from "express";

import { clienteService } from "../services/user.service";
import {
  validateCreateCliente,
  validateCreateServicio,
  validateTipoIdentificacionFilter,
  validateUpdateCliente,
} from "../validations/user.validation";
import { HttpError } from "../utils/httpError";

const parseIdentificacion = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, "La identificacion del cliente no es valida.");
  }
  return value.trim();
};

export const clienteController = {
  async list(req: Request, res: Response) {
    const clientes = await clienteService.findAll({
      q: typeof req.query.q === "string" ? req.query.q.trim() : undefined,
      tipoIdentificacion: validateTipoIdentificacionFilter(req.query.tipoIdentificacion),
    });

    res.json({ data: clientes });
  },

  async detail(req: Request, res: Response) {
    const cliente = await clienteService.findByIdentificacion(parseIdentificacion(req.params.identificacion));
    res.json({ data: cliente });
  },

  async create(req: Request, res: Response) {
    const cliente = await clienteService.create(validateCreateCliente(req.body));
    res.status(201).json({ data: cliente, message: "Cliente creado correctamente." });
  },

  async createServicio(req: Request, res: Response) {
    const cliente = await clienteService.createServicio(
      parseIdentificacion(req.params.identificacion),
      validateCreateServicio(req.body),
    );
    res.status(201).json({ data: cliente, message: "Servicio registrado correctamente." });
  },

  async update(req: Request, res: Response) {
    const cliente = await clienteService.update(
      parseIdentificacion(req.params.identificacion),
      validateUpdateCliente(req.body),
    );
    res.json({ data: cliente, message: "Cliente actualizado correctamente." });
  },

  async remove(req: Request, res: Response) {
    await clienteService.remove(parseIdentificacion(req.params.identificacion));
    res.status(204).send();
  },
};
