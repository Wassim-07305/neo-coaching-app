import { cn } from "@/lib/utils";
import { Users, Building2, BookOpen, Star } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  borderColor: string;
}

function StatCard({ title, value, icon: Icon, borderColor }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 flex items-center gap-4",
        `border-l-4`,
        borderColor
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-50">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs md:text-sm text-gray-500 truncate">{title}</p>
        <p className="text-xl md:text-2xl font-bold font-heading text-dark">{value}</p>
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        title="Coachees actifs"
        value={activeCoachees}
        icon={Users}
        borderColor="border-l-primary"
      />
      <StatCard
        title="Entreprises en cours"
        value={activeCompanies}
        icon={Building2}
        borderColor="border-l-primary-medium"
      />
      <StatCard
        title="Modules completes ce mois"
        value={modulesCompletedThisMonth}
        icon={BookOpen}
        borderColor="border-l-success"
      />
      <StatCard
        title="Satisfaction moyenne"
        value={averageSatisfaction}
        icon={Star}
        borderColor="border-l-accent"
      />
    </div>
  );
}
