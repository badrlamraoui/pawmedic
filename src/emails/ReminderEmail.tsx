import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components";

interface Reminder {
  name: string;
  type: string;
  dueDate: string;
  urgency: string;
}

interface ReminderEmailProps {
  userName: string;
  animalName: string;
  reminders: Reminder[];
}

const urgencyColors: Record<string, string> = {
  OVERDUE: "#dc2626",
  DUE_SOON: "#d97706",
  UPCOMING: "#0d9488",
};

const urgencyLabels: Record<string, string> = {
  OVERDUE: "Retard",
  DUE_SOON: "Bientôt",
  UPCOMING: "À venir",
};

export default function ReminderEmail({ userName, animalName, reminders }: ReminderEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.app";

  return (
    <Html>
      <Head />
      <Preview>{`Rappel Pawmedic — ${reminders.length} événement(s) à venir pour ${animalName}`}</Preview>
      <Body style={{ backgroundColor: "#fafaf8", fontFamily: "DM Sans, system-ui, sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>
          {/* Header */}
          <Section style={{ textAlign: "center" as const, marginBottom: 32 }}>
            <Text style={{
              fontFamily: "monospace",
              fontSize: 14,
              fontWeight: 600,
              color: "#0d9488",
              margin: 0,
              letterSpacing: "0.1em",
            }}>
              PAWMEDIC
            </Text>
          </Section>

          {/* Card */}
          <Section style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e8e6e0",
            padding: "32px",
          }}>
            {/* Bell icon placeholder */}
            <Section style={{ textAlign: "center" as const, marginBottom: 20 }}>
              <div style={{
                width: 44,
                height: 44,
                backgroundColor: "#fef3c7",
                borderRadius: 12,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Text style={{ fontSize: 22, margin: 0 }}>🔔</Text>
              </div>
            </Section>

            <Heading style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#1a1a18",
              textAlign: "center" as const,
              margin: "0 0 8px",
            }}>
              Rappels pour {animalName}
            </Heading>

            <Text style={{
              fontSize: 14,
              color: "#8a8778",
              textAlign: "center" as const,
              margin: "0 0 24px",
            }}>
              Bonjour {userName}, voici vos rappels à venir.
            </Text>

            <Hr style={{ borderColor: "#e8e6e0", margin: "0 0 20px" }} />

            {/* Reminders list */}
            {reminders.map((reminder, i) => (
              <Section
                key={i}
                style={{
                  backgroundColor: "#fafaf8",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 10,
                  borderLeft: `3px solid ${urgencyColors[reminder.urgency] || "#0d9488"}`,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1a1a18",
                  margin: "0 0 4px",
                }}>
                  {reminder.name}
                </Text>
                <Text style={{ fontSize: 13, color: "#8a8778", margin: 0 }}>
                  {reminder.type} · {reminder.dueDate}
                  {" "}
                  <span style={{
                    display: "inline-block",
                    padding: "1px 6px",
                    borderRadius: 100,
                    backgroundColor: `${urgencyColors[reminder.urgency]}15`,
                    color: urgencyColors[reminder.urgency],
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    {urgencyLabels[reminder.urgency] || reminder.urgency}
                  </span>
                </Text>
              </Section>
            ))}

            <Hr style={{ borderColor: "#e8e6e0", margin: "20px 0" }} />

            <Section style={{ textAlign: "center" as const }}>
              <Link
                href={`${appUrl}/fr/carnet`}
                style={{
                  backgroundColor: "#0d9488",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Ouvrir le carnet de santé
              </Link>
            </Section>
          </Section>

          <Text style={{
            fontSize: 12,
            color: "#8a8778",
            textAlign: "center" as const,
            marginTop: 24,
          }}>
            © 2025 Pawmedic. Tous droits réservés.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
