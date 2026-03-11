"use client";

import WaitlistForm from "@/components/landing/WaitlistForm";

export default function NewsletterSection() {
  return (
    <section className="py-16 px-5 bg-cream">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0d9488]/30 bg-[#f0fdfa] text-[#0d9488] text-xs font-mono font-medium tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] animate-pulse" />
          NEWSLETTER GRATUITE
        </span>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl font-serif italic text-ink leading-tight">
          Recevez nos meilleurs guides
          <br />
          chaque semaine.
        </h2>

        <p className="text-base text-muted leading-relaxed">
          Conseils pratiques, alertes santé et recommandations produits pour
          prendre soin de votre animal. Désinscription en un clic.
        </p>

        {/* Form */}
        <WaitlistForm
          placeholder="votre@email.fr"
          buttonText="S'abonner gratuitement"
          successText="Parfait ! Vous recevrez nos prochains guides."
          alreadyRegisteredText="Vous êtes déjà inscrit(e). À bientôt !"
          className="max-w-md mx-auto"
        />

        <p className="text-xs text-muted">
          Aucun spam. Désinscription possible à tout moment.
        </p>
      </div>
    </section>
  );
}
