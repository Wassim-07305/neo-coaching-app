"use client";

import { Building2 } from "lucide-react";
import { MyIndicators } from "@/components/salarie/my-indicators";
import { MyModules } from "@/components/salarie/my-modules";
import { MyTasks } from "@/components/salarie/my-tasks";
import { NextRdv } from "@/components/salarie/next-rdv";
import { MyGroup } from "@/components/salarie/my-group";
import { mockCoachees, mockCompanies } from "@/lib/mock-data";

// Use Marie Dupont as the logged-in salarie (entreprise coachee, Alpha Corp)
const currentUser = mockCoachees[0]; // Marie Dupont
const company = mockCompanies.find((c) => c.id === currentUser.company_id);

// Mock tasks for this user
const mockTasks = [
  {
    id: "t-1",
    title: "Completer l'exercice de confiance en soi",
    dueDate: "2026-02-28",
    completed: false,
  },
  {
    id: "t-2",
    title: "Remplir le questionnaire de mi-parcours",
    dueDate: "2026-02-25",
    completed: false,
  },
  {
    id: "t-3",
    title: "Soumettre le resume du module IE",
    dueDate: "2026-02-20",
    completed: true,
  },
  {
    id: "t-4",
    title: "Regarder la video: Gestion du stress",
    dueDate: "2026-03-05",
    completed: false,
  },
  {
    id: "t-5",
    title: "Exercice: Journal emotionnel semaine 4",
    dueDate: "2026-02-10",
    completed: true,
  },
];

// Next appointment
const nextAppointment = {
  date: "2026-02-27",
  time: "09:00",
  type: "coaching",
  daysUntil: 1,
};

export default function SalarieDashboardPage() {
  const today = new Date("2026-02-26");
  const formattedDate = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-5">
      {/* 1. Welcome Header */}
      <div>
        <h1 className="font-heading text-xl md:text-2xl font-bold text-dark">
          Bonjour, {currentUser.first_name} !
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-gray-500 capitalize">{formattedDate}</p>
          {company && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              <Building2 className="w-3 h-3" />
              {company.name}
            </div>
          )}
        </div>
      </div>

      {/* 2. Mes Indicateurs */}
      <MyIndicators kpis={currentUser.kpis} history={currentUser.kpi_history} />

      {/* 3. Mes Modules */}
      <MyModules modules={currentUser.module_progress} />

      {/* 4. Mes Travaux */}
      <MyTasks initialTasks={mockTasks} />

      {/* 5 & 6. Prochain RDV + Mon Groupe side by side on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 5. Prochain RDV */}
        <NextRdv
          date={nextAppointment.date}
          time={nextAppointment.time}
          type={nextAppointment.type}
          daysUntil={nextAppointment.daysUntil}
        />

        {/* 6. Mon Groupe */}
        <MyGroup groupName="Equipe Alpha Corp" unreadMessages={3} />
      </div>
    </div>
  );
}
