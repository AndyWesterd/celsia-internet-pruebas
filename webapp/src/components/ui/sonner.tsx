import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      closeButton
      position="top-right"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "#11100f",
          "--normal-text": "#f4f4f5",
          "--normal-border": "rgba(255,255,255,0.12)",
          "--success-bg": "#17100b",
          "--success-text": "#fff7ed",
          "--success-border": "rgba(237,111,28,0.48)",
          "--error-bg": "#190d0d",
          "--error-text": "#fee2e2",
          "--error-border": "rgba(248,113,113,0.42)",
          "--warning-bg": "#181107",
          "--warning-text": "#fef3c7",
          "--warning-border": "rgba(245,158,11,0.42)",
          "--info-bg": "#0d1117",
          "--info-text": "#dbeafe",
          "--info-border": "rgba(148,163,184,0.34)",
          "--border-radius": "var(--radius)",
        } as import("react").CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast border shadow-2xl shadow-black/40 backdrop-blur-md data-[type=success]:text-[#fff7ed] [&_[data-icon]]:text-[#ED6F1C] [&_[data-close-button]]:border-white/10 [&_[data-close-button]]:bg-zinc-950 [&_[data-close-button]]:text-zinc-300 [&_[data-close-button]:hover]:bg-[rgba(237,111,28,0.14)] [&_[data-close-button]:hover]:text-white",
          success: "border-[rgba(237,111,28,0.48)]",
          error: "[&_[data-icon]]:text-red-300",
          warning: "[&_[data-icon]]:text-amber-300",
          info: "[&_[data-icon]]:text-zinc-300",
          title: "text-sm font-semibold",
          description: "text-xs text-zinc-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
