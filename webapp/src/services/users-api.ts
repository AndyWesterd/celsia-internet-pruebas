import { http } from "./http";
import type { Cliente, ClienteFilters, ClientePayload } from "@/types/user";

interface ApiCollectionResponse<T> {
  data: T[];
}

interface ApiResourceResponse<T> {
  data: T;
  message?: string;
}

const buildQuery = (filters: ClienteFilters) => {
  const params = new URLSearchParams();
  if (filters.q?.trim()) params.set("q", filters.q.trim());
  if (filters.tipoIdentificacion && filters.tipoIdentificacion !== "all") {
    params.set("tipoIdentificacion", filters.tipoIdentificacion);
  }
  return params.toString();
};

export const usersApi = {
  async list(filters: ClienteFilters = {}) {
    const query = buildQuery(filters);
    const response = await http<ApiCollectionResponse<Cliente>>(`/clientes${query ? `?${query}` : ""}`);
    return response.data;
  },

  async detail(identificacion: string) {
    const response = await http<ApiResourceResponse<Cliente>>(`/clientes/${encodeURIComponent(identificacion)}`);
    return response.data;
  },

  async create(payload: ClientePayload) {
    const response = await http<ApiResourceResponse<Cliente>>("/clientes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  async update(identificacion: string, payload: ClientePayload) {
    const response = await http<ApiResourceResponse<Cliente>>(`/clientes/${encodeURIComponent(identificacion)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  async remove(identificacion: string) {
    await http<void>(`/clientes/${encodeURIComponent(identificacion)}`, { method: "DELETE" });
  },

  async addService(identificacion: string, payload: ClientePayload["servicios"][number]) {
    const response = await http<ApiResourceResponse<Cliente>>(
      `/clientes/${encodeURIComponent(identificacion)}/servicios`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  },
};
