import { Loader2, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Cliente } from "@/types/user";

interface ClientLookupFormProps {
  cliente: Cliente | null;
  error: string | null;
  isLoading: boolean;
  onSearch: (identificacion: string) => Promise<void>;
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "COP",
  }).format(value);

export function ClientLookupForm({ cliente, error, isLoading, onSearch }: ClientLookupFormProps) {
  const [identificacion, setIdentificacion] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!identificacion.trim()) {
      setFormError("No se permiten datos en blanco.");
      return;
    }

    await onSearch(identificacion.trim());
  };

  return (
    <Card className="border-white/10 bg-white/[0.03] text-left">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Search className="size-4 text-[#FFB37A]" />
          Consultar cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor="consulta-identificacion" className="text-zinc-200">
              Numero de identificacion
            </Label>
            <Input
              id="consulta-identificacion"
              value={identificacion}
              onChange={(event) => setIdentificacion(event.target.value)}
              className="h-10 border-white/10 bg-zinc-950 text-white focus-visible:border-[#ED6F1C] focus-visible:ring-[#ED6F1C]/30"
              placeholder="1020304050"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            Consultar
          </Button>
        </form>

        {formError || error ? (
          <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {formError ?? error}
          </p>
        ) : null}

        {cliente ? (
          <div className="rounded-md border border-white/10 bg-zinc-950 p-3 text-sm text-zinc-300">
            <p className="font-medium text-white">
              {cliente.nombres} {cliente.apellidos}
            </p>
            <p className="mt-1">
              {cliente.tipoIdentificacion} {cliente.identificacion} · {cliente.numeroCelular}
            </p>
            <p className="mt-1">{cliente.correoElectronico}</p>

            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="font-medium text-white">Servicios contratados</p>
              {cliente.servicios?.length ? (
                <div className="mt-2 grid gap-2">
                  {cliente.servicios.map((servicio) => (
                    <div key={servicio.servicio} className="rounded-md bg-white/[0.04] px-3 py-2">
                      <p className="font-medium text-zinc-100">{servicio.servicio}</p>
                      <p className="text-xs text-zinc-500">
                        Inicio {servicio.fechaInicio} · Facturacion {servicio.ultimaFacturacion} · Pago{" "}
                        {formatMoney(servicio.ultimoPago)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-zinc-500">El cliente no tiene servicios contratados.</p>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
