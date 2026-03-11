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

interface WelcomeEmailProps {
  animalName: string;
  locale?: string;
}

const messages: Record<string, {
  preview: (name: string) => string;
  greeting: string;
  body: (name: string) => string;
  features: string[];
  cta: string;
  footer: string;
}> = {
  fr: {
    preview: (name) => `Bienvenue sur Pawmedic — Le profil de ${name} est créé !`,
    greeting: "Bienvenue sur Pawmedic",
    body: (name) => `Le profil de ${name} a été créé avec succès. Vous pouvez maintenant analyser des symptômes, gérer le carnet de santé et configurer des rappels.`,
    features: [
      "Analysez les symptômes en moins de 30 secondes",
      "Suivez les vaccins et traitements",
      "Configurez des rappels automatiques",
    ],
    cta: "Accéder à l'application",
    footer: "© 2025 Pawmedic. Tous droits réservés.",
  },
  en: {
    preview: (name) => `Welcome to Pawmedic — ${name}'s profile is ready!`,
    greeting: "Welcome to Pawmedic",
    body: (name) => `${name}'s profile has been created. You can now analyse symptoms, manage the health record and set up reminders.`,
    features: [
      "Analyse symptoms in under 30 seconds",
      "Track vaccines and treatments",
      "Set up automatic reminders",
    ],
    cta: "Open the app",
    footer: "© 2025 Pawmedic. All rights reserved.",
  },
};

export default function WelcomeEmail({ animalName, locale = "fr" }: WelcomeEmailProps) {
  const msg = messages[locale] || messages.fr;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.app";

  return (
    <Html>
      <Head />
      <Preview>{msg.preview(animalName)}</Preview>
      <Body style={{ backgroundColor: "#fafaf8", fontFamily: "DM Sans, system-ui, sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>
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

          <Section style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e8e6e0",
            padding: "32px",
          }}>
            <Heading style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#1a1a18",
              textAlign: "center" as const,
              margin: "0 0 16px",
            }}>
              {msg.greeting}
            </Heading>

            <Text style={{ fontSize: 15, color: "#8a8778", lineHeight: 1.6, margin: "0 0 24px" }}>
              {msg.body(animalName)}
            </Text>

            <Section style={{
              backgroundColor: "#f0fdfa",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
            }}>
              {msg.features.map((feat, i) => (
                <Text key={i} style={{
                  fontSize: 14,
                  color: "#0f766e",
                  margin: "0 0 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  ✓ {feat}
                </Text>
              ))}
            </Section>

            <Hr style={{ borderColor: "#e8e6e0", margin: "24px 0" }} />

            <Section style={{ textAlign: "center" as const }}>
              <Link
                href={`${appUrl}/${locale}`}
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
                {msg.cta}
              </Link>
            </Section>
          </Section>

          <Text style={{
            fontSize: 12,
            color: "#8a8778",
            textAlign: "center" as const,
            marginTop: 24,
          }}>
            {msg.footer}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
