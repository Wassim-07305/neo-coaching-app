"use client";

import { useState } from "react";
import { X, Video, Calendar, Mail, Download, Loader2, CheckCircle, Copy } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface ScheduleMeetingModalProps {
  coacheeId: string;
  coacheeName: string;
  coacheeEmail: string;
  moduleTitle?: string;
  onClose: () => void;
  onScheduled?: (meetingData: MeetingData) => void;
}

interface MeetingData {
  id: number;
  joinUrl: string;
  startUrl: string;
  password: string;
  icsContent: string;
  filename: string;
}

export function ScheduleMeetingModal({
  coacheeName,
  coacheeEmail,
  moduleTitle,
  onClose,
  onScheduled,
}: ScheduleMeetingModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);

  // Form state
  const [topic, setTopic] = useState(
    moduleTitle
      ? `Coaching - ${moduleTitle}`
      : `Seance de coaching avec ${coacheeName}`
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      toast("Veuillez remplir tous les champs", "error");
      return;
    }

    setLoading(true);

    try {
      const startTime = new Date(`${date}T${time}:00`).toISOString();

      const response = await fetch("/api/zoom/create-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          startTime,
          duration,
          attendeeEmail: coacheeEmail,
          attendeeName: coacheeName,
          moduleTitle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create meeting");
      }

      const data = await response.json();

      const meeting: MeetingData = {
        id: data.meeting.id,
        joinUrl: data.meeting.joinUrl,
        startUrl: data.meeting.startUrl,
        password: data.meeting.password,
        icsContent: data.calendar.icsContent,
        filename: data.calendar.filename,
      };

      setMeetingData(meeting);
      onScheduled?.(meeting);
      toast("Reunion Zoom creee avec succes !", "success");
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast("Erreur lors de la creation de la reunion", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadICS = () => {
    if (!meetingData) return;

    const blob = new Blob([meetingData.icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = meetingData.filename;
    link.click();
    URL.revokeObjectURL(url);
    toast("Fichier calendrier telecharge", "success");
  };

  const copyLink = () => {
    if (!meetingData) return;
    navigator.clipboard.writeText(meetingData.joinUrl);
    toast("Lien copie dans le presse-papier", "success");
  };

  const sendEmailInvite = () => {
    if (!meetingData) return;

    const subject = encodeURIComponent(topic);
    const body = encodeURIComponent(
      `Bonjour ${coacheeName},\n\n` +
      `Votre seance de coaching est programmee.\n\n` +
      `Date: ${date} a ${time}\n` +
      `Duree: ${duration} minutes\n\n` +
      `Rejoindre via Zoom: ${meetingData.joinUrl}\n` +
      `Mot de passe: ${meetingData.password}\n\n` +
      `A bientot,\n` +
      `Jean-Claude YEKPE\n` +
      `NEO-FORMATIONS`
    );

    window.open(`mailto:${coacheeEmail}?subject=${subject}&body=${body}`, "_blank");
  };

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Video className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-dark">
                Planifier une reunion Zoom
              </h2>
              <p className="text-xs text-gray-500">avec {coacheeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {!meetingData ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Sujet de la reunion
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Duree
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 heure</option>
                  <option value={90}>1h30</option>
                  <option value={120}>2 heures</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creation en cours...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    Creer la reunion Zoom
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Success message */}
              <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success" />
                <div>
                  <p className="font-medium text-dark">Reunion creee avec succes !</p>
                  <p className="text-sm text-gray-500">ID: {meetingData.id}</p>
                </div>
              </div>

              {/* Meeting link */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Lien de la reunion
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={meetingData.joinUrl}
                    readOnly
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                  />
                  <button
                    onClick={copyLink}
                    className="px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="text"
                  value={meetingData.password}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadICS}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Telecharger .ics
                </button>
                <button
                  onClick={sendEmailInvite}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-medium transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Envoyer par email
                </button>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
