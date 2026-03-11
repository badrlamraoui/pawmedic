import { Link } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  return {
    title: "Politique de confidentialité — Pawmedic",
    robots: { index: false },
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="border-b border-border bg-white px-5 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href={`/${locale}`} className="text-muted hover:text-ink transition-colors text-sm">
            ← Retour
          </Link>
          <span className="text-muted text-sm">/</span>
          <span className="text-sm text-ink">Politique de confidentialité</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-12">
        <h1 className="font-serif text-3xl text-ink mb-2">Politique de confidentialité</h1>
        <p className="text-muted text-sm mb-10">Dernière mise à jour : mars 2025</p>

        <div className="space-y-10 text-ink/90 leading-relaxed">

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              1. Responsable du traitement
            </h2>
            <div className="bg-white border border-border rounded-2xl p-6 space-y-2 text-sm">
              <p><span className="font-medium">Responsable :</span> SYNTA LLC</p>
              <p><span className="font-medium">Service :</span> Pawmedic (pawmedic.app)</p>
              <p><span className="font-medium">Contact DPO :</span>{" "}
                <a href="mailto:privacy@pawmedic.app" className="text-cyan hover:underline">
                  privacy@pawmedic.app
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              2. Données collectées
            </h2>
            <p className="text-sm mb-4">Nous collectons les données suivantes :</p>
            <div className="space-y-3">
              {[
                {
                  title: "Données de compte",
                  desc: "Nom, adresse email, via Clerk (authentification sécurisée). Votre mot de passe n'est jamais stocké par Pawmedic.",
                },
                {
                  title: "Données de vos animaux",
                  desc: "Nom, espèce, race, date de naissance, poids, photos uploadées. Ces données sont nécessaires au fonctionnement du service.",
                },
                {
                  title: "Données de santé",
                  desc: "Symptômes décrits, résultats d'analyse IA, ordonnances scannées, événements de santé. Ces données sont considérées comme sensibles et traitées avec des mesures de sécurité renforcées.",
                },
                {
                  title: "Données de navigation",
                  desc: "Logs d'utilisation anonymisés à des fins de performance et de débogage. Aucun cookie publicitaire n'est utilisé.",
                },
                {
                  title: "Données de paiement",
                  desc: "Gérées exclusivement par LemonSqueezy. Pawmedic ne stocke jamais vos coordonnées bancaires.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-border rounded-xl p-4 text-sm">
                  <p className="font-medium text-ink mb-1">{item.title}</p>
                  <p className="text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              3. Finalités et bases légales
            </h2>
            <div className="bg-white border border-border rounded-2xl overflow-hidden text-sm">
              <table className="w-full">
                <thead className="bg-cream">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-ink">Finalité</th>
                    <th className="text-left px-4 py-3 font-medium text-ink">Base légale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Fournir le service Pawmedic", "Exécution du contrat (Art. 6.1.b RGPD)"],
                    ["Authentification et sécurité", "Intérêt légitime (Art. 6.1.f RGPD)"],
                    ["Envoi d'emails de rappel", "Consentement (Art. 6.1.a RGPD)"],
                    ["Analyse IA des symptômes", "Exécution du contrat + consentement explicite"],
                    ["Amélioration du service", "Intérêt légitime (données agrégées et anonymisées)"],
                    ["Obligations légales et comptables", "Obligation légale (Art. 6.1.c RGPD)"],
                  ].map(([fin, base]) => (
                    <tr key={fin}>
                      <td className="px-4 py-3 text-ink">{fin}</td>
                      <td className="px-4 py-3 text-muted">{base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              4. Sous-traitants et transferts hors UE
            </h2>
            <div className="bg-white border border-border rounded-2xl overflow-hidden text-sm">
              <table className="w-full">
                <thead className="bg-cream">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-ink">Service</th>
                    <th className="text-left px-4 py-3 font-medium text-ink">Usage</th>
                    <th className="text-left px-4 py-3 font-medium text-ink">Pays</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Clerk", "Authentification", "États-Unis (SCC)"],
                    ["Vercel", "Hébergement", "États-Unis (SCC)"],
                    ["Neon / PostgreSQL", "Base de données", "UE"],
                    ["Cloudflare R2", "Stockage fichiers", "UE / États-Unis (SCC)"],
                    ["Anthropic Claude", "Analyse IA", "États-Unis (SCC)"],
                    ["Resend", "Emails transactionnels", "États-Unis (SCC)"],
                    ["LemonSqueezy", "Paiements", "États-Unis (SCC)"],
                  ].map(([svc, usage, pays]) => (
                    <tr key={svc}>
                      <td className="px-4 py-3 font-medium text-ink">{svc}</td>
                      <td className="px-4 py-3 text-muted">{usage}</td>
                      <td className="px-4 py-3 text-muted">{pays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted mt-3">
              SCC = Clauses Contractuelles Standard de la Commission Européenne, garantissant un niveau de protection adéquat.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              5. Durée de conservation
            </h2>
            <div className="space-y-2 text-sm">
              {[
                ["Données de compte", "Durée de l'abonnement + 3 ans après la clôture du compte"],
                ["Données de santé animale", "Durée de l'abonnement + 5 ans (obligations légales)"],
                ["Logs techniques", "90 jours maximum"],
                ["Données de facturation", "10 ans (obligations comptables françaises)"],
              ].map(([type, duree]) => (
                <div key={type} className="bg-white border border-border rounded-xl p-4 flex justify-between gap-4">
                  <span className="font-medium">{type}</span>
                  <span className="text-muted text-right">{duree}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              6. Vos droits (RGPD)
            </h2>
            <p className="text-sm mb-4">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants :
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ["Droit d'accès", "Obtenir une copie de vos données"],
                ["Droit de rectification", "Corriger des données inexactes"],
                ["Droit à l'effacement", "Supprimer votre compte et vos données"],
                ["Droit à la portabilité", "Exporter vos données en JSON/CSV"],
                ["Droit d'opposition", "S'opposer au traitement pour intérêt légitime"],
                ["Droit de limitation", "Limiter le traitement en cas de litige"],
              ].map(([droit, desc]) => (
                <div key={droit} className="bg-white border border-border rounded-xl p-4">
                  <p className="font-medium text-ink mb-1">{droit}</p>
                  <p className="text-muted text-xs">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm mt-4">
              Pour exercer vos droits, contactez-nous à{" "}
              <a href="mailto:privacy@pawmedic.app" className="text-cyan hover:underline">
                privacy@pawmedic.app
              </a>
              . Nous répondons dans un délai maximum de 30 jours. Vous pouvez également introduire une réclamation auprès de la{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">
                CNIL
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              7. Sécurité
            </h2>
            <p className="text-sm">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement en transit (TLS 1.3), chiffrement au repos, contrôle d'accès strict, et audits de sécurité réguliers.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              8. Cookies
            </h2>
            <p className="text-sm">
              Pawmedic utilise uniquement des cookies strictement nécessaires au fonctionnement du service (session d'authentification). Nous n'utilisons pas de cookies publicitaires, de tracking tiers, ou d'outils d'analyse comportementale.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              9. Modifications
            </h2>
            <p className="text-sm">
              Nous nous réservons le droit de modifier cette politique à tout moment. En cas de modification substantielle, vous serez informé par email au moins 30 jours avant l'entrée en vigueur des changements.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
