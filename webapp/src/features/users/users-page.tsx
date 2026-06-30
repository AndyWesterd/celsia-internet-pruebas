import {
  BadgeCheck,
  IdCard,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MetricCard } from "./components/metric-card";
import { UsersTable } from "./components/users-table";
import { UserForm } from "./user-form";
import { ClientLookupForm } from "./components/client-lookup-form";
import { ServiceRegistrationForm } from "./components/service-registration-form";
import { tiposIdentificacion } from "./constants/catalogs";
import { usersApi } from "@/services/users-api";
import { useUsers } from "@/hooks/useUsers";
import type { Cliente, ServicioPayload } from "@/types/user";

export function UsersPage() {
  const {
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
  } = useUsers();
  const [selectedUser, setSelectedUser] = useState<Cliente | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Cliente | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingService, setIsSavingService] = useState(false);
  const [lookupClient, setLookupClient] = useState<Cliente | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const stats = useMemo(() => {
    const conServicios = users.filter((user) => (user.servicios?.length ?? 0) > 0).length;
    return {
      total: users.length,
      conServicios,
      sinServicios: users.length - conServicios,
    };
  }, [users]);

  const openCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const openEdit = (user: Cliente) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleSaveUser = async (payload: Parameters<typeof saveUser>[0], identificacion?: string) => {
    try {
      await saveUser(payload, identificacion);
      toast.success(identificacion ? "Cliente actualizado" : "Cliente creado", {
        description: `${payload.nombres} ${payload.apellidos} se guardo correctamente.`,
      });
    } catch (saveError) {
      toast.error("No se pudo guardar el cliente", {
        description: saveError instanceof Error ? saveError.message : "Revisa los datos e intenta nuevamente.",
      });
      throw saveError;
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    const deletedUserName = `${userToDelete.nombres} ${userToDelete.apellidos}`;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.identificacion);
      setUserToDelete(null);
      toast.success("Cliente eliminado", {
        description: `${deletedUserName} fue eliminado correctamente.`,
      });
    } catch (deleteError) {
      toast.error("No se pudo eliminar el cliente", {
        description: deleteError instanceof Error ? deleteError.message : "Intenta nuevamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRegisterService = async (identificacion: string, payload: ServicioPayload) => {
    setIsSavingService(true);
    try {
      const cliente = await usersApi.addService(identificacion, payload);
      setLookupClient(cliente);
      await loadUsers();
      toast.success("Servicio registrado", {
        description: `${payload.servicio} fue agregado al cliente ${identificacion}.`,
      });
    } catch (serviceError) {
      toast.error("No se pudo registrar el servicio", {
        description: serviceError instanceof Error ? serviceError.message : "Revisa los datos e intenta nuevamente.",
      });
      throw serviceError;
    } finally {
      setIsSavingService(false);
    }
  };

  const handleLookupClient = async (identificacion: string) => {
    setIsLookingUp(true);
    setLookupError(null);
    setLookupClient(null);

    try {
      setLookupClient(await usersApi.detail(identificacion));
    } catch (lookupRequestError) {
      setLookupError(lookupRequestError instanceof Error ? lookupRequestError.message : "Cliente no encontrado.");
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <main className="dark min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-white/10 bg-[linear-gradient(135deg,#09090b_0%,#211206_48%,#1b1608_100%)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="text-left">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase text-[#FFB37A]">
                <ShieldCheck className="size-4" />
                Prueba tecnica - crud celsia internet
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Clientes</h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-300">
                Gestiona clientes y sus servicios con busqueda, filtros y acciones CRUD conectadas a la API.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => void loadUsers()}>
                <RefreshCw className={isLoading ? "animate-spin" : ""} />
                Recargar
              </Button>
              <Button onClick={openCreate}>
                <Plus />
                Nuevo cliente
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard icon={<Users />} label="Clientes" value={stats.total} />
            <MetricCard icon={<BadgeCheck />} label="Con servicios" value={stats.conServicios} tone="brand" />
            <MetricCard icon={<IdCard />} label="Sin servicios" value={stats.sinServicios} tone="amber" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 pb-5 lg:grid-cols-2">
          <ServiceRegistrationForm isSaving={isSavingService} onSubmit={handleRegisterService} />
          <ClientLookupForm
            cliente={lookupClient}
            error={lookupError}
            isLoading={isLookingUp}
            onSearch={handleLookupClient}
          />
        </div>

        <div className="flex flex-col gap-3 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-zinc-500 focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
              placeholder="Buscar por identificacion, nombre, correo o celular"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", ...tiposIdentificacion] as const).map((tipo) => (
              <Button
                key={tipo}
                type="button"
                onClick={() => setTipoIdentificacionFilter(tipo)}
                variant={tipoIdentificacionFilter === tipo ? "default" : "outline"}
                className={
                  tipoIdentificacionFilter === tipo
                    ? "h-10 border-[#ED6F1C] bg-[#ED6F1C] text-[#140a04] hover:bg-[#ff8a3d]"
                    : "h-10 border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/20 hover:bg-white/[0.07]"
                }
              >
                {tipo === "all" ? "Todos" : tipo}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-white/10" />

        {error ? (
          <p className="mt-4 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-left text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
          <UsersTable users={users} isLoading={isLoading} onEdit={openEdit} onDelete={setUserToDelete} />
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Eliminar cliente"
        description={
          <>
            Esta accion eliminara a{" "}
            <span className="font-medium text-white">{userToDelete?.nombres} {userToDelete?.apellidos}</span>.
            Puedes cancelar si necesitas revisar la informacion.
          </>
        }
        confirmLabel={isDeleting ? "Eliminando" : "Eliminar"}
        isConfirming={isDeleting}
        variant="destructive"
        icon={<Trash2 className="size-5 text-red-200" />}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />

      <UserForm
        key={isFormOpen ? selectedUser?.identificacion ?? "new-user-open" : "user-form-closed"}
        user={selectedUser}
        isOpen={isFormOpen}
        isSaving={isSaving}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveUser}
      />
    </main>
  );
}
