"use client";

import { FileText, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Report {
  id: string;
  title: string;
  date: string;
  period: string;
}

interface ReportsPreviewProps {
  reports: Report[];
}

export function ReportsPreview({ reports }: ReportsPreviewProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <h2 className="font-heading font-semibold text-dark text-base">
            Rapports mensuels
          </h2>
        </div>
        <Link
          href="/dirigeant/rapports"
          className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          Voir tout
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-dark truncate">{report.title}</p>
              <p className="text-xs text-gray-500">{report.period}</p>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
