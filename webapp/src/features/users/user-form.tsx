import { Check, Loader2, Plus, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviciosDisponibles, tiposIdentificacion } from "./constants/catalogs";
import type { Cliente, ClientePayload, ServicioPayload } from "@/types/user";

const emptyService: ServicioPayload = {
  servicio: "",
  fechaInicio: "",
  ultimaFacturacion: "",
  ultimoPago: 0,
};

const emptyForm: ClientePayload = {
  identificacion: "",
  nombres: "",
  apellidos: "",
  tipoIdentificacion: "CC",
  fechaNacimiento: "",
  numeroCelular: "",
  correoElectronico: "",
  servicios: [],
};

interface UserFormProps {
  user: Cliente | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (payload: ClientePayload, identificacion?: string) => Promise<void>;
}

const getInitialForm = (user: Cliente | null): ClientePayload =>
  user
    ? {
        identificacion: user.identificacion,
        nombres: user.nombres,
        apellidos: user.apellidos,
        tipoIdentificacion: user.tipoIdentificacion,
        fechaNacimiento: user.fechaNacimiento,
        numeroCelular: user.numeroCelular,
        correoElectronico: user.correoElectronico,
        servicios: user.servicios?.map(({ servicio, fechaInicio, ultimaFacturacion, ultimoPago }) => ({
          servicio,
          fechaInicio,
          ultimaFacturacion,
          ultimoPago,
        })) ?? [],
      }
    : emptyForm;

export function UserForm({ user, isOpen, isSaving, onClose, onSubmit }: UserFormProps) {
  const [form, setForm] = useState<ClientePayload>(() => getInitialForm(user));
  const [formError, setFormError] = useState<string | null>(null);

  const updateField = (field: keyof ClientePayload, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === "tipoIdentificacion" ? value.toUpperCase().slice(0, 2) : value,
    }));
  };

  const addService = () => {
    setForm((current) => ({
      ...current,
      servicios: [...current.servicios, emptyService],
    }));
  };

  const removeService = (index: number) => {
    setForm((current) => ({
      ...current,
      servicios: current.servicios.filter((_, serviceIndex) => serviceIndex !== index),
    }));
  };

  const updateService = (index: number, field: keyof ServicioPayload, value: string) => {
    setForm((current) => ({
      ...current,
      servicios: current.servicios.map((servicio, serviceIndex) =>
        serviceIndex === index
          ? {
              ...servicio,
              [field]: field === "ultimoPago" ? Number(value) : value,
            }
          : servicio,
      ),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    try {
      await onSubmit(form, user?.identificacion);
      setForm(emptyForm);
      onClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No se pudo guardar el cliente.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] p-0">
        <form onSubmit={handleSubmit} className="flex max-h-[calc(100dvh-2rem)] min-h-0 flex-col">
          <DialogHeader className="grid grid-cols-[1fr_auto] items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-[#FFB37A]">
                {user ? "Editar cliente" : "Nuevo cliente"}
              </p>
              <DialogTitle className="mt-1">
                {user ? "Actualiza la informacion" : "Registra un cliente"}
              </DialogTitle>
              <DialogDescription>
                {user ? "Modifica los datos del registro seleccionado." : "Completa los datos para crear el cliente."}
              </DialogDescription>
            </div>
            <Button type="button" size="icon" variant="ghost" aria-label="Cerrar formulario" onClick={onClose}>
              <X />
            </Button>
          </DialogHeader>

          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
            <div className="grid gap-2 text-left">
              <Label htmlFor="identificacion" className="text-zinc-200">
                Identificacion
              </Label>
              <Input
                id="identificacion"
                value={form.identificacion}
                onChange={(event) => updateField("identificacion", event.target.value)}
                className="h-11 border-white/10 bg-white/[0.04] text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
                placeholder="1020304050"
                required
              />
            </div>

            <div className="grid gap-2 text-left">
              <Label className="text-zinc-200">Tipo</Label>
              <Select
                value={form.tipoIdentificacion}
                onValueChange={(value) => value && updateField("tipoIdentificacion", value)}
              >
                <SelectTrigger className="h-11 w-full border-white/10 bg-white/[0.04] text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-950 text-white">
                  {tiposIdentificacion.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 text-left">
              <Label htmlFor="nombres" className="text-zinc-200">
                Nombres
              </Label>
              <Input
                id="nombres"
                value={form.nombres}
                onChange={(event) => updateField("nombres", event.target.value)}
                className="h-11 border-white/10 bg-white/[0.04] text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
                placeholder="Ana Maria"
                required
              />
            </div>

            <div className="grid gap-2 text-left">
              <Label htmlFor="apellidos" className="text-zinc-200">
                Apellidos
              </Label>
              <Input
                id="apellidos"
                value={form.apellidos}
                onChange={(event) => updateField("apellidos", event.target.value)}
                className="h-11 border-white/10 bg-white/[0.04] text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
                placeholder="Martinez Ruiz"
                required
              />
            </div>

            <div className="grid gap-2 text-left">
              <Label htmlFor="fechaNacimiento" className="text-zinc-200">
                Fecha de nacimiento
              </Label>
              <Input
                id="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={(event) => updateField("fechaNacimiento", event.target.value)}
                className="h-11 border-white/10 bg-white/[0.04] text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
                type="date"
                required
              />
            </div>

            <div className="grid gap-2 text-left">
              <Label htmlFor="numeroCelular" className="text-zinc-200">
                Numero celular
              </Label>
              <Input
                id="numeroCelular"
                value={form.numeroCelular}
                onChange={(event) => updateField("numeroCelular", event.target.value)}
                className="h-11 border-white/10 bg-white/[0.04] text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
                placeholder="+57 300 000 0000"
                required
              />
            </div>

            <div className="grid gap-2 text-left sm:col-span-2">
              <Label htmlFor="correoElectronico" className="text-zinc-200">
                Correo electronico
              </Label>
              <Input
                id="correoElectronico"
                value={form.correoElectronico}
                onChange={(event) => updateField("correoElectronico", event.target.value)}
                className="h-11 border-white/10 bg-white/[0.04] text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
                placeholder="ana@empresa.com"
                type="email"
                required
              />
            </div>

            <div className="grid gap-3 text-left sm:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-zinc-200">Servicios</Label>
                <Button
                  type="button"
                  size="sm"
                  className="border-[#ED6F1C] bg-[#ED6F1C] text-[#140a04] hover:bg-[#ff8a3d]"
                  onClick={addService}
                >
                  <Plus />
                  Agregar
                </Button>
              </div>

              {form.servicios.length ? (
                <div className="grid gap-3">
                  {form.servicios.map((servicio, index) => (
                    <div key={index} className="grid gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-2">
                      <div className="grid gap-2 sm:col-span-2">
                        <Label className="text-zinc-300">
                          Servicio
                        </Label>
                        <Select
                          value={servicio.servicio}
                          onValueChange={(value) => value && updateService(index, "servicio", value)}
                        >
                          <SelectTrigger className="h-10 w-full border-white/10 bg-zinc-950 text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30">
                            <SelectValue placeholder="Selecciona un servicio" />
                          </SelectTrigger>
                          <SelectContent className="border-white/10 bg-zinc-950 text-white">
                            {serviciosDisponibles.map((servicioDisponible) => (
                              <SelectItem key={servicioDisponible} value={servicioDisponible}>
                                {servicioDisponible}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`fechaInicio-${index}`} className="text-zinc-300">
                          Fecha inicio
                        </Label>
                        <Input
                          id={`fechaInicio-${index}`}
                          value={servicio.fechaInicio}
                          onChange={(event) => updateService(index, "fechaInicio", event.target.value)}
                          className="h-10 border-white/10 bg-zinc-950 text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
                          type="date"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`ultimaFacturacion-${index}`} className="text-zinc-300">
                          Ultima facturacion
                        </Label>
                        <Input
                          id={`ultimaFacturacion-${index}`}
                          value={servicio.ultimaFacturacion}
                          onChange={(event) => updateService(index, "ultimaFacturacion", event.target.value)}
                          className="h-10 border-white/10 bg-zinc-950 text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
                          type="date"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`ultimoPago-${index}`} className="text-zinc-300">
                          Ultimo pago
                        </Label>
                        <Input
                          id={`ultimoPago-${index}`}
                          value={servicio.ultimoPago}
                          onChange={(event) => updateService(index, "ultimoPago", event.target.value)}
                          className="h-10 border-white/10 bg-zinc-950 text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
                          min={0}
                          step={1}
                          type="number"
                          required
                        />
                      </div>
                      <div className="flex items-end">
                        <Button type="button" variant="destructive" onClick={() => removeService(index)}>
                          <Trash2 />
                          Quitar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-400">
                  No hay servicios agregados.
                </p>
              )}
            </div>

            {formError ? (
              <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-left text-sm text-red-200 sm:col-span-2">
                {formError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="cancel" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" /> : <Check />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
