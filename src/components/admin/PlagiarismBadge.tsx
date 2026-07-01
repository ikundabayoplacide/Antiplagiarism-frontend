import { cn } from "@/lib/utils";
import { getPlagiarismLabel, getPlagiarismLevel, type PlagiarismLevel } from "@/lib/adminData";

const levelStyles: Record<PlagiarismLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

interface PlagiarismBadgeProps {
  percent: number;
  showPercent?: boolean;
  className?: string;
}

const PlagiarismBadge = ({ percent, showPercent = true, className }: PlagiarismBadgeProps) => {
  const level = getPlagiarismLevel(percent);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        levelStyles[level],
        className
      )}
    >
      {getPlagiarismLabel(level)}
      {showPercent && <span className="opacity-75">({percent}%)</span>}
    </span>
  );
};

export default PlagiarismBadge;
