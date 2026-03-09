"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Video, Clock, Package, X, CreditCard, CheckCircle } from "lucide-react";
import type { ExpertData } from "./expert-card";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface ExpertPackage {
  hours: number;
  price: string;
  popular?: boolean;
}

interface ExpertDetailData extends ExpertData {
  fullBio: string;
  videoUrl: string | null;
  packages: ExpertPackage[];
  availableSlots: string[];
}

interface ExpertDetailProps {
  expert: ExpertDetailData;
}

function parsePrice(priceStr: string): number {
  // Extract numeric value from price string like "180€" or "1 250,00€"
  const cleaned = priceStr.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export function ExpertDetail({ expert }: ExpertDetailProps) {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<ExpertPackage | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingStep, setBookingStep] = useState<"confirm" | "processing" | "success">("confirm");

  const handleSelectPackage = (pkg: ExpertPackage) => {
    setSelectedPackage(pkg);
    // Scroll to slots section
    document.getElementById("slots-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectSlot = (slot: string) => {
    if (!selectedPackage) {
      toast("Veuillez d'abord choisir une formule", "warning");
      return;
    }
    setSelectedSlot(slot);
    setBookingStep("confirm");
    setShowBookingModal(true);
  };

  const handleBookWithStripe = async () => {
    if (!selectedPackage || !selectedSlot) return;

    setBookingStep("processing");
    setIsProcessing(true);

    try {
      const priceInCents = Math.round(parsePrice(selectedPackage.price) * 100);

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: `intervenant-${expert.id}-${selectedPackage.hours}h`,
          moduleName: `${expert.name} - ${selectedPackage.hours}h de ${expert.domain}`,
          priceInCents,
          successUrl: `${window.location.origin}/intervenants/${expert.id}?booking=success`,
          cancelUrl: `${window.location.origin}/intervenants/${expert.id}?booking=cancelled`,
          metadata: {
            expertId: expert.id,
            expertName: expert.name,
            packageHours: selectedPackage.hours.toString(),
            slot: selectedSlot,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la creation de la session de paiement");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("URL de paiement non recue");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast("Erreur lors de la reservation. Veuillez reessayer.", "error");
      setBookingStep("confirm");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
    setBookingStep("confirm");
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link
        href="/intervenants"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-accent text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux experts
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary-medium text-white font-heading font-bold text-3xl">
            {expert.initials}
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark">
              {expert.name}
            </h1>
            <span className="inline-block mt-1 text-lg font-medium text-accent">
              {expert.domain}
            </span>

            {/* Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < expert.rating
                      ? "text-accent fill-accent"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>

            <p className="mt-4 text-gray-600 leading-relaxed max-w-2xl">
              {expert.fullBio}
            </p>
          </div>
        </div>
      </div>

      {/* Video placeholder */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h2 className="font-heading text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <Video className="h-5 w-5 text-accent" />
          Presentation video
        </h2>
        <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <Video className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Video de presentation a venir</p>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h2 className="font-heading text-xl font-bold text-dark mb-2 flex items-center gap-2">
          <Package className="h-5 w-5 text-accent" />
          Formules
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Choisissez une formule puis selectionnez un creneau disponible.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {expert.packages.map((pkg) => {
            const isSelected = selectedPackage?.hours === pkg.hours;
            return (
              <div
                key={pkg.hours}
                className={cn(
                  "relative rounded-xl border-2 p-6 text-center transition-all cursor-pointer",
                  isSelected
                    ? "border-accent bg-accent/10 shadow-md ring-2 ring-accent/30"
                    : pkg.popular
                    ? "border-accent bg-accent/5 shadow-sm hover:shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                )}
                onClick={() => handleSelectPackage(pkg)}
              >
                {pkg.popular && !isSelected && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-white">
                    Populaire
                  </span>
                )}
                {isSelected && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-success px-3 py-0.5 text-xs font-bold text-white flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Selectionnee
                  </span>
                )}
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{pkg.hours}h</span>
                </div>
                <div className="font-heading text-3xl font-bold text-dark mb-1">
                  {pkg.price}
                </div>
                <p className="text-sm text-gray-500">
                  {pkg.hours} heure{pkg.hours > 1 ? "s" : ""} de session
                </p>
                <button
                  className={cn(
                    "mt-4 w-full rounded-lg py-2.5 text-sm font-semibold transition-colors",
                    isSelected
                      ? "bg-accent text-white hover:bg-accent/90"
                      : "bg-primary-medium text-white hover:bg-primary"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPackage(pkg);
                  }}
                >
                  {isSelected ? "Formule selectionnee" : "Choisir cette formule"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available slots */}
      <div
        id="slots-section"
        className={cn(
          "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border transition-all",
          selectedPackage ? "border-accent/30" : "border-gray-100"
        )}
      >
        <h2 className="font-heading text-xl font-bold text-dark mb-2 flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Creneaux disponibles
        </h2>
        {selectedPackage ? (
          <p className="text-sm text-gray-500 mb-4">
            Formule {selectedPackage.hours}h selectionnee ({selectedPackage.price}). Cliquez sur un creneau pour reserver.
          </p>
        ) : (
          <p className="text-sm text-warning mb-4">
            Veuillez d'abord choisir une formule ci-dessus.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {expert.availableSlots.map((slot) => {
            const isSlotSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => handleSelectSlot(slot)}
                disabled={!selectedPackage}
                className={cn(
                  "rounded-lg border-2 py-3 px-4 text-sm font-medium transition-all",
                  !selectedPackage
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : isSlotSelected
                    ? "border-accent bg-accent text-white"
                    : "border-gray-200 text-gray-600 hover:border-accent hover:text-accent hover:bg-accent/5"
                )}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking confirmation modal */}
      {showBookingModal && selectedPackage && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="border-b border-gray-100 p-5 flex items-center justify-between">
              <h2 className="font-heading font-semibold text-lg text-dark">
                {bookingStep === "success" ? "Reservation confirmee" : "Confirmer la reservation"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {bookingStep === "confirm" && (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-medium text-white flex items-center justify-center font-heading font-bold">
                        {expert.initials}
                      </div>
                      <div>
                        <p className="font-medium text-dark">{expert.name}</p>
                        <p className="text-sm text-gray-500">{expert.domain}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Formule</span>
                        <span className="font-medium text-dark">{selectedPackage.hours} heure{selectedPackage.hours > 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Creneau</span>
                        <span className="font-medium text-dark">{selectedSlot}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                        <span className="text-gray-500">Total</span>
                        <span className="font-heading font-bold text-lg text-accent">{selectedPackage.price}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Vous serez redirige vers Stripe pour finaliser le paiement securise.
                  </p>
                </div>
              )}

              {bookingStep === "processing" && (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Redirection vers le paiement...</p>
                </div>
              )}

              {bookingStep === "success" && (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-dark mb-2">
                    Reservation confirmee !
                  </h3>
                  <p className="text-sm text-gray-500">
                    Vous recevrez un email de confirmation avec les details de votre session.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {bookingStep === "confirm" && (
              <div className="border-t border-gray-100 p-5 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleBookWithStripe}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Payer {selectedPackage.price}
                </button>
              </div>
            )}

            {bookingStep === "success" && (
              <div className="border-t border-gray-100 p-5">
                <button
                  onClick={closeModal}
                  className="w-full px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
