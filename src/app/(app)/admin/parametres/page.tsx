"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Building2,
  Mail,
  Phone,
  Globe,
  Key,
  Save,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/providers/auth-provider";
import { createUntypedClient } from "@/lib/supabase/client";

type SettingsTab = "profil" | "plateforme" | "notifications" | "securite" | "facturation";

const tabs: { key: SettingsTab; label: string; icon: typeof Settings }[] = [
  { key: "profil", label: "Mon profil", icon: User },
  { key: "plateforme", label: "Plateforme", icon: Building2 },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "securite", label: "Securite", icon: Shield },
  { key: "facturation", label: "Facturation", icon: CreditCard },
];

export default function ParametresPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profil");
  const [isSaving, setIsSaving] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    firstName: "Jean-Claude",
    lastName: "YEKPE",
    email: "contact@neo-coaching.fr",
    phone: "+33 6 12 34 56 78",
  });

  // Platform state
  const [platform, setPlatform] = useState({
    companyName: "NEO Coaching",
    website: "https://neo-coaching.fr",
    address: "Paris, France",
    description: "Coaching professionnel et formations en entreprise",
  });

  // Notification state
  const [notifications, setNotifications] = useState({
    emailNewBooking: true,
    emailNewMessage: true,
    emailWeeklyReport: false,
    smsNewBooking: false,
    inAppAll: true,
  });

  // Security state
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "30",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createUntypedClient();
      if (user?.id) {
        await supabase
          .from("profiles")
          .update({
            first_name: profile.firstName,
            last_name: profile.lastName,
            phone: profile.phone,
          })
          .eq("id", user.id);
      }
      toast("Parametres enregistres avec succes", "success");
    } catch {
      toast("Erreur lors de l&apos;enregistrement", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-dark">
            Parametres
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-64 shrink-0">
          <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-3",
                    isActive
                      ? "bg-accent/5 border-l-accent text-accent"
                      : "border-l-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{tab.label}</span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 ml-auto transition-transform",
                      isActive ? "rotate-90" : ""
                    )}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Profile Tab */}
            {activeTab === "profil" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading font-semibold text-lg text-dark mb-1">
                    Informations personnelles
                  </h2>
                  <p className="text-sm text-gray-500">
                    Gerez vos informations de compte administrateur.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prenom
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telephone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="text-accent font-medium text-sm hover:underline">
                    Changer mon mot de passe
                  </button>
                </div>
              </div>
            )}

            {/* Platform Tab */}
            {activeTab === "plateforme" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading font-semibold text-lg text-dark mb-1">
                    Informations de la plateforme
                  </h2>
                  <p className="text-sm text-gray-500">
                    Configurez les informations publiques de votre activite.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Nom de l&apos;entreprise
                  </label>
                  <input
                    type="text"
                    value={platform.companyName}
                    onChange={(e) =>
                      setPlatform({ ...platform, companyName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Site web
                  </label>
                  <input
                    type="url"
                    value={platform.website}
                    onChange={(e) =>
                      setPlatform({ ...platform, website: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={platform.address}
                    onChange={(e) =>
                      setPlatform({ ...platform, address: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={platform.description}
                    onChange={(e) =>
                      setPlatform({ ...platform, description: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Logo de la plateforme
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-white font-heading font-bold text-2xl">
                      N
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      Modifier le logo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading font-semibold text-lg text-dark mb-1">
                    Preferences de notifications
                  </h2>
                  <p className="text-sm text-gray-500">
                    Choisissez comment vous souhaitez etre notifie.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-dark flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Notifications par email
                  </h3>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-dark text-sm">
                        Nouvelle reservation
                      </p>
                      <p className="text-xs text-gray-500">
                        Recevoir un email pour chaque nouvelle demande de RDV
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNewBooking}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailNewBooking: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-dark text-sm">
                        Nouveau message
                      </p>
                      <p className="text-xs text-gray-500">
                        Recevoir un email pour les messages de la communaute
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNewMessage}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailNewMessage: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-dark text-sm">
                        Rapport hebdomadaire
                      </p>
                      <p className="text-xs text-gray-500">
                        Recevoir un resume de l&apos;activite chaque semaine
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailWeeklyReport}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailWeeklyReport: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent"
                    />
                  </label>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="font-medium text-dark flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Notifications SMS
                  </h3>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-dark text-sm">
                        Alertes reservations urgentes
                      </p>
                      <p className="text-xs text-gray-500">
                        Recevoir un SMS pour les RDV dans les 24h
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.smsNewBooking}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          smsNewBooking: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent"
                    />
                  </label>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="font-medium text-dark flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications in-app
                  </h3>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-dark text-sm">
                        Toutes les notifications
                      </p>
                      <p className="text-xs text-gray-500">
                        Afficher les notifications dans l&apos;application
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.inAppAll}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          inAppAll: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "securite" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading font-semibold text-lg text-dark mb-1">
                    Securite du compte
                  </h2>
                  <p className="text-sm text-gray-500">
                    Gerez la securite et l&apos;acces a votre compte.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Key className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-dark text-sm">
                          Authentification a deux facteurs
                        </p>
                        <p className="text-xs text-gray-500">
                          Ajouter une couche de securite supplementaire
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={security.twoFactorEnabled}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          twoFactorEnabled: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent"
                    />
                  </label>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-dark mb-2">
                      Expiration de session
                    </label>
                    <select
                      value={security.sessionTimeout}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          sessionTimeout: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 heure</option>
                      <option value="120">2 heures</option>
                      <option value="480">8 heures</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Deconnexion automatique apres cette duree d&apos;inactivite
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <button className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors text-left">
                    Voir l&apos;historique des connexions
                  </button>
                  <button className="w-full px-4 py-3 border border-danger/30 rounded-lg text-sm font-medium text-danger hover:bg-danger/5 transition-colors text-left">
                    Deconnecter toutes les sessions
                  </button>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "facturation" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading font-semibold text-lg text-dark mb-1">
                    Facturation et paiements
                  </h2>
                  <p className="text-sm text-gray-500">
                    Gerez vos informations de paiement et consultez vos factures.
                  </p>
                </div>

                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-dark text-sm">
                        Compte Stripe connecte
                      </p>
                      <p className="text-xs text-gray-600">
                        Vous pouvez recevoir des paiements pour vos modules
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-dark">
                    Informations de facturation
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Raison sociale
                      </label>
                      <input
                        type="text"
                        defaultValue="NEO Coaching SARL"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SIRET
                      </label>
                      <input
                        type="text"
                        defaultValue="123 456 789 00012"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse de facturation
                    </label>
                    <textarea
                      rows={2}
                      defaultValue="123 Avenue des Champs-Elysees, 75008 Paris"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-medium text-dark mb-4">
                    Dernieres factures
                  </h3>
                  <div className="space-y-2">
                    {[
                      { date: "01/03/2026", amount: "890,00", status: "Payee" },
                      { date: "01/02/2026", amount: "1 250,00", status: "Payee" },
                      { date: "01/01/2026", amount: "450,00", status: "Payee" },
                    ].map((invoice, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">
                            {invoice.date}
                          </span>
                          <span className="text-sm font-medium text-dark">
                            {invoice.amount} EUR
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                            {invoice.status}
                          </span>
                          <button className="text-accent text-sm font-medium hover:underline">
                            Telecharger
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
