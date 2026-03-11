"use client";

import { useState } from "react";
import { Award, Download, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { CertificatePDF } from "@/components/reports/certificate-pdf";
import type { MockCertificate } from "@/lib/mock-data";

interface CertificatesGalleryProps {
  certificates: MockCertificate[];
  coacheeName?: string;
}

export function CertificatesGallery({ certificates, coacheeName = "Participant" }: CertificatesGalleryProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (cert: MockCertificate) => {
    setDownloadingId(cert.id);

    try {
      // Generate PDF blob
      const blob = await pdf(
        <CertificatePDF
          data={{
            coacheeName,
            moduleTitle: cert.module_title,
            completionDate: new Date(cert.earned_date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          }}
        />
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificat-${cert.module_title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating certificate PDF:", error);
    } finally {
      setDownloadingId(null);
    }
  };

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
            <button
              onClick={() => handleDownload(cert)}
              disabled={downloadingId === cert.id}
              className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadingId === cert.id ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generation...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Telecharger PDF
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
