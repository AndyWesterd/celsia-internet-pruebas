import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  tone?: "zinc" | "brand" | "amber";
}

export function MetricCard({ icon, label, value, tone = "zinc" }: MetricCardProps) {
  const toneClass = {
    zinc: "bg-white/10 text-zinc-100",
    brand: "bg-[rgba(237,111,28,0.16)] text-[#FFB37A]",
    amber: "bg-amber-300/15 text-amber-200",
  }[tone];

  return (
    <Card className="min-h-24 justify-center border-white/10 bg-white/[0.04] py-4 text-left">
      <CardContent className="flex items-center justify-between px-4">
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
        </div>
        <span className={`grid size-11 place-items-center rounded-md ${toneClass}`}>{icon}</span>
      </CardContent>
    </Card>
  );
}
