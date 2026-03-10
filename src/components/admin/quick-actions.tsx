"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  UserPlus,
  Calendar,
  FileText,
  Send,
  Video,
  ClipboardList,
  Building2,
  BookOpen,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: typeof Plus;
  href?: string;
  onClick?: () => void;
  color: string;
  bgColor: string;
}

interface QuickActionsProps {
  onScheduleMeeting?: () => void;
  onSendEmail?: () => void;
  onGenerateReport?: () => void;
  className?: string;
}

export function QuickActions({
  onScheduleMeeting,
  onSendEmail,
  onGenerateReport,
  className,
}: QuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions: QuickAction[] = [
    {
      id: "add-coachee",
      label: "Ajouter un coache",
      description: "Inscrire un nouveau participant",
      icon: UserPlus,
      href: "/admin/coachees?action=add",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: "schedule-meeting",
      label: "Planifier une seance",
      description: "Creer un RDV Zoom",
      icon: Video,
      onClick: onScheduleMeeting,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      id: "send-reminder",
      label: "Envoyer un rappel",
      description: "Notification email/SMS",
      icon: Send,
      onClick: onSendEmail,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      id: "generate-report",
      label: "Generer un rapport",
      description: "Export PDF Qualiopi",
      icon: FileText,
      onClick: onGenerateReport,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      id: "add-company",
      label: "Nouvelle entreprise",
      description: "Ajouter un client B2B",
      icon: Building2,
      href: "/admin/entreprises?action=add",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      id: "create-module",
      label: "Creer un module",
      description: "Nouveau contenu de formation",
      icon: BookOpen,
      href: "/admin/modules?action=add",
      color: "text-teal-500",
      bgColor: "bg-teal-50",
    },
    {
      id: "assign-parcours",
      label: "Assigner un parcours",
      description: "Affecter des modules",
      icon: ClipboardList,
      href: "/admin/parcours?action=assign",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      id: "view-calendar",
      label: "Voir le calendrier",
      description: "Agenda et disponibilites",
      icon: Calendar,
      href: "/admin/rdv",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
    },
  ];

  const visibleActions = isExpanded ? actions : actions.slice(0, 4);

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-dark text-base">
              Actions rapides
            </h2>
            <p className="text-xs text-gray-500">Taches frequentes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {visibleActions.map((action) => {
          const Icon = action.icon;
          const content = (
            <div
              className={cn(
                "group p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all cursor-pointer",
                "hover:shadow-sm hover:-translate-y-0.5"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                  action.bgColor
                )}
              >
                <Icon className={cn("w-5 h-5", action.color)} />
              </div>
              <p className="text-sm font-medium text-dark mb-0.5">{action.label}</p>
              <p className="text-xs text-gray-400">{action.description}</p>
            </div>
          );

          if (action.href) {
            return (
              <Link key={action.id} href={action.href}>
                {content}
              </Link>
            );
          }

          return (
            <div
              key={action.id}
              onClick={action.onClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && action.onClick?.()}
            >
              {content}
            </div>
          );
        })}
      </div>

      {/* Show more/less button */}
      {actions.length > 4 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-accent hover:underline"
        >
          {isExpanded ? (
            <>
              <X className="w-4 h-4" />
              Voir moins
            </>
          ) : (
            <>
              <ChevronRight className="w-4 h-4" />
              Voir plus d&apos;actions ({actions.length - 4})
            </>
          )}
        </button>
      )}
    </div>
  );
}
