"use client";

import Link from "next/link";
import { ArrowLeft, Star, Video, Clock, Package } from "lucide-react";
import type { ExpertData } from "./expert-card";
import { cn } from "@/lib/utils";

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

export function ExpertDetail({ expert }: ExpertDetailProps) {
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
        <h2 className="font-heading text-xl font-bold text-dark mb-6 flex items-center gap-2">
          <Package className="h-5 w-5 text-accent" />
          Formules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {expert.packages.map((pkg) => (
            <div
              key={pkg.hours}
              className={cn(
                "relative rounded-xl border-2 p-6 text-center transition-shadow",
                pkg.popular
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-white">
                  Populaire
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
              <button className="mt-4 w-full rounded-lg bg-primary-medium py-2.5 text-sm font-semibold text-white hover:bg-primary transition-colors">
                Reserver
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Available slots */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h2 className="font-heading text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Creneaux disponibles
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {expert.availableSlots.map((slot) => (
            <button
              key={slot}
              className="rounded-lg border-2 border-gray-200 py-3 px-4 text-sm font-medium text-gray-600 hover:border-accent hover:text-accent transition-colors"
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
