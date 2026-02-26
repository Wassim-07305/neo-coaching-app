"use client";

import { Award, Download } from "lucide-react";
import type { MockCertificate } from "@/lib/mock-data";

interface CertificatesGalleryProps {
  certificates: MockCertificate[];
}

export function CertificatesGallery({ certificates }: CertificatesGalleryProps) {
  if (certificates.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
        <h2 className="font-heading font-semibold text-dark text-base mb-4">Mes Certificats</h2>
        <div className="text-center py-8">
          <Award className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Completez votre premier module pour obtenir votre certificat
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
      <h2 className="font-heading font-semibold text-dark text-base mb-4">Mes Certificats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="relative border-2 border-accent/30 rounded-xl p-4 bg-gradient-to-br from-accent/5 to-transparent"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-dark truncate">{cert.module_title}</p>
                <p className="text-xs text-gray-500">
                  Obtenu le{" "}
                  {new Date(cert.earned_date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
              <Download className="w-3.5 h-3.5" />
              Telecharger
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
