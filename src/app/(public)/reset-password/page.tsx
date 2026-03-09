"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { Eye, EyeOff, Loader2, Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caracteres")
      .regex(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une majuscule"
      )
      .regex(
        /[0-9]/,
        "Le mot de passe doit contenir au moins un chiffre"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // User should have a session from the recovery link
      setIsValidSession(!!session);
    };
    checkSession();
  }, [supabase]);

  const onSubmit = async (data: ResetFormData) => {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      toast("Erreur lors de la mise a jour du mot de passe.", "error");
      return;
    }

    setIsSuccess(true);
    toast("Mot de passe mis a jour avec succes !", "success");

    // Redirect after 3 seconds
    setTimeout(() => {
      router.push("/connexion");
    }, 3000);
  };

  // Loading state
  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Verification en cours...</p>
        </div>
      </div>
    );
  }

  // Invalid or expired link
  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-danger" />
            </div>
            <h1 className="font-heading text-xl font-semibold text-dark mb-2">
              Lien invalide ou expire
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Ce lien de reinitialisation n&apos;est plus valide. Veuillez demander
              un nouveau lien depuis la page de connexion.
            </p>
            <Link
              href="/connexion"
              className="inline-block px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
            >
              Retour a la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="font-heading text-xl font-semibold text-dark mb-2">
              Mot de passe modifie !
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Votre mot de passe a ete mis a jour avec succes. Vous allez etre
              redirige vers la page de connexion...
            </p>
            <Loader2 className="w-6 h-6 text-accent animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success text-white font-heading font-bold text-2xl mb-4">
            NC
          </div>
          <h1 className="font-heading text-2xl font-bold text-accent">
            Neo-Coaching
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Reinitialisation du mot de passe
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="font-heading text-xl font-semibold text-dark text-center mb-2">
            Nouveau mot de passe
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Choisissez un mot de passe securise
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("password")}
                  className={cn(
                    "w-full pl-11 pr-12 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
                    errors.password ? "border-danger" : "border-gray-200"
                  )}
                  placeholder="Votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-danger text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={cn(
                    "w-full pl-11 pr-12 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
                    errors.confirmPassword ? "border-danger" : "border-gray-200"
                  )}
                  placeholder="Confirmez le mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={
                    showConfirm
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-danger text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Requirements */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>Le mot de passe doit contenir :</p>
              <ul className="list-disc list-inside space-y-0.5 text-gray-400">
                <li>Au moins 8 caracteres</li>
                <li>Au moins une majuscule</li>
                <li>Au moins un chiffre</li>
              </ul>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mise a jour...
                </>
              ) : (
                "Mettre a jour le mot de passe"
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-5 text-center">
            <Link
              href="/connexion"
              className="text-sm text-primary-medium hover:text-accent transition-colors"
            >
              Retour a la connexion
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          NEO-FORMATIONS &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
