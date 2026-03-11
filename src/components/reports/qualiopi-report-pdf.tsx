import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// ---------- Types ----------
export interface QualiopiQuestionnaireData {
  type: "amont" | "aval";
  completedAt: string;
  questions: Array<{
    label: string;
    answer: string | number;
  }>;
}

export interface QualiopiModuleData {
  title: string;
  startDate: string;
  endDate: string | null;
  status: "complete" | "en_cours" | "non_commence";
  satisfactionScore: number | null;
  questionnaires: QualiopiQuestionnaireData[];
  attendanceRate: number;
}

export interface QualiopiReportData {
  // Trainee info
  firstName: string;
  lastName: string;
  email: string;
  companyName: string | null;
  // Training info
  parcoursTitle: string;
  startDate: string;
  endDate: string | null;
  totalHours: number;
  // Modules
  modules: QualiopiModuleData[];
  // Global stats
  globalSatisfaction: number;
  completionRate: number;
  attendanceRate: number;
  // Certification
  certificationEligible: boolean;
  certificationDate: string | null;
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
  qualiopi: "#003B6F", // Qualiopi blue
};

function getStatusColor(status: string): string {
  switch (status) {
    case "complete":
      return COLORS.success;
    case "en_cours":
      return COLORS.warning;
    default:
      return COLORS.gray;
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "complete":
      return "Termine";
    case "en_cours":
      return "En cours";
    default:
      return "Non commence";
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
  // Header
  header: {
    backgroundColor: COLORS.qualiopi,
    padding: 30,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLogo: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 9,
    color: COLORS.lightGray,
    letterSpacing: 1,
    marginBottom: 16,
  },
  qualiopiBadge: {
    backgroundColor: COLORS.white,
    borderRadius: 4,
    padding: 8,
    paddingHorizontal: 12,
  },
  qualiopiBadgeText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.qualiopi,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  headerMeta: {
    fontSize: 10,
    color: COLORS.lightGray,
  },
  accentLine: {
    height: 3,
    backgroundColor: COLORS.accent,
  },
  // Body
  body: {
    padding: 30,
    paddingTop: 20,
  },
  // Section
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
    backgroundColor: COLORS.qualiopi,
    marginBottom: 10,
    opacity: 0.3,
  },
  // Info grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  infoBox: {
    width: "48%",
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    padding: 12,
  },
  infoLabel: {
    fontSize: 8,
    color: COLORS.gray,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },
  // Stats row
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.gray,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Module card
  moduleCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 6,
    padding: 14,
    marginBottom: 10,
  },
  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },
  moduleStatus: {
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: COLORS.white,
  },
  moduleStats: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 10,
  },
  moduleStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  moduleStatLabel: {
    fontSize: 9,
    color: COLORS.gray,
  },
  moduleStatValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },
  // Questionnaire section
  questionnaireSection: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    padding: 10,
    marginTop: 8,
  },
  questionnaireTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primaryMedium,
    marginBottom: 6,
  },
  questionnaireRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  questionLabel: {
    flex: 2,
    fontSize: 9,
    color: COLORS.darkGray,
  },
  questionAnswer: {
    flex: 1,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
    textAlign: "right",
  },
  // Certification box
  certificationBox: {
    backgroundColor: COLORS.success,
    borderRadius: 6,
    padding: 16,
    marginTop: 20,
    alignItems: "center",
  },
  certificationBoxPending: {
    backgroundColor: COLORS.warning,
  },
  certificationTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  certificationText: {
    fontSize: 10,
    color: COLORS.white,
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
    backgroundColor: COLORS.white,
  },
  footerText: {
    fontSize: 8,
    color: COLORS.gray,
  },
  footerAccent: {
    fontSize: 8,
    color: COLORS.qualiopi,
    fontFamily: "Helvetica-Bold",
  },
});

// ---------- Component ----------
export function QualiopiReportPDF({ data }: { data: QualiopiReportData }) {
  const completedModules = data.modules.filter((m) => m.status === "complete").length;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerRow}>
            <View>
              <Text style={s.headerLogo}>NEO-FORMATIONS</Text>
              <Text style={s.headerSubtitle}>
                ORGANISME DE FORMATION CERTIFIE
              </Text>
            </View>
            <View style={s.qualiopiBadge}>
              <Text style={s.qualiopiBadgeText}>QUALIOPI</Text>
            </View>
          </View>
          <Text style={s.headerTitle}>Attestation de Formation</Text>
          <Text style={s.headerMeta}>
            Document officiel - Conforme aux exigences Qualiopi
          </Text>
        </View>
        <View style={s.accentLine} />

        {/* Body */}
        <View style={s.body}>
          {/* Trainee Info */}
          <Text style={[s.sectionTitle, s.sectionTitleFirst]}>
            Informations Stagiaire
          </Text>
          <View style={s.sectionDivider} />
          <View style={s.infoGrid}>
            <View style={s.infoBox}>
              <Text style={s.infoLabel}>Nom complet</Text>
              <Text style={s.infoValue}>
                {data.firstName} {data.lastName}
              </Text>
            </View>
            <View style={s.infoBox}>
              <Text style={s.infoLabel}>Email</Text>
              <Text style={s.infoValue}>{data.email}</Text>
            </View>
            {data.companyName && (
              <View style={s.infoBox}>
                <Text style={s.infoLabel}>Entreprise</Text>
                <Text style={s.infoValue}>{data.companyName}</Text>
              </View>
            )}
            <View style={s.infoBox}>
              <Text style={s.infoLabel}>Parcours</Text>
              <Text style={s.infoValue}>{data.parcoursTitle}</Text>
            </View>
          </View>

          {/* Training Stats */}
          <Text style={s.sectionTitle}>Indicateurs de Formation</Text>
          <View style={s.sectionDivider} />
          <View style={s.statsRow}>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: COLORS.success }]}>
                {data.completionRate}%
              </Text>
              <Text style={s.statLabel}>Taux de completion</Text>
            </View>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: COLORS.qualiopi }]}>
                {data.attendanceRate}%
              </Text>
              <Text style={s.statLabel}>Assiduite</Text>
            </View>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: COLORS.accent }]}>
                {data.globalSatisfaction.toFixed(1)}/10
              </Text>
              <Text style={s.statLabel}>Satisfaction</Text>
            </View>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: COLORS.primary }]}>
                {data.totalHours}h
              </Text>
              <Text style={s.statLabel}>Heures totales</Text>
            </View>
          </View>

          {/* Modules Detail */}
          <Text style={s.sectionTitle}>
            Detail des Modules ({completedModules}/{data.modules.length} termines)
          </Text>
          <View style={s.sectionDivider} />

          {data.modules.map((module, idx) => (
            <View key={idx} style={s.moduleCard} wrap={false}>
              <View style={s.moduleHeader}>
                <Text style={s.moduleTitle}>{module.title}</Text>
                <Text
                  style={[
                    s.moduleStatus,
                    { backgroundColor: getStatusColor(module.status) },
                  ]}
                >
                  {getStatusLabel(module.status)}
                </Text>
              </View>

              <View style={s.moduleStats}>
                <View style={s.moduleStat}>
                  <Text style={s.moduleStatLabel}>Debut:</Text>
                  <Text style={s.moduleStatValue}>{module.startDate}</Text>
                </View>
                {module.endDate && (
                  <View style={s.moduleStat}>
                    <Text style={s.moduleStatLabel}>Fin:</Text>
                    <Text style={s.moduleStatValue}>{module.endDate}</Text>
                  </View>
                )}
                <View style={s.moduleStat}>
                  <Text style={s.moduleStatLabel}>Assiduite:</Text>
                  <Text style={s.moduleStatValue}>{module.attendanceRate}%</Text>
                </View>
                {module.satisfactionScore !== null && (
                  <View style={s.moduleStat}>
                    <Text style={s.moduleStatLabel}>Satisfaction:</Text>
                    <Text style={s.moduleStatValue}>
                      {module.satisfactionScore}/10
                    </Text>
                  </View>
                )}
              </View>

              {/* Questionnaires */}
              {module.questionnaires.map((q, qIdx) => (
                <View key={qIdx} style={s.questionnaireSection}>
                  <Text style={s.questionnaireTitle}>
                    Questionnaire {q.type === "amont" ? "Amont" : "Aval"} -{" "}
                    {q.completedAt}
                  </Text>
                  {q.questions.slice(0, 5).map((question, i) => (
                    <View key={i} style={s.questionnaireRow}>
                      <Text style={s.questionLabel}>{question.label}</Text>
                      <Text style={s.questionAnswer}>
                        {typeof question.answer === "number"
                          ? `${question.answer}/10`
                          : question.answer}
                      </Text>
                    </View>
                  ))}
                  {q.questions.length > 5 && (
                    <Text style={[s.questionLabel, { marginTop: 4, fontStyle: "italic" }]}>
                      ... et {q.questions.length - 5} autres reponses
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ))}

          {/* Certification Status */}
          <View
            style={[
              s.certificationBox,
              ...(data.certificationEligible ? [] : [s.certificationBoxPending]),
            ]}
          >
            <Text style={s.certificationTitle}>
              {data.certificationEligible
                ? "Certification Obtenue"
                : "Certification en cours"}
            </Text>
            <Text style={s.certificationText}>
              {data.certificationEligible && data.certificationDate
                ? `Delivree le ${data.certificationDate}`
                : `Completion requise: ${data.completionRate}% / 100%`}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerAccent}>
            NEO-FORMATIONS - Organisme certifie Qualiopi
          </Text>
          <Text style={s.footerText}>
            Document genere le{" "}
            {new Date().toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
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
