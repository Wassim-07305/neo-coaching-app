import { cn } from "@/lib/utils";
import { Users, Building2, BookOpen, Star, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend?: { value: string; positive: boolean };
}

function StatCard({ title, value, icon: Icon, iconBg, iconColor, trend }: StatCardProps) {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 overflow-hidden group hover:shadow-md transition-all duration-300">
      {/* Decorative gradient accent */}
      <div className={cn("absolute top-0 right-0 w-24 h-24 opacity-5 blur-2xl", iconBg)} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className={cn("flex items-center justify-center w-11 h-11 rounded-xl", iconBg)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold font-heading text-dark">{value}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">{title}</p>
          </div>
        </div>

        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend.positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          )}>
            <TrendingUp className={cn("w-3 h-3", !trend.positive && "rotate-180")} />
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatsBarProps {
  activeCoachees: number;
  activeCompanies: number;
  modulesCompletedThisMonth: number;
  averageSatisfaction: string;
}

export function StatsBar({
  activeCoachees,
  activeCompanies,
  modulesCompletedThisMonth,
  averageSatisfaction,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      <StatCard
        title="Coachees actifs"
        value={activeCoachees}
        icon={Users}
        iconBg="bg-primary/10"
        iconColor="text-primary"
        trend={{ value: "+12%", positive: true }}
      />
      <StatCard
        title="Entreprises en cours"
        value={activeCompanies}
        icon={Building2}
        iconBg="bg-primary-medium/10"
        iconColor="text-primary-medium"
        trend={{ value: "+5%", positive: true }}
      />
      <StatCard
        title="Modules ce mois"
        value={modulesCompletedThisMonth}
        icon={BookOpen}
        iconBg="bg-success/10"
        iconColor="text-success"
        trend={{ value: "+8%", positive: true }}
      />
      <StatCard
        title="Satisfaction"
        value={averageSatisfaction}
        icon={Star}
        iconBg="bg-accent/10"
        iconColor="text-accent"
      />
    </div>
  );
}
