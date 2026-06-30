import { useCallback, useEffect, useMemo, useState } from "react";

import { usersApi } from "@/services/users-api";
import type { Cliente, ClienteFilters, ClientePayload } from "@/types/user";

export const useUsers = () => {
  const [users, setUsers] = useState<Cliente[]>([]);
  const [search, setSearch] = useState("");
  const [tipoIdentificacionFilter, setTipoIdentificacionFilter] = useState<string | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters: ClienteFilters = useMemo(
    () => ({ q: search, tipoIdentificacion: tipoIdentificacionFilter }),
    [search, tipoIdentificacionFilter],
  );

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

      try {
        setUsers(await usersApi.list(filters));
      } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Error cargando clientes.");
      } finally {
        setIsLoading(false);
      }
  }, [filters]);

  useEffect(() => {
    // Diferimos la carga para evitar setState sincronico durante el montaje del effect.
    const timeoutId = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadUsers]);

  const saveUser = async (payload: ClientePayload, identificacion?: string) => {
    setIsSaving(true);
    setError(null);

    try {
      if (identificacion) {
        await usersApi.update(identificacion, payload);
      } else {
        await usersApi.create(payload);
      }

      await loadUsers();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo guardar el cliente.";
      setError(message);
      throw new Error(message, { cause: requestError });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async (identificacion: string) => {
    setError(null);
    await usersApi.remove(identificacion);
    // Refrescamos desde API para mantener filtros y orden consistentes con el backend.
    await loadUsers();
  };

  return {
    users,
    search,
    tipoIdentificacionFilter,
    isLoading,
    isSaving,
    error,
    setSearch,
    setTipoIdentificacionFilter,
    loadUsers,
    saveUser,
    deleteUser,
  };
};
