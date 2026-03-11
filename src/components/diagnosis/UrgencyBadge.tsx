import { cn } from "@/lib/utils";
import type { UrgencyLevel } from "@/types";

const defaultLabels: Record<UrgencyLevel, string> = {
  CRITICAL: "Consultation urgente",
  WITHIN_48H: "Consulter sous 48h",
  LOW: "Non urgent",
  WATCH: "À surveiller",
};

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const levelConfig: Record<UrgencyLevel, { bg: string; text: string; border: string; dot: string }> = {
  CRITICAL: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  WITHIN_48H: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  WATCH: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  LOW: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs gap-1.5",
  md: "px-3 py-1 text-sm gap-2",
  lg: "px-4 py-1.5 text-base gap-2",
};

const dotSizes = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
};

export default function UrgencyBadge({
  level,
  label,
  size = "md",
  className,
}: UrgencyBadgeProps) {
  const config = levelConfig[level];
  const displayLabel = label ?? defaultLabels[level];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-mono font-medium",
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn("rounded-full shrink-0", config.dot, dotSizes[size])} />
      {displayLabel}
    </span>
  );
}
