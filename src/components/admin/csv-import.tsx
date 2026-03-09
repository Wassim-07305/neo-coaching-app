"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CsvRow {
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
}

interface CsvImportProps {
  onImport: (rows: CsvRow[]) => void;
  onClose?: () => void;
}

function parseCsv(text: string): { rows: CsvRow[]; errors: string[] } {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { rows: [], errors: ["Le fichier doit contenir au moins un en-tete et une ligne de donnees."] };

  const header = lines[0].toLowerCase().split(/[;,\t]/);
  const nameIdx = header.findIndex((h) => h.includes("prenom") || h.includes("first"));
  const lastIdx = header.findIndex((h) => h.includes("nom") || h.includes("last"));
  const emailIdx = header.findIndex((h) => h.includes("email") || h.includes("mail"));
  const deptIdx = header.findIndex((h) => h.includes("departement") || h.includes("department") || h.includes("service"));

  if (emailIdx === -1) return { rows: [], errors: ["Colonne 'email' introuvable dans l'en-tete."] };

  const rows: CsvRow[] = [];
  const errors: string[] = [];
  const emails = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(/[;,\t]/);
    if (cols.length < 2) continue;

    const email = cols[emailIdx]?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      errors.push(`Ligne ${i + 1}: email invalide "${cols[emailIdx]?.trim()}"`);
      continue;
    }
    if (emails.has(email)) {
      errors.push(`Ligne ${i + 1}: email duplique "${email}"`);
      continue;
    }
    emails.add(email);

    rows.push({
      first_name: nameIdx >= 0 ? cols[nameIdx]?.trim() || "" : "",
      last_name: lastIdx >= 0 ? cols[lastIdx]?.trim() || "" : "",
      email,
      department: deptIdx >= 0 ? cols[deptIdx]?.trim() : undefined,
    });
  }

  return { rows, errors };
}

export function CsvImport({ onImport, onClose }: CsvImportProps) {
  const [dragOver, setDragOver] = useState(false);
  const [parsed, setParsed] = useState<{ rows: CsvRow[]; errors: string[] } | null>(null);
  const [importing, setImporting] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setParsed(parseCsv(text));
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleConfirm = () => {
    if (!parsed?.rows.length) return;
    setImporting(true);
    setTimeout(() => {
      onImport(parsed.rows);
      setImporting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="font-heading text-lg font-bold text-dark">
            Importer des salaries (CSV)
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!parsed ? (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
                  dragOver ? "border-[#D4A843] bg-[#D4A843]/5" : "border-gray-200"
                )}
              >
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Glissez votre fichier CSV ici ou{" "}
                  <label className="cursor-pointer text-[#D4A843] hover:underline">
                    parcourez
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-400">
                  Format: Prenom, Nom, Email, Departement (optionnel)
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">Exemple de format CSV :</p>
                <code className="text-[11px] text-gray-500 block">
                  Prenom;Nom;Email;Departement<br />
                  Marie;Dupont;marie@company.fr;Marketing<br />
                  Pierre;Martin;pierre@company.fr;RH
                </code>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                <FileText className="h-5 w-5 text-[#2D8C4E]" />
                <div>
                  <p className="text-sm font-medium text-[#2D8C4E]">
                    {parsed.rows.length} salarie{parsed.rows.length > 1 ? "s" : ""} detecte{parsed.rows.length > 1 ? "s" : ""}
                  </p>
                  {parsed.errors.length > 0 && (
                    <p className="text-xs text-[#F39C12]">
                      {parsed.errors.length} erreur{parsed.errors.length > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>

              {parsed.errors.length > 0 && (
                <div className="max-h-24 overflow-y-auto rounded-lg bg-red-50 p-3 space-y-1">
                  {parsed.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#E74C3C]">
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      {err}
                    </div>
                  ))}
                </div>
              )}

              <div className="max-h-48 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Prenom</th>
                      <th className="px-3 py-2 text-left">Nom</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">Dept.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-3 py-1.5">{row.first_name}</td>
                        <td className="px-3 py-1.5">{row.last_name}</td>
                        <td className="px-3 py-1.5 text-gray-500">{row.email}</td>
                        <td className="px-3 py-1.5 text-gray-400">{row.department || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.rows.length > 10 && (
                  <p className="px-3 py-2 text-xs text-gray-400 text-center">
                    ... et {parsed.rows.length - 10} autres
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
          {parsed ? (
            <>
              <button
                onClick={() => setParsed(null)}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Changer de fichier
              </button>
              <button
                onClick={handleConfirm}
                disabled={!parsed.rows.length || importing}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#D4A843] py-2.5 text-sm font-semibold text-white hover:bg-[#c49a3a] disabled:opacity-50"
              >
                {importing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Importation...</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" /> Importer {parsed.rows.length} salaries</>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
