import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata: Metadata = {
  title: "Reserver un appel strategique | Neo-Coaching",
  description:
    "Reservez votre appel decouverte gratuit de 30 minutes avec Jean-Claude YEKPE.",
};

export default function ReserverPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-primary">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-success font-heading text-[10px] font-bold text-white">
              NC
            </div>
            <span className="font-heading text-sm font-bold text-white">
              Neo-Coaching
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-2">
            Reservez votre appel decouverte
          </h1>
          <p className="text-gray-500">
            30 minutes gratuites pour parler de votre projet
          </p>
        </div>

        {/* Wizard card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <BookingWizard />
        </div>

        {/* Trust note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Vos informations sont confidentielles et ne seront jamais partagees.
        </p>
      </div>
    </div>
  );
}
