import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// ---------- Types ----------
export interface MonthlyReportKpi {
  label: string;
  value: number;
  previousValue: number;
}

export interface MonthlyReportEvolution {
  month: string;
  investissement: number;
  efficacite: number;
  participation: number;
}

export interface MonthlyReportData {
  companyName: string;
  dateRange: string;
  month: string;
  executiveSummary: string;
  kpis: MonthlyReportKpi[];
  evolution: MonthlyReportEvolution[];
  pointsForts: string[];
  pointsAttention: string[];
  recommandations: string[];
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

function getTrendSymbol(current: number, previous: number): string {
  if (current > previous) return "+";
  if (current < previous) return "-";
  return "=";
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
    backgroundColor: COLORS.accent,
    marginBottom: 10,
    opacity: 0.4,
  },
  // Executive summary
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: COLORS.darkGray,
  },
  // KPI row
  kpiRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 6,
    padding: 14,
    backgroundColor: COLORS.lightGray,
    alignItems: "center",
  },
  kpiLabel: {
    fontSize: 9,
    color: COLORS.gray,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  kpiSubtext: {
    fontSize: 8,
    color: COLORS.gray,
  },
  kpiBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.borderGray,
    width: "100%",
    marginTop: 8,
  },
  kpiBarFill: {
    height: 6,
    borderRadius: 3,
  },
  kpiTrend: {
    fontSize: 9,
    marginTop: 4,
  },
  // Table
  table: {
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryMedium,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingVertical: 8,
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
    paddingVertical: 7,
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
  // Bullet lists
  bulletList: {
    marginTop: 6,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingRight: 20,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 3,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: COLORS.darkGray,
    flex: 1,
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
export function MonthlyReportPDF({ data }: { data: MonthlyReportData }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerLogo}>NEO-FORMATIONS</Text>
          <Text style={s.headerSubtitle}>
            COACHING &amp; DEVELOPPEMENT PERSONNEL
          </Text>
          <Text style={s.headerTitle}>Rapport Mensuel</Text>
          <Text style={s.headerMeta}>
            {data.companyName} | {data.dateRange}
          </Text>
        </View>
        <View style={s.accentLine} />

        {/* Body */}
        <View style={s.body}>
          {/* Executive Summary */}
          <Text style={[s.sectionTitle, s.sectionTitleFirst]}>
            Resume Executif
          </Text>
          <View style={s.sectionDivider} />
          <Text style={s.summaryText}>{data.executiveSummary}</Text>

          {/* KPI Overview */}
          <Text style={s.sectionTitle}>Indicateurs Cles (KPI)</Text>
          <View style={s.sectionDivider} />
          <View style={s.kpiRow}>
            {data.kpis.map((kpi) => {
              const color = getKpiHexColor(kpi.value);
              const trend = getTrendSymbol(kpi.value, kpi.previousValue);
              const diff = kpi.value - kpi.previousValue;
              return (
                <View key={kpi.label} style={s.kpiCard}>
                  <Text style={s.kpiLabel}>{kpi.label}</Text>
                  <Text style={[s.kpiValue, { color }]}>
                    {kpi.value.toFixed(1)}
                  </Text>
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
                  <Text
                    style={[
                      s.kpiTrend,
                      {
                        color:
                          diff > 0
                            ? COLORS.success
                            : diff < 0
                              ? COLORS.danger
                              : COLORS.gray,
                      },
                    ]}
                  >
                    {trend}
                    {Math.abs(diff).toFixed(1)} vs mois precedent
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Evolution Table */}
          <Text style={s.sectionTitle}>Evolution Mensuelle</Text>
          <View style={s.sectionDivider} />
          <View style={s.table}>
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderCell, { textAlign: "left" }]}>
                Mois
              </Text>
              <Text style={s.tableHeaderCell}>Investissement</Text>
              <Text style={s.tableHeaderCell}>Efficacite</Text>
              <Text style={s.tableHeaderCell}>Participation</Text>
            </View>
            {data.evolution.map((row, i) => (
              <View
                key={row.month}
                style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}
              >
                <Text style={[s.tableCell, s.tableCellLabel]}>{row.month}</Text>
                <Text
                  style={[
                    s.tableCell,
                    { color: getKpiHexColor(row.investissement) },
                  ]}
                >
                  {row.investissement.toFixed(1)}
                </Text>
                <Text
                  style={[
                    s.tableCell,
                    { color: getKpiHexColor(row.efficacite) },
                  ]}
                >
                  {row.efficacite.toFixed(1)}
                </Text>
                <Text
                  style={[
                    s.tableCell,
                    { color: getKpiHexColor(row.participation) },
                  ]}
                >
                  {row.participation.toFixed(1)}
                </Text>
              </View>
            ))}
          </View>

          {/* Points Forts */}
          <Text style={s.sectionTitle}>Points Forts</Text>
          <View style={s.sectionDivider} />
          <View style={s.bulletList}>
            {data.pointsForts.map((p, i) => (
              <View key={i} style={s.bulletItem}>
                <View
                  style={[s.bulletDot, { backgroundColor: COLORS.success }]}
                />
                <Text style={s.bulletText}>{p}</Text>
              </View>
            ))}
          </View>

          {/* Points d'Attention */}
          <Text style={s.sectionTitle}>Points d&apos;Attention</Text>
          <View style={s.sectionDivider} />
          <View style={s.bulletList}>
            {data.pointsAttention.map((p, i) => (
              <View key={i} style={s.bulletItem}>
                <View
                  style={[s.bulletDot, { backgroundColor: COLORS.warning }]}
                />
                <Text style={s.bulletText}>{p}</Text>
              </View>
            ))}
          </View>

          {/* Recommandations */}
          <Text style={s.sectionTitle}>Recommandations</Text>
          <View style={s.sectionDivider} />
          <View style={s.bulletList}>
            {data.recommandations.map((r, i) => (
              <View key={i} style={s.bulletItem}>
                <View
                  style={[s.bulletDot, { backgroundColor: COLORS.accent }]}
                />
                <Text style={s.bulletText}>{r}</Text>
              </View>
            ))}
          </View>
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
