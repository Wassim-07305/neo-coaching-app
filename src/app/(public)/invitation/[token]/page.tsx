"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient, createUntypedClient } from "@/lib/supabase/client";
import { getInvitationByToken, acceptInvitationToken } from "@/hooks/use-supabase-data";
import { useToast } from "@/components/ui/toast";
import type { InvitationToken, Company } from "@/lib/supabase/types";
import {
  Loader2,
  Building2,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Prenom requis"),
    lastName: z.string().min(1, "Nom requis"),
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type PageState = "loading" | "valid" | "invalid" | "expired" | "success";

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const token = params.token as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [invitation, setInvitation] = useState<InvitationToken | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    async function validateToken() {
      const { data, error } = await getInvitationByToken(token);
      if (error || !data) {
        setPageState("invalid");
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setPageState("expired");
        return;
      }

      setInvitation(data);
      setCompany(data.company);

      // Pre-fill email if specified in the invitation
      if (data.email) {
        setValue("email", data.email);
      }

      setPageState("valid");
    }

    validateToken();
  }, [token, setValue]);

  const onSubmit = async (formData: RegisterFormData) => {
    if (!invitation) return;

    setIsSubmitting(true);
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast("Cette adresse email est deja utilisee. Connectez-vous a la place.", "error");
        } else {
          toast(authError.message, "error");
        }
        setIsSubmitting(false);
        return;
      }

      if (!authData.user) {
        toast("Erreur lors de la creation du compte", "error");
        setIsSubmitting(false);
        return;
      }

      // 2. Create profile
      const untypedSupabase = createUntypedClient();
      const { error: profileError } = await untypedSupabase.from("profiles").insert({
        id: authData.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: invitation.role,
        company_id: invitation.company_id,
        status: "active",
        onboarding_completed: false,
      });

      if (profileError) {
        toast("Erreur lors de la creation du profil", "error");
        setIsSubmitting(false);
        return;
      }

      // 3. Mark invitation as accepted
      await acceptInvitationToken(invitation.id, authData.user.id);

      setPageState("success");
      toast("Compte cree avec succes !", "success");

      // Redirect after a short delay
      setTimeout(() => {
        const dashboardMap: Record<string, string> = {
          admin: "/admin/dashboard",
          dirigeant: "/dirigeant/dashboard",
          salarie: "/salarie/dashboard",
          coachee: "/coaching/dashboard",
          intervenant: "/intervenant/dashboard",
        };
        router.push(dashboardMap[invitation.role] || "/connexion");
      }, 2000);
    } catch {
      toast("Erreur lors de la creation du compte", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (pageState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-gray-500">Verification de l&apos;invitation...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (pageState === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-danger" />
          </div>
          <h1 className="font-heading text-xl font-bold text-dark mb-2">
            Invitation invalide
          </h1>
          <p className="text-gray-500 mb-6">
            Ce lien d&apos;invitation n&apos;est pas valide ou a deja ete utilise.
          </p>
          <button
            onClick={() => router.push("/connexion")}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
          >
            Aller a la page de connexion
          </button>
        </div>
      </div>
    );
  }

  // Expired token
  if (pageState === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-warning" />
          </div>
          <h1 className="font-heading text-xl font-bold text-dark mb-2">
            Invitation expiree
          </h1>
          <p className="text-gray-500 mb-6">
            Ce lien d&apos;invitation a expire. Demandez a votre administrateur de generer un nouveau lien.
          </p>
          <button
            onClick={() => router.push("/connexion")}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
          >
            Aller a la page de connexion
          </button>
        </div>
      </div>
    );
  }

  // Success
  if (pageState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="font-heading text-xl font-bold text-dark mb-2">
            Compte cree !
          </h1>
          <p className="text-gray-500 mb-2">
            Bienvenue chez {company?.name}. Vous allez etre redirige vers votre tableau de bord.
          </p>
          <Loader2 className="w-5 h-5 animate-spin text-accent mx-auto mt-4" />
        </div>
      </div>
    );
  }

  // Valid — show registration form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-6 text-white text-center">
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-xl font-bold mb-1">
            Rejoindre {company?.name}
          </h1>
          <p className="text-white/70 text-sm">
            Creez votre compte pour acceder a votre espace de formation
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prenom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="Marie"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
                    errors.firstName ? "border-danger" : "border-gray-200"
                  )}
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-danger mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                {...register("lastName")}
                type="text"
                placeholder="Dupont"
                className={cn(
                  "w-full px-4 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
                  errors.lastName ? "border-danger" : "border-gray-200"
                )}
              />
              {errors.lastName && (
                <p className="text-xs text-danger mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email professionnel
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="marie.dupont@entreprise.fr"
                readOnly={!!invitation?.email}
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
                  errors.email ? "border-danger" : "border-gray-200",
                  invitation?.email && "bg-gray-100 cursor-not-allowed"
                )}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-danger mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 caracteres"
                className={cn(
                  "w-full pl-10 pr-12 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
                  errors.password ? "border-danger" : "border-gray-200"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-danger mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="Repetez le mot de passe"
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
                  errors.confirmPassword ? "border-danger" : "border-gray-200"
                )}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creation du compte...
              </>
            ) : (
              "Creer mon compte"
            )}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Vous avez deja un compte ?{" "}
            <button
              type="button"
              onClick={() => router.push("/connexion")}
              className="text-accent hover:underline font-medium"
            >
              Se connecter
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
