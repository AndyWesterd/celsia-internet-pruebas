import { Check, Loader2, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviciosDisponibles } from "../constants/catalogs";
import type { ServicioPayload } from "@/types/user";

interface ServiceRegistrationFormProps {
  isSaving: boolean;
  onSubmit: (identificacion: string, payload: ServicioPayload) => Promise<void>;
}

const emptyForm = {
  identificacion: "",
  servicio: "",
  fechaInicio: "",
  ultimaFacturacion: "",
  ultimoPago: "",
};

export function ServiceRegistrationForm({ isSaving, onSubmit }: ServiceRegistrationFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const updateField = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (
      !form.identificacion.trim()
      || !form.servicio.trim()
      || !form.fechaInicio.trim()
      || !form.ultimaFacturacion.trim()
      || !form.ultimoPago.trim()
    ) {
      setFormError("No se permiten datos en blanco.");
      return;
    }

    try {
      await onSubmit(form.identificacion.trim(), {
        servicio: form.servicio,
        fechaInicio: form.fechaInicio,
        ultimaFacturacion: form.ultimaFacturacion,
        ultimoPago: Number(form.ultimoPago),
      });
      setForm(emptyForm);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No se pudo registrar el servicio.");
    }
  };

  return (
    <Card className="border-white/10 bg-white/[0.03] text-left">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Plus className="size-4 text-[#FFB37A]" />
          Registrar servicio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="servicio-identificacion" className="text-zinc-200">
              Identificacion del cliente
            </Label>
            <Input
              id="servicio-identificacion"
              value={form.identificacion}
              onChange={(event) => updateField("identificacion", event.target.value)}
              className="h-10 border-white/10 bg-zinc-950 text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
              placeholder="1020304050"
              required
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label className="text-zinc-200">Servicio</Label>
            <Select value={form.servicio} onValueChange={(value) => value && updateField("servicio", value)}>
              <SelectTrigger className="h-10 w-full border-white/10 bg-zinc-950 text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30">
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-950 text-white">
                {serviciosDisponibles.map((servicio) => (
                  <SelectItem key={servicio} value={servicio}>
                    {servicio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="servicio-fecha-inicio" className="text-zinc-200">
              Fecha inicio
            </Label>
            <Input
              id="servicio-fecha-inicio"
              value={form.fechaInicio}
              onChange={(event) => updateField("fechaInicio", event.target.value)}
              className="h-10 border-white/10 bg-zinc-950 text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
              type="date"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="servicio-ultima-facturacion" className="text-zinc-200">
              Ultima facturacion
            </Label>
            <Input
              id="servicio-ultima-facturacion"
              value={form.ultimaFacturacion}
              onChange={(event) => updateField("ultimaFacturacion", event.target.value)}
              className="h-10 border-white/10 bg-zinc-950 text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
              type="date"
              required
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="servicio-ultimo-pago" className="text-zinc-200">
              Ultimo pago
            </Label>
            <Input
              id="servicio-ultimo-pago"
              value={form.ultimoPago}
              onChange={(event) => updateField("ultimoPago", event.target.value)}
              className="h-10 border-white/10 bg-zinc-950 text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
              min={0}
              step={1}
              type="number"
              required
            />
          </div>

          {formError ? (
            <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 sm:col-span-2">
              {formError}
            </p>
          ) : null}

          <Button type="submit" disabled={isSaving} className="sm:col-span-2">
            {isSaving ? <Loader2 className="animate-spin" /> : <Check />}
            Guardar servicio
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
