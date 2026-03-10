"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/providers/auth-provider";
import { createUntypedClient } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/client";

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
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profil");
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile state - pre-filled from auth
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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

  // Pre-fill profile from auth data
  useEffect(() => {
    if (authProfile) {
      setProfileData({
        firstName: authProfile.first_name || "",
        lastName: authProfile.last_name || "",
        email: authProfile.email || user?.email || "",
        phone: authProfile.phone || "",
      });
    }
  }, [authProfile, user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createUntypedClient();
      if (user?.id) {
        if (activeTab === "profil") {
          await supabase
            .from("profiles")
            .update({
              first_name: profileData.firstName,
              last_name: profileData.lastName,
              phone: profileData.phone,
            })
            .eq("id", user.id);
        } else if (activeTab === "notifications" || activeTab === "securite") {
          // Save settings as JSON in profile
          const settings = {
            notifications,
            security: {
              twoFactorEnabled: security.twoFactorEnabled,
              sessionTimeout: security.sessionTimeout,
            },
          };
          await supabase
            .from("profiles")
            .update({ settings })
            .eq("id", user.id);
        }
      }
      toast("Parametres enregistres avec succes", "success");
    } catch {
      toast("Erreur lors de l'enregistrement", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      toast("Le mot de passe doit contenir au moins 8 caracteres", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Les mots de passe ne correspondent pas", "error");
      return;
    }
    setChangingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast(error.message || "Erreur lors du changement de mot de passe", "error");
      } else {
        toast("Mot de passe modifie avec succes", "success");
        setShowPasswordForm(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast("Erreur lors du changement de mot de passe", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

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
              <Loader2 className="w-4 h-4 animate-spin" />
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
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, firstName: e.target.value })
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
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, lastName: e.target.value })
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
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    L&apos;email ne peut pas etre modifie depuis cette page
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telephone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  {!showPasswordForm ? (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="text-accent font-medium text-sm hover:underline"
                    >
                      Changer mon mot de passe
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-medium text-dark text-sm flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Changer le mot de passe
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimum 8 caracteres"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmer le mot de passe
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repetez le mot de passe"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handlePasswordChange}
                          disabled={changingPassword}
                          className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium text-sm disabled:opacity-60 transition-colors"
                        >
                          {changingPassword ? "Modification..." : "Modifier"}
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordForm(false);
                            setNewPassword("");
                            setConfirmPassword("");
                          }}
                          className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
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
                  <button
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut({ scope: "global" });
                      window.location.href = "/connexion";
                    }}
                    className="w-full px-4 py-3 border border-danger/30 rounded-lg text-sm font-medium text-danger hover:bg-danger/5 transition-colors text-left"
                  >
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
