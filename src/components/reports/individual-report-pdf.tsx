import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// ---------- Types ----------
export interface IndividualReportModuleProgress {
  moduleTitle: string;
  status: "complete" | "en_cours" | "non_commence" | "a_venir";
  satisfactionScore?: number;
}

export interface IndividualReportLivrable {
  moduleTitle: string;
  type: "ecrit" | "audio" | "video";
  submissionDate: string;
  status: "soumis" | "en_attente" | "valide";
  fileName: string;
}

export interface IndividualReportKpiHistory {
  month: string;
  investissement: number;
  efficacite: number;
  participation: number;
}

export interface IndividualReportData {
  firstName: string;
  lastName: string;
  email: string;
  type: "individuel" | "entreprise";
  companyName: string | null;
  startDate: string;
  currentModule: string | null;
  kpis: { investissement: number; efficacite: number; participation: number };
  kpiHistory: IndividualReportKpiHistory[];
  moduleProgress: IndividualReportModuleProgress[];
  livrables: IndividualReportLivrable[];
  satisfactionScores: { moduleTitle: string; score: number }[];
  coachNotes: string;
}

// ---------- Colors ----------
const COLORS = {
  primary: "#0A1628",
  primaryMedium: "#1B2A4A",
  accent: "#D4A843",
  success: "#2D8C4E",
  warning: "#F39C12",
  danger: "#E74C3C",
  white: "#FFFFFF",
  lightGray: "#F3F4F6",
  gray: "#9CA3AF",
  darkGray: "#4B5563",
  borderGray: "#E5E7EB",
};

function getKpiHexColor(value: number): string {
  if (value <= 3) return COLORS.danger;
  if (value <= 6) return COLORS.warning;
  return COLORS.success;
}

function getStatusLabel(
  status: "complete" | "en_cours" | "non_commence" | "a_venir"
): string {
  switch (status) {
    case "complete":
      return "Termine";
    case "en_cours":
      return "En cours";
    case "non_commence":
      return "Non commence";
    case "a_venir":
      return "A venir";
  }
}

function getStatusColor(
  status: "complete" | "en_cours" | "non_commence" | "a_venir"
): string {
  switch (status) {
    case "complete":
      return COLORS.success;
    case "en_cours":
      return COLORS.accent;
    case "non_commence":
      return COLORS.gray;
    case "a_venir":
      return COLORS.gray;
  }
}

function getLivrableStatusLabel(
  status: "soumis" | "en_attente" | "valide"
): string {
  switch (status) {
    case "soumis":
      return "Soumis";
    case "en_attente":
      return "En attente";
    case "valide":
      return "Valide";
  }
}

// ---------- Styles ----------
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.primary,
    paddingBottom: 60,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 30,
    paddingBottom: 24,
  },
  headerLogo: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: COLORS.accent,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 9,
    color: COLORS.gray,
    letterSpacing: 1,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  headerMeta: {
    fontSize: 10,
    color: COLORS.gray,
  },
  accentLine: {
    height: 3,
    backgroundColor: COLORS.accent,
  },
  body: {
    padding: 30,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primaryMedium,
    marginBottom: 10,
    marginTop: 20,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.accent,
    marginBottom: 10,
    opacity: 0.4,
  },
  // Coachee info
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
    marginTop: 4,
  },
  infoItem: {
    width: "50%",
    paddingVertical: 5,
    paddingRight: 10,
  },
  infoLabel: {
    fontSize: 8,
    color: COLORS.gray,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },
  // KPI cards
  kpiRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 6,
    padding: 12,
    backgroundColor: COLORS.lightGray,
    alignItems: "center",
  },
  kpiLabel: {
    fontSize: 9,
    color: COLORS.gray,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  kpiSubtext: {
    fontSize: 8,
    color: COLORS.gray,
  },
  kpiBar: {
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.borderGray,
    width: "100%",
    marginTop: 6,
  },
  kpiBarFill: {
    height: 5,
    borderRadius: 3,
  },
  // History summary
  historyNote: {
    fontSize: 9,
    color: COLORS.darkGray,
    marginTop: 8,
    lineHeight: 1.5,
  },
  // Module progress table
  table: {
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryMedium,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  tableRowAlt: {
    backgroundColor: COLORS.lightGray,
  },
  tableCell: {
    fontSize: 9,
    flex: 1,
    textAlign: "center",
    color: COLORS.darkGray,
  },
  tableCellLabel: {
    textAlign: "left",
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },
  // Badge
  badge: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: COLORS.white,
  },
  // Satisfaction
  satisfactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  satisfactionModule: {
    fontSize: 10,
    color: COLORS.primary,
  },
  satisfactionScore: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  // Notes
  notesBox: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    padding: 14,
    marginTop: 6,
  },
  notesText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: COLORS.darkGray,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
  },
  footerText: {
    fontSize: 8,
    color: COLORS.gray,
  },
  footerAccent: {
    fontSize: 8,
    color: COLORS.accent,
    fontFamily: "Helvetica-Bold",
  },
});

// ---------- Component ----------
export function IndividualReportPDF({
  data,
}: {
  data: IndividualReportData;
}) {
  const completedModules = data.moduleProgress.filter(
    (m) => m.status === "complete"
  ).length;
  const totalModules = data.moduleProgress.length;
  const completionPct =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Build KPI history summary text
  const historyLen = data.kpiHistory.length;
  const historyText =
    historyLen > 0
      ? `Evolution sur ${historyLen} mois : Investissement ${data.kpiHistory[0].investissement} -> ${data.kpiHistory[historyLen - 1].investissement}, Efficacite ${data.kpiHistory[0].efficacite} -> ${data.kpiHistory[historyLen - 1].efficacite}, Participation ${data.kpiHistory[0].participation} -> ${data.kpiHistory[historyLen - 1].participation}.`
      : "";

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerLogo}>NEO-FORMATIONS</Text>
          <Text style={s.headerSubtitle}>
            COACHING &amp; DEVELOPPEMENT PERSONNEL
          </Text>
          <Text style={s.headerTitle}>Rapport Individuel</Text>
          <Text style={s.headerMeta}>
            {data.firstName} {data.lastName}
          </Text>
        </View>
        <View style={s.accentLine} />

        <View style={s.body}>
          {/* Coachee Info */}
          <Text style={[s.sectionTitle, s.sectionTitleFirst]}>
            Informations du Coache
          </Text>
          <View style={s.sectionDivider} />
          <View style={s.infoGrid}>
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Nom complet</Text>
              <Text style={s.infoValue}>
                {data.firstName} {data.lastName}
              </Text>
            </View>
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Email</Text>
              <Text style={s.infoValue}>{data.email}</Text>
            </View>
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Type</Text>
              <Text style={s.infoValue}>
                {data.type === "individuel" ? "Individuel" : "Entreprise"}
              </Text>
            </View>
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Entreprise</Text>
              <Text style={s.infoValue}>{data.companyName || "N/A"}</Text>
            </View>
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Date de debut</Text>
              <Text style={s.infoValue}>{data.startDate}</Text>
            </View>
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Module actuel</Text>
              <Text style={s.infoValue}>{data.currentModule || "Aucun"}</Text>
            </View>
          </View>

          {/* Parcours Progress */}
          <Text style={s.sectionTitle}>Progression du Parcours</Text>
          <View style={s.sectionDivider} />
          <View style={s.table}>
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderCell, { flex: 2, textAlign: "left" }]}>
                Module
              </Text>
              <Text style={s.tableHeaderCell}>Statut</Text>
              <Text style={s.tableHeaderCell}>Satisfaction</Text>
            </View>
            {data.moduleProgress.map((mod, i) => (
              <View
                key={mod.moduleTitle}
                style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}
              >
                <Text style={[s.tableCell, s.tableCellLabel, { flex: 2 }]}>
                  {mod.moduleTitle}
                </Text>
                <Text
                  style={[s.tableCell, { color: getStatusColor(mod.status) }]}
                >
                  {getStatusLabel(mod.status)}
                </Text>
                <Text
                  style={[
                    s.tableCell,
                    {
                      color: mod.satisfactionScore
                        ? getKpiHexColor(mod.satisfactionScore)
                        : COLORS.gray,
                    },
                  ]}
                >
                  {mod.satisfactionScore
                    ? `${mod.satisfactionScore}/10`
                    : "-"}
                </Text>
              </View>
            ))}
          </View>
          <Text style={s.historyNote}>
            Progression globale : {completedModules}/{totalModules} modules
            termines ({completionPct}%)
          </Text>

          {/* KPI Indicators */}
          <Text style={s.sectionTitle}>Indicateurs KPI</Text>
          <View style={s.sectionDivider} />
          <View style={s.kpiRow}>
            {(
              [
                { label: "Investissement", value: data.kpis.investissement },
                { label: "Efficacite", value: data.kpis.efficacite },
                { label: "Participation", value: data.kpis.participation },
              ] as const
            ).map((kpi) => {
              const color = getKpiHexColor(kpi.value);
              return (
                <View key={kpi.label} style={s.kpiCard}>
                  <Text style={s.kpiLabel}>{kpi.label}</Text>
                  <Text style={[s.kpiValue, { color }]}>{kpi.value}</Text>
                  <Text style={s.kpiSubtext}>/ 10</Text>
                  <View style={s.kpiBar}>
                    <View
                      style={[
                        s.kpiBarFill,
                        {
                          width: `${(kpi.value / 10) * 100}%`,
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
          {historyText ? (
            <Text style={s.historyNote}>{historyText}</Text>
          ) : null}

          {/* Livrables */}
          <Text style={s.sectionTitle}>Livrables</Text>
          <View style={s.sectionDivider} />
          {data.livrables.length === 0 ? (
            <Text style={s.historyNote}>Aucun livrable soumis.</Text>
          ) : (
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text
                  style={[s.tableHeaderCell, { flex: 2, textAlign: "left" }]}
                >
                  Module
                </Text>
                <Text style={s.tableHeaderCell}>Type</Text>
                <Text style={s.tableHeaderCell}>Date</Text>
                <Text style={s.tableHeaderCell}>Statut</Text>
              </View>
              {data.livrables.map((liv, i) => (
                <View
                  key={`${liv.fileName}-${i}`}
                  style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}
                >
                  <Text style={[s.tableCell, s.tableCellLabel, { flex: 2 }]}>
                    {liv.moduleTitle}
                  </Text>
                  <Text style={s.tableCell}>{liv.type}</Text>
                  <Text style={s.tableCell}>{liv.submissionDate}</Text>
                  <Text
                    style={[
                      s.tableCell,
                      {
                        color:
                          liv.status === "valide"
                            ? COLORS.success
                            : liv.status === "en_attente"
                              ? COLORS.warning
                              : COLORS.gray,
                      },
                    ]}
                  >
                    {getLivrableStatusLabel(liv.status)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Satisfaction Scores */}
          {data.satisfactionScores.length > 0 && (
            <>
              <Text style={s.sectionTitle}>Scores de Satisfaction</Text>
              <View style={s.sectionDivider} />
              {data.satisfactionScores.map((sat) => (
                <View key={sat.moduleTitle} style={s.satisfactionRow}>
                  <Text style={s.satisfactionModule}>{sat.moduleTitle}</Text>
                  <Text
                    style={[
                      s.satisfactionScore,
                      { color: getKpiHexColor(sat.score) },
                    ]}
                  >
                    {sat.score}/10
                  </Text>
                </View>
              ))}
            </>
          )}

          {/* Coach Notes */}
          {data.coachNotes && (
            <>
              <Text style={s.sectionTitle}>Notes du Coach</Text>
              <View style={s.sectionDivider} />
              <View style={s.notesBox}>
                <Text style={s.notesText}>{data.coachNotes}</Text>
              </View>
            </>
          )}
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerAccent}>
            NEO-FORMATIONS - Jean-Claude YEKPE
          </Text>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
