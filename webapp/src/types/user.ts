export interface Servicio {
  identificacion: string;
  servicio: string;
  fechaInicio: string;
  ultimaFacturacion: string;
  ultimoPago: number;
}

export interface ServicioPayload {
  servicio: string;
  fechaInicio: string;
  ultimaFacturacion: string;
  ultimoPago: number;
}

export interface Cliente {
  identificacion: string;
  nombres: string;
  apellidos: string;
  tipoIdentificacion: string;
  fechaNacimiento: string;
  numeroCelular: string;
  correoElectronico: string;
  servicios?: Servicio[];
}

export interface ClientePayload {
  identificacion: string;
  nombres: string;
  apellidos: string;
  tipoIdentificacion: string;
  fechaNacimiento: string;
  numeroCelular: string;
  correoElectronico: string;
  servicios: ServicioPayload[];
}

export interface ClienteFilters {
  q?: string;
  tipoIdentificacion?: string | "all";
}
