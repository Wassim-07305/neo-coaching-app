"use client";

import { useState, useEffect, useMemo } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Lock,
  LogOut,
  Save,
  Check,
  Briefcase,
  Loader2,
  Globe,
  Euro,
  Video,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useIntervenantByUserId,
  useAppointments,
  updateProfile,
  updateIntervenant,
} from "@/hooks/use-supabase-data";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { differenceInMinutes } from "date-fns";

export default function IntervenantProfilPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const { data: intervenant, loading: intervenantLoading } = useIntervenantByUserId(user?.id);
  const { data: appointments } = useAppointments({ coach_id: user?.id });

  // Personal info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Intervenant info
  const [domain, setDomain] = useState("");
  const [bio, setBio] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  // Password
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync form fields when data loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    if (intervenant) {
      setDomain(intervenant.domain || "");
      setBio(intervenant.bio || "");
      setVideoUrl(intervenant.video_url || "");
      setHourlyRate(intervenant.hourly_rate_cents ? String(intervenant.hourly_rate_cents / 100) : "");
    }
  }, [intervenant]);

  // Stats
  const stats = useMemo(() => {
    if (!appointments) return { totalSessions: 0, completedSessions: 0, totalHours: 0 };
    const completed = appointments.filter((a) => a.status === "completed");
    const totalMinutes = completed.reduce((acc, a) => {
      return acc + differenceInMinutes(new Date(a.datetime_end), new Date(a.datetime_start));
    }, 0);
    return {
      totalSessions: appointments.length,
      completedSessions: completed.length,
      totalHours: Math.round(totalMinutes / 60),
    };
  }, [appointments]);

  async function handleSave() {
    if (!user?.id) return;

    setSaving(true);
    try {
      // Update profile
      const { error: profileError } = await updateProfile(user.id, {
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
      });

      if (profileError) {
        toast("Erreur lors de la sauvegarde du profil", "error");
        setSaving(false);
        return;
      }

      // Update intervenant data if exists
      if (intervenant) {
        const rateCents = hourlyRate ? Math.round(parseFloat(hourlyRate) * 100) : intervenant.hourly_rate_cents;
        const { error: intError } = await updateIntervenant(intervenant.id, {
          domain: domain || undefined,
          bio: bio || undefined,
          video_url: videoUrl || undefined,
          hourly_rate_cents: rateCents,
        });

        if (intError) {
          toast("Erreur lors de la sauvegarde des informations intervenant", "error");
          setSaving(false);
          return;
        }
      }

      setSaved(true);
      toast("Profil mis a jour avec succes", "success");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange() {
    if (newPassword.length < 8) {
      toast("Le mot de passe doit contenir au moins 8 caracteres", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Les mots de passe ne correspondent pas", "error");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast(error.message, "error");
      } else {
        toast("Mot de passe modifie avec succes", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
      }
    } catch {
      toast("Erreur lors du changement de mot de passe", "error");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/connexion");
  }

  if (authLoading || intervenantLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const email = profile?.email || user?.email || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          Mon Profil
        </h1>
      </div>

      {/* Profile header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-white">
              {initials}
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors shadow-sm"
              title="Changer la photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-dark">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                <Briefcase className="w-3 h-3" />
                Intervenant
              </span>
              {domain && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Globe className="w-3 h-3" />
                  {domain}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-dark">{stats.totalSessions}</p>
          <p className="text-xs text-gray-500">Reservations</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-dark">{stats.completedSessions}</p>
          <p className="text-xs text-gray-500">Terminees</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-dark">{stats.totalHours}h</p>
          <p className="text-xs text-gray-500">Dispensees</p>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading text-base font-semibold text-dark mb-4">
          Informations personnelles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Prenom
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Nom
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Telephone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Intervenant Professional Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading text-base font-semibold text-dark mb-4">
          Informations professionnelles
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Domaine d&apos;expertise
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Ex: Gestion du stress, Communication, Leadership..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Biographie
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Decrivez votre parcours et votre expertise..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Video de presentation (URL)
              </label>
              <div className="relative">
                <Video className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Tarif horaire (EUR)
              </label>
              <div className="relative">
                <Euro className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="50"
                  min="0"
                  step="1"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading text-base font-semibold text-dark mb-4">
          Mon compte
        </h3>

        {!showPasswordForm ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowPasswordForm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-dark hover:bg-gray-50 transition-colors"
            >
              <Lock className="w-4 h-4 text-gray-500" />
              Changer le mot de passe
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-danger/20 text-sm font-medium text-danger hover:bg-danger/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Se deconnecter
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 caracteres"
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetez le mot de passe"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Modifier le mot de passe
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
            saved
              ? "bg-success text-white"
              : "bg-accent text-white hover:bg-accent/90",
            saving && "opacity-70 cursor-not-allowed"
          )}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Enregistre !
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
