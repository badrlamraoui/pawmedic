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

interface WaitlistConfirmEmailProps {
  locale?: string;
}

const messages: Record<string, {
  preview: string;
  greeting: string;
  body: string;
  subtext: string;
  cta: string;
  footer: string;
}> = {
  fr: {
    preview: "Bienvenue sur Pawmedic — Vous êtes sur la liste !",
    greeting: "Bienvenue sur Pawmedic",
    body: "Votre inscription est confirmée. Vous faites partie des premiers à rejoindre la liste d'attente de Pawmedic — la santé de votre animal, enfin claire.",
    subtext: "Nous vous contacterons dès que l'accès bêta sera disponible. En attendant, dites à vos amis propriétaires d'animaux !",
    cta: "En savoir plus sur Pawmedic",
    footer: "© 2025 Pawmedic. Tous droits réservés.",
  },
  en: {
    preview: "Welcome to Pawmedic — You're on the list!",
    greeting: "Welcome to Pawmedic",
    body: "Your registration is confirmed. You're one of the first to join the Pawmedic waiting list — your pet's health, finally clear.",
    subtext: "We'll contact you as soon as beta access is available. In the meantime, spread the word to fellow pet owners!",
    cta: "Learn more about Pawmedic",
    footer: "© 2025 Pawmedic. All rights reserved.",
  },
};

export default function WaitlistConfirmEmail({ locale = "fr" }: WaitlistConfirmEmailProps) {
  const msg = messages[locale] || messages.fr;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.app";

  return (
    <Html>
      <Head />
      <Preview>{msg.preview}</Preview>
      <Body style={{ backgroundColor: "#fafaf8", fontFamily: "DM Sans, system-ui, sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>
          {/* Header */}
          <Section style={{ textAlign: "center" as const, marginBottom: 32 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}>
              <div style={{
                width: 32,
                height: 32,
                backgroundColor: "#0d9488",
                borderRadius: 8,
                display: "inline-block",
              }} />
              <Text style={{
                fontFamily: "monospace",
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a18",
                margin: 0,
                letterSpacing: "0.1em",
              }}>
                PAWMEDIC
              </Text>
            </div>
          </Section>

          {/* Card */}
          <Section style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e8e6e0",
            padding: "32px 32px",
          }}>
            {/* Success indicator */}
            <Section style={{ textAlign: "center" as const, marginBottom: 24 }}>
              <div style={{
                width: 48,
                height: 48,
                backgroundColor: "#f0fdfa",
                borderRadius: 12,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}>
                <Text style={{ fontSize: 24, margin: 0 }}>✓</Text>
              </div>
            </Section>

            <Heading style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#1a1a18",
              textAlign: "center" as const,
              margin: "0 0 16px",
            }}>
              {msg.greeting}
            </Heading>

            <Text style={{
              fontSize: 15,
              color: "#8a8778",
              lineHeight: 1.6,
              textAlign: "center" as const,
              margin: "0 0 16px",
            }}>
              {msg.body}
            </Text>

            <Text style={{
              fontSize: 14,
              color: "#8a8778",
              lineHeight: 1.6,
              textAlign: "center" as const,
              margin: "0 0 24px",
            }}>
              {msg.subtext}
            </Text>

            <Hr style={{ borderColor: "#e8e6e0", margin: "24px 0" }} />

            <Section style={{ textAlign: "center" as const }}>
              <Link
                href={appUrl}
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

          {/* Footer */}
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
