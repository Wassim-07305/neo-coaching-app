"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { cn } from "@/lib/utils";
import {
  FileText,
  Mic,
  Video,
  Upload,
  Check,
  Clock,
  X,
  Loader2,
} from "lucide-react";

type LivrableStatus = "en_attente" | "soumis" | "valide";

interface LivrableSection {
  id: string;
  label: string;
  icon: typeof FileText;
  type: "text" | "audio" | "video";
  acceptedFormats?: string;
  acceptLabel?: string;
  status: LivrableStatus;
}

const statusConfig: Record<
  LivrableStatus,
  { label: string; color: string; icon: typeof Check }
> = {
  en_attente: { label: "En attente", color: "text-gray-400 bg-gray-100", icon: Clock },
  soumis: { label: "Soumis", color: "text-accent bg-accent/10", icon: Loader2 },
  valide: { label: "Valide", color: "text-success bg-success/10", icon: Check },
};

export function LivrableUpload() {
  const [resumeText, setResumeText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [statuses, setStatuses] = useState<Record<string, LivrableStatus>>({
    resume: "en_attente",
    audio: "en_attente",
    video: "en_attente",
  });
  const [submitting, setSubmitting] = useState(false);

  const audioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const sections: LivrableSection[] = [
    {
      id: "resume",
      label: "Resume ecrit",
      icon: FileText,
      type: "text",
      status: statuses.resume,
    },
    {
      id: "audio",
      label: "Enregistrement audio",
      icon: Mic,
      type: "audio",
      acceptedFormats: ".mp3,.wav,.m4a",
      acceptLabel: "MP3, WAV, M4A",
      status: statuses.audio,
    },
    {
      id: "video",
      label: "Video explicative",
      icon: Video,
      type: "video",
      acceptedFormats: ".mp4,.mov,.webm",
      acceptLabel: "MP4, MOV, WEBM",
      status: statuses.video,
    },
  ];

  function handleDrop(
    e: DragEvent<HTMLDivElement>,
    type: "audio" | "video"
  ) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (type === "audio") setAudioFile(file);
      else setVideoFile(file);
    }
  }

  function handleFileChange(
    e: ChangeEvent<HTMLInputElement>,
    type: "audio" | "video"
  ) {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "audio") setAudioFile(file);
      else setVideoFile(file);
    }
  }

  function handleSubmit() {
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      const newStatuses = { ...statuses };
      if (resumeText.length >= 200) newStatuses.resume = "soumis";
      if (audioFile) newStatuses.audio = "soumis";
      if (videoFile) newStatuses.video = "soumis";
      setStatuses(newStatuses);
      setSubmitting(false);
    }, 1200);
  }

  function StatusBadge({ status }: { status: LivrableStatus }) {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
          config.color
        )}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-6 h-6 text-accent" />
        <h2 className="font-heading text-lg font-bold text-dark">
          Livrables a soumettre
        </h2>
      </div>

      <div className="space-y-6">
        {/* Resume ecrit */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-semibold text-dark">Resume ecrit</h3>
            </div>
            <StatusBadge status={statuses.resume} />
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Redigez votre resume du module (minimum 200 caracteres)..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
          />
          <div className="flex items-center justify-between">
            <p
              className={cn(
                "text-xs",
                resumeText.length >= 200 ? "text-success" : "text-gray-400"
              )}
            >
              {resumeText.length} / 200 caracteres minimum
            </p>
            {resumeText.length >= 200 && (
              <Check className="w-4 h-4 text-success" />
            )}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Audio upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-semibold text-dark">
                Enregistrement audio
              </h3>
            </div>
            <StatusBadge status={statuses.audio} />
          </div>
          {audioFile ? (
            <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <Mic className="w-5 h-5 text-accent shrink-0" />
              <span className="text-sm text-dark flex-1 truncate">
                {audioFile.name}
              </span>
              <button
                onClick={() => {
                  setAudioFile(null);
                  if (audioRef.current) audioRef.current.value = "";
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, "audio")}
              onClick={() => audioRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-300" />
              <p className="text-sm text-gray-500">
                Glissez-deposez ou{" "}
                <span className="text-accent font-medium">parcourir</span>
              </p>
              <p className="text-xs text-gray-400">
                Formats acceptes : MP3, WAV, M4A
              </p>
            </div>
          )}
          <input
            ref={audioRef}
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={(e) => handleFileChange(e, "audio")}
            className="hidden"
          />
        </div>

        <hr className="border-gray-100" />

        {/* Video upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-semibold text-dark">
                Video explicative
              </h3>
            </div>
            <StatusBadge status={statuses.video} />
          </div>
          {videoFile ? (
            <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <Video className="w-5 h-5 text-accent shrink-0" />
              <span className="text-sm text-dark flex-1 truncate">
                {videoFile.name}
              </span>
              <button
                onClick={() => {
                  setVideoFile(null);
                  if (videoRef.current) videoRef.current.value = "";
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, "video")}
              onClick={() => videoRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-300" />
              <p className="text-sm text-gray-500">
                Glissez-deposez ou{" "}
                <span className="text-accent font-medium">parcourir</span>
              </p>
              <p className="text-xs text-gray-400">
                Formats acceptes : MP4, MOV, WEBM
              </p>
            </div>
          )}
          <input
            ref={videoRef}
            type="file"
            accept=".mp4,.mov,.webm"
            onChange={(e) => handleFileChange(e, "video")}
            className="hidden"
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent/90 disabled:opacity-50 transition-colors"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Soumettre mes livrables
            </>
          )}
        </button>
      </div>
    </div>
  );
}
