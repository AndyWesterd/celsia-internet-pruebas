import { Calendar, Mail, Pencil, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Cliente } from "@/types/user";

interface UsersTableProps {
  users: Cliente[];
  isLoading: boolean;
  onEdit: (user: Cliente) => void;
  onDelete: (user: Cliente) => void;
}

const formatDate = (value: string) => {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "COP",
  }).format(value);

export function UsersTable({ users, isLoading, onEdit, onDelete }: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="grid min-h-72 place-items-center bg-zinc-950 p-6 text-sm text-zinc-400">
        <div className="w-full max-w-xl space-y-3">
          <Skeleton className="mx-auto mb-5 size-10 rounded-full bg-[rgba(237,111,28,0.22)]" />
          <Skeleton className="h-10 bg-white/10" />
          <Skeleton className="h-10 bg-white/10" />
          <Skeleton className="h-10 bg-white/10" />
          <p className="pt-2 text-center">Cargando clientes</p>
        </div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="grid min-h-72 place-items-center bg-zinc-950 p-6 text-center">
        <div>
          <Users className="mx-auto mb-3 size-9 text-zinc-500" />
          <h2 className="text-xl font-semibold text-white">Sin resultados</h2>
          <p className="mt-1 text-sm text-zinc-400">Ajusta los filtros o crea el primer cliente.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden bg-zinc-950 md:block">
        <Table className="table-fixed text-left">
          <TableHeader className="border-b border-white/10 bg-white/3 text-xs uppercase text-zinc-500">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="px-4 py-3 font-semibold text-zinc-500">Cliente</TableHead>
              <TableHead className="px-4 py-3 font-semibold text-zinc-500">Contacto</TableHead>
              <TableHead className="px-4 py-3 font-semibold text-zinc-500">Nacimiento</TableHead>
              <TableHead className="px-4 py-3 font-semibold text-zinc-500">Servicios</TableHead>
              <TableHead className="w-28 px-4 py-3 text-right font-semibold text-zinc-500">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/10">
            {users.map((user) => (
              <TableRow key={user.identificacion} className="border-white/10 transition hover:bg-white/3">
                <TableCell className="px-4 py-4">
                  <p className="truncate font-medium text-white">{user.nombres} {user.apellidos}</p>
                  <p className="mt-1 text-xs text-zinc-500">{user.tipoIdentificacion} {user.identificacion}</p>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <p className="flex items-center gap-2 truncate text-zinc-200">
                    <Mail className="size-4 text-zinc-500" />
                    {user.correoElectronico}
                  </p>
                  <p className="mt-1 truncate text-xs text-zinc-500">{user.numeroCelular}</p>
                </TableCell>
                <TableCell className="px-4 py-4 text-zinc-300">
                  <span className="flex items-center gap-2">
                    <Calendar className="size-4 text-zinc-500" />
                    {formatDate(user.fechaNacimiento)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-4 text-zinc-300">
                  {user.servicios?.length ? (
                    <div className="space-y-1">
                      <p className="truncate font-medium text-zinc-200">{user.servicios[0].servicio}</p>
                      <p className="text-xs text-zinc-500">
                        {user.servicios.length} servicio(s), ultimo pago {formatMoney(user.servicios[0].ultimoPago)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-zinc-500">Sin servicios</span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button size="icon-sm" variant="ghost" aria-label="Editar cliente" onClick={() => onEdit(user)}>
                      <Pencil />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="destructive"
                      aria-label="Eliminar cliente"
                      onClick={() => onDelete(user)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 bg-zinc-950 p-3 md:hidden">
        {users.map((user) => (
          <Card key={user.identificacion} className="border-white/10 bg-white/3 py-0 text-left">
            <CardHeader className="grid-cols-[1fr_auto] p-4 pb-0">
              <div className="min-w-0">
                <CardTitle className="truncate text-lg text-white">{user.nombres} {user.apellidos}</CardTitle>
                <p className="mt-1 truncate text-sm text-zinc-400">{user.correoElectronico}</p>
              </div>
              <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-zinc-300">
                {user.tipoIdentificacion}
              </span>
            </CardHeader>
            <CardContent className="grid gap-2 p-4 text-sm text-zinc-300">
              <p>Identificacion: {user.identificacion}</p>
              <p>Celular: {user.numeroCelular}</p>
              <p>Nacimiento: {formatDate(user.fechaNacimiento)}</p>
              <p>Servicios: {user.servicios?.length ?? 0}</p>
            </CardContent>
            <CardFooter className="flex gap-2 border-t border-white/10 bg-transparent p-4">
              <Button className="flex-1" variant="outline" onClick={() => onEdit(user)}>
                <Pencil />
                Editar
              </Button>
              <Button className="flex-1" variant="destructive" onClick={() => onDelete(user)}>
                <Trash2 />
                Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
