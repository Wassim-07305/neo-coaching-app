import { cn } from "@/lib/utils";
import { getKpiColor } from "@/lib/mock-data";

interface KpiBadgeProps {
  value: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

const colorMap = {
  danger: {
    dot: "bg-danger",
    text: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
  },
  warning: {
    dot: "bg-warning",
    text: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
  },
  success: {
    dot: "bg-success",
    text: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
  },
};

export function KpiBadge({ value, label, showValue = true, size = "md" }: KpiBadgeProps) {
  const color = getKpiColor(value);
  const colors = colorMap[color];

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs gap-1",
    md: "px-2 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        colors.bg,
        colors.border,
        colors.text,
        sizeClasses[size]
      )}
    >
      <span className={cn("rounded-full shrink-0", colors.dot, dotSizes[size])} />
      {showValue && <span>{value}</span>}
      {label && <span className="text-gray-600 font-normal">{label}</span>}
    </span>
  );
}

export function KpiDotGroup({
  investissement,
  efficacite,
  participation,
}: {
  investissement: number;
  efficacite: number;
  participation: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <KpiBadge value={investissement} size="sm" />
      <KpiBadge value={efficacite} size="sm" />
      <KpiBadge value={participation} size="sm" />
    </div>
  );
}
