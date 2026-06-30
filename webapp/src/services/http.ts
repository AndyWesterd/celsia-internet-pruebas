const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

interface ApiErrorResponse {
  message?: string;
}

export const http = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = "No se pudo completar la solicitud.";

    try {
      const errorBody = (await response.json()) as ApiErrorResponse;
      message = errorBody.message ?? message;
    } catch {
      message = "No se pudo completar la solicitud.";
    }

    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};
