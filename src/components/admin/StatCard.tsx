import type { IconType } from "react-icons";
import { HiArrowDown, HiArrowUp } from "react-icons/hi";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: IconType;
  title: string;
  count: number;
  trend: number;
  trendUp: boolean;
  iconColor?: string;
  iconBg?: string;
}

const StatCard = ({
  icon: Icon,
  title,
  count,
  trend,
  trendUp,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
}: StatCardProps) => (
  <Card className="border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          )}
        >
          {trendUp ? <HiArrowUp className="h-3 w-3" /> : <HiArrowDown className="h-3 w-3" />}
          {trend}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
          {(count ?? 0).toLocaleString()}
        </p>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
