import { Link } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  return {
    title: "Conditions Générales de Vente — Pawmedic",
    robots: { index: false },
  };
}

export default async function CGVPage({ params }: PageProps) {
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
          <span className="text-sm text-ink">Conditions Générales de Vente</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-12">
        <h1 className="font-serif text-3xl text-ink mb-2">Conditions Générales de Vente</h1>
        <p className="text-muted text-sm mb-10">Dernière mise à jour : mars 2025</p>

        <div className="space-y-10 text-ink/90 leading-relaxed">

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              1. Parties au contrat
            </h2>
            <div className="bg-white border border-border rounded-2xl p-6 space-y-2 text-sm">
              <p>
                <span className="font-medium">Vendeur :</span> SYNTA LLC, société à responsabilité limitée constituée dans l'État du Delaware (États-Unis), exploitant le service Pawmedic.
              </p>
              <p>
                <span className="font-medium">Acheteur / Utilisateur :</span> Toute personne physique majeure ou personne morale procédant à l'achat d'un abonnement Pawmedic.
              </p>
              <p>
                <span className="font-medium">Contact :</span>{" "}
                <a href="mailto:billing@pawmedic.app" className="text-cyan hover:underline">
                  billing@pawmedic.app
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              2. Objet et champ d'application
            </h2>
            <p className="text-sm">
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre SYNTA LLC et ses clients pour la souscription aux abonnements payants du service Pawmedic. Elles s'appliquent à tout achat effectué sur pawmedic.app.
            </p>
            <p className="text-sm mt-3">
              En procédant au paiement, l'Acheteur reconnaît avoir lu, compris et accepté sans réserve les présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              3. Description des offres
            </h2>
            <div className="space-y-3">
              {[
                {
                  name: "Pawmedic Gratuit",
                  price: "0 €/mois",
                  desc: "Accès limité : 1 animal, 3 analyses IA par mois, carnet de santé basique. Sans engagement, sans carte bancaire.",
                },
                {
                  name: "Pawmedic Premium",
                  price: "~4,99 €/mois",
                  desc: "Jusqu'à 3 animaux, analyses IA illimitées, ordonnances, rappels intelligents, export PDF du carnet de santé.",
                },
                {
                  name: "Pawmedic Famille",
                  price: "~7,99 €/mois",
                  desc: "Animaux illimités, toutes les fonctionnalités Premium, tableau de bord famille, priorité support.",
                },
              ].map((offer) => (
                <div key={offer.name} className="bg-white border border-border rounded-2xl p-5 text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-ink">{offer.name}</p>
                    <span className="font-mono text-xs bg-cream border border-border rounded-full px-3 py-1">{offer.price}</span>
                  </div>
                  <p className="text-muted">{offer.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">
              Les prix indiqués pour Premium et Famille sont indicatifs pour la phase bêta. Les tarifs définitifs seront communiqués avant toute facturation.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              4. Commande et souscription
            </h2>
            <p className="text-sm">
              La souscription à un abonnement payant s'effectue en ligne via l'interface de l'application. Le contrat est conclu dès la validation du paiement par notre prestataire LemonSqueezy. Un email de confirmation vous est adressé dans les minutes suivant la souscription.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              5. Prix et paiement
            </h2>
            <p className="text-sm">
              Tous les prix sont indiqués en euros TTC. Les abonnements sont facturés mensuellement ou annuellement selon l'option choisie. Le paiement est effectué via LemonSqueezy, qui accepte les principales cartes bancaires (Visa, Mastercard, American Express).
            </p>
            <p className="text-sm mt-3">
              Les abonnements se renouvellent automatiquement. Vous recevrez un email de rappel 7 jours avant chaque renouvellement.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              6. Droit de rétractation
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm">
              <p className="font-medium text-amber-800 mb-2">Droit de rétractation — 14 jours</p>
              <p className="text-amber-700">
                Conformément aux articles L. 221-18 et suivants du Code de la consommation, vous disposez d'un délai de <strong>14 jours calendaires</strong> à compter de la souscription pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
              </p>
              <p className="text-amber-700 mt-3">
                Pour exercer ce droit, contactez-nous à{" "}
                <a href="mailto:billing@pawmedic.app" className="underline">
                  billing@pawmedic.app
                </a>{" "}
                avec votre numéro de commande. Le remboursement sera effectué dans les 14 jours suivant votre demande.
              </p>
            </div>
            <p className="text-sm mt-3 text-muted">
              Note : Si vous avez demandé l'exécution immédiate du service et que vous l'avez pleinement utilisé, une retenue proportionnelle à l'utilisation peut s'appliquer.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              7. Résiliation
            </h2>
            <p className="text-sm">
              Vous pouvez résilier votre abonnement à tout moment depuis les paramètres de votre compte ou en nous contactant. La résiliation prend effet à la fin de la période en cours. Aucun remboursement au prorata n'est effectué au-delà du délai de rétractation.
            </p>
            <p className="text-sm mt-3">
              SYNTA LLC se réserve le droit de suspendre ou résilier un compte en cas de violation des Conditions d'Utilisation.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              8. Disponibilité du service
            </h2>
            <p className="text-sm">
              SYNTA LLC s'engage à maintenir le service disponible 24h/24, 7j/7, avec un objectif de disponibilité de 99,5%. Des interruptions pour maintenance seront communiquées à l'avance dans la mesure du possible.
            </p>
            <p className="text-sm mt-3">
              En cas d'interruption prolongée (supérieure à 24h consécutives), les utilisateurs concernés pourront prétendre à un avoir proportionnel à la durée d'indisponibilité.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              9. Limitation de responsabilité
            </h2>
            <p className="text-sm">
              Pawmedic est un outil d'aide à la décision et ne remplace pas une consultation vétérinaire. SYNTA LLC ne saurait être tenue responsable des décisions prises sur la base des informations fournies par le service. En toutes circonstances, la responsabilité de SYNTA LLC est limitée au montant des sommes versées par l'utilisateur au cours des 12 derniers mois.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              10. Loi applicable et règlement des litiges
            </h2>
            <p className="text-sm">
              Les présentes CGV sont soumises au droit français pour les consommateurs établis en France et dans l'Union Européenne.
            </p>
            <p className="text-sm mt-3">
              En cas de litige, vous pouvez recourir à une médiation conventionnelle auprès du{" "}
              <strong>Médiateur de la consommation</strong> compétent ou à tout autre mode alternatif de règlement des différends. Conformément au règlement UE n°524/2013, vous pouvez également utiliser la plateforme européenne de règlement en ligne des litiges :{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">
                ec.europa.eu/consumers/odr
              </a>
            </p>
            <p className="text-sm mt-3">
              À défaut de résolution amiable, le litige sera soumis aux tribunaux français compétents.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              11. Contact
            </h2>
            <p className="text-sm">
              Pour toute question relative aux présentes CGV ou à votre abonnement :{" "}
              <a href="mailto:billing@pawmedic.app" className="text-cyan hover:underline">
                billing@pawmedic.app
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
