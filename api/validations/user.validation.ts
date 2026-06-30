import { HttpError } from "../utils/httpError";
import type { ClientePayload, ServicioPayload } from "../types/user.types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedTiposIdentificacion = ["CC", "TI", "CE", "RC"];
const allowedServicios = [
  "INTERNET 200 MB",
  "INTERNET 400 MB",
  "INTERNET 600 MB",
  "Directv Go",
  "Paramount+",
];

const normalizeText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeDate = (value: unknown) => normalizeText(value);

const normalizeInteger = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return Number.NaN;
  return Number(value);
};

const isValidDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

export const validateTipoIdentificacionFilter = (value: unknown): string | undefined => {
  if (!value) return undefined;
  const tipoIdentificacion = normalizeText(value).toUpperCase();
  if (allowedTiposIdentificacion.includes(tipoIdentificacion)) return tipoIdentificacion;
  throw new HttpError(400, "El tipo de identificacion enviado no es valido.");
};

const validateServicio = (servicio: ServicioPayload) => {
  if (!servicio.servicio) {
    throw new HttpError(400, "No se permiten datos en blanco.");
  }
  if (!allowedServicios.includes(servicio.servicio) || servicio.servicio.length > 80) {
    throw new HttpError(400, "El servicio enviado no es valido.");
  }
  if (!isValidDate(servicio.fechaInicio)) throw new HttpError(400, "La fecha de inicio no es valida.");
  if (!isValidDate(servicio.ultimaFacturacion)) {
    throw new HttpError(400, "La ultima facturacion no es valida.");
  }
  if (!Number.isInteger(servicio.ultimoPago) || servicio.ultimoPago < 0) {
    throw new HttpError(400, "El ultimo pago debe ser un entero mayor o igual a 0.");
  }
};

const normalizeServicios = (value: unknown): ServicioPayload[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new HttpError(400, "Los servicios deben enviarse como una lista.");

  return value.map((item) => {
    const data = item as Record<string, unknown>;
    const servicio: ServicioPayload = {
      servicio: normalizeText(data.servicio),
      fechaInicio: normalizeDate(data.fechaInicio),
      ultimaFacturacion: normalizeDate(data.ultimaFacturacion),
      ultimoPago: normalizeInteger(data.ultimoPago),
    };

    validateServicio(servicio);
    return servicio;
  });
};

const validateCliente = (payload: Partial<ClientePayload>) => {
  if (
    payload.identificacion === ""
    || payload.nombres === ""
    || payload.apellidos === ""
    || payload.tipoIdentificacion === ""
    || payload.fechaNacimiento === ""
    || payload.numeroCelular === ""
    || payload.correoElectronico === ""
  ) {
    throw new HttpError(400, "No se permiten datos en blanco.");
  }
  if (payload.identificacion !== undefined && (payload.identificacion.length < 1 || payload.identificacion.length > 20)) {
    throw new HttpError(400, "La identificacion debe tener entre 1 y 20 caracteres.");
  }
  if (payload.nombres !== undefined && (payload.nombres.length < 2 || payload.nombres.length > 80)) {
    throw new HttpError(400, "Los nombres deben tener entre 2 y 80 caracteres.");
  }
  if (payload.apellidos !== undefined && (payload.apellidos.length < 2 || payload.apellidos.length > 80)) {
    throw new HttpError(400, "Los apellidos deben tener entre 2 y 80 caracteres.");
  }
  if (
    payload.tipoIdentificacion !== undefined
    && !allowedTiposIdentificacion.includes(payload.tipoIdentificacion)
  ) {
    throw new HttpError(400, "El tipo de identificacion no es valido.");
  }
  if (payload.fechaNacimiento !== undefined && !isValidDate(payload.fechaNacimiento)) {
    throw new HttpError(400, "La fecha de nacimiento no es valida.");
  }
  if (
    payload.numeroCelular !== undefined
    && (payload.numeroCelular.length < 5 || payload.numeroCelular.length > 20)
  ) {
    throw new HttpError(400, "El numero celular debe tener entre 5 y 20 caracteres.");
  }
  if (payload.correoElectronico !== undefined && !emailPattern.test(payload.correoElectronico)) {
    throw new HttpError(400, "El correo electronico no tiene un formato valido.");
  }
};

export const validateCreateCliente = (body: unknown): ClientePayload => {
  const data = body as Record<string, unknown>;
  const payload: ClientePayload = {
    identificacion: normalizeText(data.identificacion),
    nombres: normalizeText(data.nombres),
    apellidos: normalizeText(data.apellidos),
    tipoIdentificacion: normalizeText(data.tipoIdentificacion).toUpperCase(),
    fechaNacimiento: normalizeDate(data.fechaNacimiento),
    numeroCelular: normalizeText(data.numeroCelular),
    correoElectronico: normalizeText(data.correoElectronico).toLowerCase(),
    servicios: normalizeServicios(data.servicios),
  };

  validateCliente(payload);

  return payload;
};

export const validateCreateServicio = (body: unknown): ServicioPayload => {
  const data = body as Record<string, unknown>;
  const payload: ServicioPayload = {
    servicio: normalizeText(data.servicio),
    fechaInicio: normalizeDate(data.fechaInicio),
    ultimaFacturacion: normalizeDate(data.ultimaFacturacion),
    ultimoPago: normalizeInteger(data.ultimoPago),
  };

  validateServicio(payload);
  return payload;
};

export const validateUpdateCliente = (body: unknown): Partial<ClientePayload> => {
  const data = body as Record<string, unknown>;
  const payload: Partial<ClientePayload> = {};

  if ("identificacion" in data) payload.identificacion = normalizeText(data.identificacion);
  if ("nombres" in data) payload.nombres = normalizeText(data.nombres);
  if ("apellidos" in data) payload.apellidos = normalizeText(data.apellidos);
  if ("tipoIdentificacion" in data) payload.tipoIdentificacion = normalizeText(data.tipoIdentificacion).toUpperCase();
  if ("fechaNacimiento" in data) payload.fechaNacimiento = normalizeDate(data.fechaNacimiento);
  if ("numeroCelular" in data) payload.numeroCelular = normalizeText(data.numeroCelular);
  if ("correoElectronico" in data) payload.correoElectronico = normalizeText(data.correoElectronico).toLowerCase();
  if ("servicios" in data) payload.servicios = normalizeServicios(data.servicios);

  validateCliente(payload);

  return payload;
};
