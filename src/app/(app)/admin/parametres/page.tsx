"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Settings,
  Palette,
  Mail,
  Link2,
  Users,
  Shield,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ScrollText,
  UserCog,
} from "lucide-react";
import { AuditLogView } from "@/components/admin/audit-log-view";
import { CoCoachManagement } from "@/components/admin/co-coach-management";

type Tab = "general" | "emails" | "integrations" | "utilisateurs" | "co_coachs" | "audit";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "general", label: "General", icon: Palette },
  { key: "emails", label: "Emails", icon: Mail },
  { key: "integrations", label: "Integrations", icon: Link2 },
  { key: "utilisateurs", label: "Utilisateurs", icon: Users },
  { key: "co_coachs", label: "Co-Coachs", icon: UserCog },
  { key: "audit", label: "Audit", icon: ScrollText },
];

interface CoAdmin {
  id: string;
  name: string;
  email: string;
  role: "co_admin" | "co_coach" | "moderateur";
  active: boolean;
}

const mockCoAdmins: CoAdmin[] = [
  { id: "u-1", name: "Marie Assistante", email: "marie.a@neo-formations.fr", role: "co_admin", active: true },
  { id: "u-2", name: "Lucas Coach", email: "lucas.c@neo-formations.fr", role: "co_coach", active: true },
  { id: "u-3", name: "Emma Moderateur", email: "emma.m@neo-formations.fr", role: "moderateur", active: false },
];

const roleLabels: Record<string, { label: string; className: string }> = {
  co_admin: { label: "Co-Admin", className: "bg-accent/10 text-accent" },
  co_coach: { label: "Co-Coach", className: "bg-success/10 text-success" },
  moderateur: { label: "Moderateur", className: "bg-blue-50 text-blue-700" },
};

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">Parametres</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 overflow-x-auto">
          <nav className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === tab.key
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-5 sm:p-6">
          {/* General */}
          {activeTab === "general" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="font-heading font-semibold text-dark text-sm mb-4">Branding</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Nom de la plateforme</label>
                    <input
                      type="text"
                      defaultValue="Neo-Coaching"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-dark focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email de support</label>
                    <input
                      type="email"
                      defaultValue="contact@neo-formations.fr"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-dark focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading font-semibold text-dark text-sm mb-4">Couleurs</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Primaire", value: "#0A1628" },
                    { label: "Accent", value: "#D4A843" },
                    { label: "Succes", value: "#2D8C4E" },
                    { label: "Danger", value: "#E74C3C" },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100">
                      <div className="w-8 h-8 rounded-md border border-gray-200 shrink-0" style={{ backgroundColor: c.value }} />
                      <div>
                        <p className="text-xs font-medium text-dark">{c.label}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-heading font-semibold text-dark text-sm mb-4">Fuseau horaire</h3>
                <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-dark focus:outline-none focus:border-accent">
                  <option>Europe/Paris (UTC+1)</option>
                  <option>Europe/London (UTC+0)</option>
                  <option>America/New_York (UTC-5)</option>
                </select>
              </div>

              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
                <Save className="w-4 h-4" />
                {saved ? "Enregistre !" : "Enregistrer"}
              </button>
            </div>
          )}

          {/* Emails */}
          {activeTab === "emails" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="font-heading font-semibold text-dark text-sm mb-4">Configuration email</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Fournisseur</label>
                    <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-dark focus:outline-none focus:border-accent">
                      <option>Resend</option>
                      <option>Mailchimp</option>
                      <option>SendGrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email expediteur</label>
                    <input
                      type="email"
                      defaultValue="noreply@neo-formations.fr"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-dark focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading font-semibold text-dark text-sm mb-4">Templates actifs</h3>
                <div className="space-y-2">
                  {[
                    { name: "Bienvenue coachee", trigger: "Inscription", active: true },
                    { name: "Rappel RDV 24h", trigger: "24h avant RDV", active: true },
                    { name: "Rappel RDV 2h", trigger: "2h avant RDV", active: true },
                    { name: "Nouveau module assigne", trigger: "Assignation module", active: true },
                    { name: "Rapport mensuel", trigger: "1er du mois", active: false },
                    { name: "Alerte KPI faible", trigger: "KPI < 4", active: true },
                  ].map((tpl) => (
                    <div key={tpl.name} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                      <div>
                        <p className="text-sm font-medium text-dark">{tpl.name}</p>
                        <p className="text-xs text-gray-400">{tpl.trigger}</p>
                      </div>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                        tpl.active ? "bg-success/10 text-success" : "bg-gray-100 text-gray-400"
                      )}>
                        {tpl.active ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
                <Save className="w-4 h-4" />
                {saved ? "Enregistre !" : "Enregistrer"}
              </button>
            </div>
          )}

          {/* Integrations */}
          {activeTab === "integrations" && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-heading font-semibold text-dark text-sm mb-2">Services connectes</h3>
              {[
                { name: "Supabase", description: "Base de donnees et authentification", connected: true, icon: "SB" },
                { name: "Zoom", description: "Creation automatique de liens RDV", connected: false, icon: "ZM" },
                { name: "Resend", description: "Envoi d'emails transactionnels", connected: false, icon: "RS" },
                { name: "Stripe", description: "Paiements en ligne (optionnel)", connected: false, icon: "ST" },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-heading">
                      {integration.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark">{integration.name}</p>
                      <p className="text-xs text-gray-400">{integration.description}</p>
                    </div>
                  </div>
                  {integration.connected ? (
                    <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">Connecte</span>
                  ) : (
                    <button className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full hover:bg-accent/20 transition-colors">
                      Configurer
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Utilisateurs */}
          {activeTab === "utilisateurs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-dark text-sm">Equipe d&apos;administration</h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter
                </button>
              </div>

              <div className="space-y-3">
                {/* Admin principal */}
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-accent/20 bg-accent/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent font-heading">
                      JC
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark">Jean-Claude YEKPE</p>
                      <p className="text-xs text-gray-400">jc@neo-formations.fr</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-accent/10 text-accent border border-accent/20">
                      <Shield className="w-3 h-3 inline mr-0.5" />
                      Admin principal
                    </span>
                  </div>
                </div>

                {/* Co-admins */}
                {mockCoAdmins.map((user) => {
                  const role = roleLabels[user.role];
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-dark">{user.name}</p>
                            {!user.active && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium">Desactive</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", role.className)}>
                          {role.label}
                        </span>
                        <button className="p-1.5 text-gray-400 hover:text-accent transition-colors rounded-lg hover:bg-gray-50">
                          {user.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-danger transition-colors rounded-lg hover:bg-gray-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Co-Coachs */}
          {activeTab === "co_coachs" && <CoCoachManagement />}

          {/* Audit Log */}
          {activeTab === "audit" && <AuditLogView />}
        </div>
      </div>
    </div>
  );
}
