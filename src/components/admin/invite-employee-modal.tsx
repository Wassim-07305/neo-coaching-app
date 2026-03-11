"use client";

import { useState } from "react";
import { X, UserPlus, Mail, Users, Send, Copy, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { createInvitationToken } from "@/hooks/use-supabase-data";
import { useAuth } from "@/components/providers/auth-provider";

interface InviteEmployeeModalProps {
  companyId: string;
  companyName: string;
  onClose: () => void;
  onInvited?: (employees: { email: string; first_name: string; last_name: string }[]) => void;
}

interface InviteeRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function InviteEmployeeModal({
  companyId,
  companyName,
  onClose,
  onInvited,
}: InviteEmployeeModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [invitees, setInvitees] = useState<InviteeRow[]>([
    { id: "1", email: "", firstName: "", lastName: "" },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const addRow = () => {
    setInvitees([
      ...invitees,
      { id: Date.now().toString(), email: "", firstName: "", lastName: "" },
    ]);
  };

  const updateRow = (id: string, field: keyof InviteeRow, value: string) => {
    setInvitees(
      invitees.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const removeRow = (id: string) => {
    if (invitees.length > 1) {
      setInvitees(invitees.filter((row) => row.id !== id));
    }
  };

  const validInvitees = invitees.filter(
    (row) =>
      row.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim())
  );

  const handleSendInvitations = async () => {
    if (validInvitees.length === 0) {
      toast("Veuillez entrer au moins une adresse email valide", "warning");
      return;
    }

    setIsSending(true);
    const createdEmployees: { email: string; first_name: string; last_name: string; tempPassword?: string }[] = [];
    const errors: string[] = [];

    try {
      // Create each employee via the API
      for (const row of validInvitees) {
        try {
          const response = await fetch("/api/companies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "addEmployee",
              companyId,
              email: row.email.trim(),
              firstName: row.firstName.trim() || row.email.split("@")[0],
              lastName: row.lastName.trim() || "",
              role: "salarie",
              sendInvite: true,
            }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            errors.push(`${row.email}: ${result.error || "Erreur inconnue"}`);
          } else {
            createdEmployees.push({
              email: row.email,
              first_name: row.firstName || row.email.split("@")[0],
              last_name: row.lastName || "",
              tempPassword: result.data?.tempPassword,
            });
          }
        } catch {
          errors.push(`${row.email}: Erreur de connexion`);
        }
      }

      // Show results
      if (createdEmployees.length > 0) {
        const tempPasswords = createdEmployees
          .filter((e) => e.tempPassword)
          .map((e) => `${e.email}: ${e.tempPassword}`)
          .join("\n");

        toast(
          `${createdEmployees.length} compte${createdEmployees.length > 1 ? "s" : ""} cree${createdEmployees.length > 1 ? "s" : ""} avec succes.${tempPasswords ? ` Mots de passe temporaires affiches dans la console.` : ""}`,
          "success"
        );

        // Log temp passwords to console for admin to copy
        if (tempPasswords) {
          console.log("Mots de passe temporaires:\n" + tempPasswords);
        }

        onInvited?.(createdEmployees);
      }

      if (errors.length > 0) {
        toast(`Erreurs: ${errors.join(", ")}`, "error");
      }

      if (createdEmployees.length > 0) {
        onClose();
      }
    } catch {
      toast("Erreur lors de l'envoi des invitations", "error");
    } finally {
      setIsSending(false);
    }
  };

  const generateInviteLink = async () => {
    try {
      const { token, error } = await createInvitationToken({
        company_id: companyId,
        created_by: user?.id || "",
        role: "salarie",
        expires_in_days: 30,
      });
      if (error) throw error;

      const baseUrl = window.location.origin;
      const link = `${baseUrl}/invitation/${token}`;
      setInviteLink(link);
      toast("Lien d'invitation genere (valide 30 jours)", "success");
    } catch {
      toast("Erreur lors de la generation du lien", "error");
    }
  };

  const copyLink = async () => {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      toast("Lien copie dans le presse-papiers", "success");
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-100 p-5 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-dark">
                Inviter des salaries
              </h2>
              <p className="text-sm text-gray-500">{companyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Info banner */}
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-medium mb-1">Comment ca marche ?</p>
            <ul className="text-xs space-y-1 text-blue-600">
              <li>1. Ajoutez les emails des salaries a inviter</li>
              <li>2. Chaque salarie recevra un email avec un lien de connexion</li>
              <li>3. Ils pourront creer leur mot de passe et acceder a leur espace</li>
            </ul>
          </div>

          {/* Manual invitations */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Inviter par email
            </h3>

            <div className="space-y-3">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
                <div className="col-span-4">Email *</div>
                <div className="col-span-3">Prenom</div>
                <div className="col-span-3">Nom</div>
                <div className="col-span-2"></div>
              </div>

              {/* Invitee rows */}
              {invitees.map((row) => (
                <div key={row.id} className="grid grid-cols-12 gap-2">
                  <input
                    type="email"
                    value={row.email}
                    onChange={(e) => updateRow(row.id, "email", e.target.value)}
                    placeholder="email@entreprise.fr"
                    className={cn(
                      "col-span-4 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50",
                      row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)
                        ? "border-danger/50 bg-danger/5"
                        : "border-gray-200 bg-gray-50"
                    )}
                  />
                  <input
                    type="text"
                    value={row.firstName}
                    onChange={(e) => updateRow(row.id, "firstName", e.target.value)}
                    placeholder="Prenom"
                    className="col-span-3 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <input
                    type="text"
                    value={row.lastName}
                    onChange={(e) => updateRow(row.id, "lastName", e.target.value)}
                    placeholder="Nom"
                    className="col-span-3 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <div className="col-span-2 flex items-center justify-end">
                    {invitees.length > 1 && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className="p-2 text-gray-400 hover:text-danger transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={addRow}
                className="flex items-center gap-1 text-xs text-accent hover:underline"
              >
                <UserPlus className="w-3 h-3" />
                Ajouter une ligne
              </button>
            </div>

            {validInvitees.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {validInvitees.length} email{validInvitees.length > 1 ? "s" : ""} valide{validInvitees.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Invite link */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Lien d&apos;invitation partage
            </h3>

            {!inviteLink ? (
              <button
                onClick={generateInviteLink}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-accent/50 hover:text-accent transition-colors"
              >
                Generer un lien d&apos;invitation
              </button>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">
                  Partagez ce lien avec les salaries de l&apos;entreprise :
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
                  />
                  <button
                    onClick={copyLink}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                      linkCopied
                        ? "bg-success/10 text-success"
                        : "bg-accent text-white hover:bg-accent/90"
                    )}
                  >
                    {linkCopied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copie
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copier
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Les salaries utilisant ce lien seront automatiquement associes a {companyName}.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSendInvitations}
            disabled={validInvitees.length === 0 || isSending}
            className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Envoyer {validInvitees.length > 0 ? `(${validInvitees.length})` : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
