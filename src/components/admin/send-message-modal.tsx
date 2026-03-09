"use client";

import { useState } from "react";
import { X, Send, User } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface SendMessageModalProps {
  recipientId: string;
  recipientName: string;
  onClose: () => void;
}

export function SendMessageModal({
  recipientName,
  onClose,
}: SendMessageModalProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast("Veuillez entrer un message", "warning");
      return;
    }

    setIsSending(true);
    try {
      // TODO: Save to Supabase messages table (DM)
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast("Message envoye avec succes", "success");
      onClose();
    } catch {
      toast("Erreur lors de l'envoi", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="border-b border-gray-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-medium/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-medium" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-dark">
                Envoyer un message
              </h2>
              <p className="text-sm text-gray-500">a {recipientName}</p>
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
        <div className="p-5">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ecrivez votre message..."
            rows={5}
            autoFocus
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
          />
          <p className="text-xs text-gray-400 mt-2">
            Appuyez sur Cmd+Entree pour envoyer
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
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
                Envoyer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
