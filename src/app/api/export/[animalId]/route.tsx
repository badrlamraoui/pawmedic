import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

interface Params {
  params: Promise<{ animalId: string }>;
}

// Register fonts
Font.register({
  family: "DM Sans",
  src: "https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHQ.woff2",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "DM Sans",
    fontSize: 10,
    color: "#1a1a18",
    backgroundColor: "#fafaf8",
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e6e0",
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0d9488",
    letterSpacing: 2,
  },
  animalName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a18",
    marginBottom: 4,
  },
  animalMeta: {
    fontSize: 9,
    color: "#8a8778",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#8a8778",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e6e0",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e8e6e0",
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1a1a18",
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 9,
    color: "#8a8778",
  },
  cardNotes: {
    fontSize: 9,
    color: "#1a1a18",
    marginTop: 4,
    fontStyle: "italic",
  },
  urgencyBadge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 8,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  urgencyCritical: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
  },
  urgencyWithin48h: {
    backgroundColor: "#fffbeb",
    color: "#b45309",
  },
  urgencyWatch: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
  },
  urgencyLow: {
    backgroundColor: "#f0fdf4",
    color: "#15803d",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e8e6e0",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "#8a8778",
  },
  emptyState: {
    padding: 16,
    textAlign: "center",
    color: "#8a8778",
    fontSize: 10,
  },
});

const urgencyLabel: Record<string, string> = {
  CRITICAL: "Consultation urgente",
  WITHIN_48H: "Consulter sous 48h",
  WATCH: "À surveiller",
  LOW: "Non urgent",
};

const getUrgencyStyle = (level: string) => {
  switch (level) {
    case "CRITICAL": return styles.urgencyCritical;
    case "WITHIN_48H": return styles.urgencyWithin48h;
    case "WATCH": return styles.urgencyWatch;
    default: return styles.urgencyLow;
  }
};

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

interface HealthEvent {
  id: string;
  type: string;
  name: string;
  date: Date;
  nextDue: Date | null;
  vetName: string | null;
  notes: string | null;
}

interface DiagnosisEntry {
  id: string;
  symptomsText: string;
  urgencyLevel: string;
  createdAt: Date;
  resultJson: unknown;
}

interface AnimalData {
  name: string;
  species: string;
  breed: string | null;
  birthDate: Date | null;
  weightKg: number | null;
  healthEvents: HealthEvent[];
  diagnoses: DiagnosisEntry[];
}

function CarnetPDF({ animal, exportDate }: { animal: AnimalData; exportDate: string }) {
  const vaccines = animal.healthEvents.filter((e) => e.type === "VACCINE");
  const treatments = animal.healthEvents.filter((e) =>
    ["TREATMENT", "DEWORMING", "ANTIPARASITIC"].includes(e.type)
  );
  const visits = animal.healthEvents.filter((e) => e.type === "VET_VISIT");

  return (
    <Document title={`Carnet de santé — ${animal.name}`} author="Pawmedic">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>PAWMEDIC</Text>
            <Text style={{ fontSize: 9, color: "#8a8778", marginTop: 2 }}>
              Carnet de santé numérique
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.animalName}>{animal.name}</Text>
            <Text style={styles.animalMeta}>
              {animal.species === "DOG" ? "Chien" : "Chat"}
              {animal.breed ? ` · ${animal.breed}` : ""}
              {animal.birthDate ? ` · né(e) le ${formatDate(animal.birthDate)}` : ""}
            </Text>
            {animal.weightKg && (
              <Text style={styles.animalMeta}>{animal.weightKg} kg</Text>
            )}
          </View>
        </View>

        {/* Vaccines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vaccinations</Text>
          {vaccines.length === 0 ? (
            <Text style={styles.emptyState}>Aucune vaccination enregistrée</Text>
          ) : (
            vaccines.map((v) => (
              <View key={v.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>{v.name}</Text>
                  <Text style={styles.cardMeta}>{formatDate(v.date)}</Text>
                </View>
                {v.nextDue && (
                  <Text style={styles.cardMeta}>Rappel : {formatDate(v.nextDue)}</Text>
                )}
                {v.vetName && (
                  <Text style={styles.cardMeta}>Dr {v.vetName}</Text>
                )}
                {v.notes && <Text style={styles.cardNotes}>{v.notes}</Text>}
              </View>
            ))
          )}
        </View>

        {/* Treatments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traitements & Antiparasitaires</Text>
          {treatments.length === 0 ? (
            <Text style={styles.emptyState}>Aucun traitement enregistré</Text>
          ) : (
            treatments.map((t) => (
              <View key={t.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>{t.name}</Text>
                  <Text style={styles.cardMeta}>{formatDate(t.date)}</Text>
                </View>
                {t.nextDue && (
                  <Text style={styles.cardMeta}>Prochain : {formatDate(t.nextDue)}</Text>
                )}
                {t.notes && <Text style={styles.cardNotes}>{t.notes}</Text>}
              </View>
            ))
          )}
        </View>

        {/* Vet visits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultations vétérinaires</Text>
          {visits.length === 0 ? (
            <Text style={styles.emptyState}>Aucune consultation enregistrée</Text>
          ) : (
            visits.map((v) => (
              <View key={v.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>{v.name}</Text>
                  <Text style={styles.cardMeta}>{formatDate(v.date)}</Text>
                </View>
                {v.vetName && (
                  <Text style={styles.cardMeta}>Dr {v.vetName}</Text>
                )}
                {v.notes && <Text style={styles.cardNotes}>{v.notes}</Text>}
              </View>
            ))
          )}
        </View>

        {/* AI Diagnoses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analyses IA</Text>
          {animal.diagnoses.length === 0 ? (
            <Text style={styles.emptyState}>Aucune analyse enregistrée</Text>
          ) : (
            animal.diagnoses.slice(0, 10).map((d) => (
              <View key={d.id} style={styles.card}>
                <View style={[styles.urgencyBadge, getUrgencyStyle(d.urgencyLevel)]}>
                  <Text>{urgencyLabel[d.urgencyLevel] ?? d.urgencyLevel}</Text>
                </View>
                <Text style={styles.cardMeta}>{formatDate(d.createdAt)}</Text>
                <Text style={{ fontSize: 9, color: "#1a1a18", marginTop: 4 }}>
                  {d.symptomsText.slice(0, 200)}
                  {d.symptomsText.length > 200 ? "…" : ""}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Pawmedic — {animal.name}</Text>
          <Text style={styles.footerText}>Exporté le {exportDate}</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { animalId } = await params;

    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      include: {
        healthEvents: { orderBy: { date: "desc" } },
        diagnoses: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!animal || animal.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const exportDate = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const buffer = await renderToBuffer(
      <CarnetPDF animal={animal} exportDate={exportDate} />
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="carnet-${animal.name.toLowerCase()}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[PDF Export]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
