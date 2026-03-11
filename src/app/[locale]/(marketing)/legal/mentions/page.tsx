import { Link } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  return {
    title: "Mentions légales — Pawmedic",
    robots: { index: false },
  };
}

export default async function MentionsLegalesPage({ params }: PageProps) {
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
          <span className="text-sm text-ink">Mentions légales</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-12">
        <h1 className="font-serif text-3xl text-ink mb-2">Mentions légales</h1>
        <p className="text-muted text-sm mb-10">Dernière mise à jour : mars 2025</p>

        <div className="space-y-10 text-ink/90 leading-relaxed">

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              1. Éditeur du service
            </h2>
            <div className="bg-white border border-border rounded-2xl p-6 space-y-2 text-sm">
              <p><span className="font-medium">Société :</span> SYNTA LLC</p>
              <p><span className="font-medium">Forme juridique :</span> Limited Liability Company (LLC), constituée dans l'État du Delaware, États-Unis</p>
              <p><span className="font-medium">Service :</span> Pawmedic</p>
              <p><span className="font-medium">Site web :</span> pawmedic.app</p>
              <p><span className="font-medium">Contact :</span>{" "}
                <a href="mailto:legal@pawmedic.app" className="text-cyan hover:underline">
                  legal@pawmedic.app
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              2. Hébergement
            </h2>
            <div className="bg-white border border-border rounded-2xl p-6 space-y-2 text-sm">
              <p><span className="font-medium">Hébergeur :</span> Vercel Inc.</p>
              <p><span className="font-medium">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <p><span className="font-medium">Site :</span> vercel.com</p>
            </div>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              3. Nature du service
            </h2>
            <p className="text-sm">
              Pawmedic est une application d'aide à la décision en matière de santé animale, utilisant l'intelligence artificielle pour fournir des informations générales sur l'état de santé de vos animaux de compagnie.
            </p>
            <p className="text-sm mt-3">
              <strong>Avertissement important :</strong> Pawmedic ne se substitue en aucun cas à un avis vétérinaire professionnel. Les informations fournies par l'application sont à titre indicatif uniquement. En cas d'urgence ou de doute, consultez immédiatement un vétérinaire qualifié.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              4. Propriété intellectuelle
            </h2>
            <p className="text-sm">
              L'ensemble des contenus présents sur Pawmedic (textes, images, interface, code source, marques, logos) sont la propriété exclusive de SYNTA LLC ou de ses concédants de licence, et sont protégés par les lois applicables en matière de propriété intellectuelle.
            </p>
            <p className="text-sm mt-3">
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation préalable écrite de SYNTA LLC.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              5. Limitation de responsabilité
            </h2>
            <p className="text-sm">
              SYNTA LLC s'efforce de fournir des informations exactes et à jour, mais ne garantit pas l'exactitude, l'exhaustivité ou l'adéquation des informations fournies par l'IA. L'utilisation de Pawmedic se fait sous l'entière responsabilité de l'utilisateur.
            </p>
            <p className="text-sm mt-3">
              SYNTA LLC ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le service, ou de décisions prises sur la base des informations fournies.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              6. Droit applicable
            </h2>
            <p className="text-sm">
              Les présentes mentions légales sont régies par le droit français pour les utilisateurs établis en France et dans l'Union Européenne, conformément au règlement Rome I et aux directives européennes applicables. Pour les autres utilisateurs, le droit de l'État du Delaware, États-Unis, s'applique.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              7. Contact
            </h2>
            <p className="text-sm">
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à :{" "}
              <a href="mailto:legal@pawmedic.app" className="text-cyan hover:underline">
                legal@pawmedic.app
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
