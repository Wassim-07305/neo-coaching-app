import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// ---------- Types ----------
export interface CertificateData {
  coacheeName: string;
  moduleTitle: string;
  completionDate: string;
}

// ---------- Colors ----------
const COLORS = {
  primary: "#0A1628",
  primaryMedium: "#1B2A4A",
  accent: "#D4A843",
  accentLight: "#E8D5A0",
  white: "#FFFFFF",
  lightGray: "#F9FAFB",
  gray: "#9CA3AF",
  darkGray: "#4B5563",
};

// ---------- Styles ----------
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: COLORS.white,
    position: "relative",
  },
  // Outer gold border
  outerBorder: {
    position: "absolute",
    top: 18,
    left: 18,
    right: 18,
    bottom: 18,
    borderWidth: 3,
    borderColor: COLORS.accent,
    borderRadius: 4,
  },
  // Inner gold border
  innerBorder: {
    position: "absolute",
    top: 26,
    left: 26,
    right: 26,
    bottom: 26,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
    borderRadius: 2,
  },
  // Content container
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 80,
    paddingVertical: 50,
  },
  // Decorative top line
  decorLineTop: {
    width: 120,
    height: 2,
    backgroundColor: COLORS.accent,
    marginBottom: 20,
  },
  // Logo
  logoText: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: COLORS.accent,
    letterSpacing: 4,
    marginBottom: 4,
  },
  logoSubtext: {
    fontSize: 9,
    color: COLORS.gray,
    letterSpacing: 2,
    marginBottom: 30,
  },
  // Title
  title: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
    letterSpacing: 6,
    marginBottom: 6,
  },
  titleUnderline: {
    width: 200,
    height: 2,
    backgroundColor: COLORS.accent,
    marginBottom: 30,
  },
  // Body text
  awardedTo: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 14,
    letterSpacing: 1,
  },
  coacheeName: {
    fontSize: 32,
    fontFamily: "Helvetica-BoldOblique",
    color: COLORS.primaryMedium,
    marginBottom: 14,
  },
  forText: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 14,
    letterSpacing: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: COLORS.accent,
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  completionDate: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 30,
  },
  // Divider
  divider: {
    width: 80,
    height: 1,
    backgroundColor: COLORS.accentLight,
    marginBottom: 24,
  },
  // Delivered by
  deliveredBy: {
    fontSize: 10,
    color: COLORS.darkGray,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  coachName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  coachTitle: {
    fontSize: 10,
    color: COLORS.accent,
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  // Signature area
  signatureArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 10,
    gap: 80,
  },
  signatureBlock: {
    alignItems: "center",
  },
  signatureLine: {
    width: 140,
    height: 1,
    backgroundColor: COLORS.primary,
    marginBottom: 6,
  },
  signatureLabel: {
    fontSize: 8,
    color: COLORS.gray,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Bottom branding
  bottomBrand: {
    position: "absolute",
    bottom: 36,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bottomText: {
    fontSize: 8,
    color: COLORS.gray,
    letterSpacing: 2,
  },
  // Corner decorations
  cornerTL: {
    position: "absolute",
    top: 34,
    left: 34,
    width: 30,
    height: 30,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLORS.accent,
  },
  cornerTR: {
    position: "absolute",
    top: 34,
    right: 34,
    width: 30,
    height: 30,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.accent,
  },
  cornerBL: {
    position: "absolute",
    bottom: 34,
    left: 34,
    width: 30,
    height: 30,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLORS.accent,
  },
  cornerBR: {
    position: "absolute",
    bottom: 34,
    right: 34,
    width: 30,
    height: 30,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.accent,
  },
});

// ---------- Component ----------
export function CertificatePDF({ data }: { data: CertificateData }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        {/* Decorative borders */}
        <View style={s.outerBorder} />
        <View style={s.innerBorder} />

        {/* Corner decorations */}
        <View style={s.cornerTL} />
        <View style={s.cornerTR} />
        <View style={s.cornerBL} />
        <View style={s.cornerBR} />

        {/* Main content */}
        <View style={s.content}>
          <View style={s.decorLineTop} />

          {/* Logo */}
          <Text style={s.logoText}>NEO-FORMATIONS</Text>
          <Text style={s.logoSubtext}>
            COACHING &amp; DEVELOPPEMENT PERSONNEL
          </Text>

          {/* Title */}
          <Text style={s.title}>CERTIFICAT</Text>
          <View style={s.titleUnderline} />

          {/* Body */}
          <Text style={s.awardedTo}>Ce certificat est decerne a</Text>
          <Text style={s.coacheeName}>{data.coacheeName}</Text>
          <Text style={s.forText}>
            pour avoir complete avec succes le module
          </Text>
          <Text style={s.moduleTitle}>{data.moduleTitle}</Text>
          <Text style={s.completionDate}>
            Date de completion : {data.completionDate}
          </Text>

          <View style={s.divider} />

          {/* Coach info */}
          <Text style={s.deliveredBy}>Delivre par</Text>
          <Text style={s.coachName}>Jean-Claude YEKPE</Text>
          <Text style={s.coachTitle}>
            Coach certifie - The John Maxwell Team
          </Text>

          {/* Signature */}
          <View style={s.signatureArea}>
            <View style={s.signatureBlock}>
              <View style={s.signatureLine} />
              <Text style={s.signatureLabel}>Signature</Text>
            </View>
            <View style={s.signatureBlock}>
              <View style={s.signatureLine} />
              <Text style={s.signatureLabel}>Date</Text>
            </View>
          </View>
        </View>

        {/* Bottom branding */}
        <View style={s.bottomBrand}>
          <Text style={s.bottomText}>NEO-FORMATIONS</Text>
        </View>
      </Page>
    </Document>
  );
}
