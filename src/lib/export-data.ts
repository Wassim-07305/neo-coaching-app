// Data export utilities (F36b)

export function exportToCsv(
  data: Record<string, unknown>[],
  filename: string
) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(";"),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          const str = val === null || val === undefined ? "" : String(val);
          return str.includes(";") || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(";")
    ),
  ];

  const blob = new Blob(["\ufeff" + csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportToJson(
  data: Record<string, unknown>[],
  filename: string
) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, `${filename}.json`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Pre-built exporters for common data types
export function exportCoachees(
  coachees: { first_name: string; last_name: string; email: string; type: string; status: string; company_name: string | null }[]
) {
  exportToCsv(
    coachees.map((c) => ({
      Prenom: c.first_name,
      Nom: c.last_name,
      Email: c.email,
      Type: c.type,
      Statut: c.status,
      Entreprise: c.company_name || "",
    })),
    `coachees_${new Date().toISOString().slice(0, 10)}`
  );
}

export function exportKpiHistory(
  data: { user_name: string; month: string; investissement: number; efficacite: number; participation: number }[]
) {
  exportToCsv(
    data.map((d) => ({
      Coachee: d.user_name,
      Mois: d.month,
      Investissement: d.investissement,
      Efficacite: d.efficacite,
      Participation: d.participation,
      Moyenne: Math.round(((d.investissement + d.efficacite + d.participation) / 3) * 10) / 10,
    })),
    `kpi_history_${new Date().toISOString().slice(0, 10)}`
  );
}
