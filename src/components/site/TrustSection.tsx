const PILLARS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
    title: "Accessibles",
    desc: "Zéro jargon médical. Nos guides sont écrits en langage clair, pour que chaque propriétaire comprenne ce qui se passe avec son animal.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
      </svg>
    ),
    title: "Sourcés",
    desc: "Chaque article est basé sur des sources vétérinaires sérieuses. Nous rappelons systématiquement quand une consultation est nécessaire.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
    title: "À jour",
    desc: "Nos contenus sont régulièrement mis à jour pour refléter les dernières recommandations vétérinaires et les meilleures pratiques actuelles.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 px-5 bg-white">
      <div className="max-w-4xl mx-auto text-center">

        <p className="font-mono text-xs uppercase tracking-widest text-[#0d9488] mb-4">
          Notre engagement
        </p>

        <h2 className="text-3xl sm:text-4xl font-serif italic text-[#1a1a18] mb-14">
          Des guides en qui vous pouvez avoir confiance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {PILLARS.map((p) => (
            <div key={p.title} className="flex flex-col items-center text-center gap-5">
              {/* Icon in cyan circle */}
              <div className="w-14 h-14 rounded-full bg-[#f0fdfa] text-[#0d9488] flex items-center justify-center shrink-0">
                {p.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a18] mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-[#8a8778] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs text-[#8a8778]/70 italic">
          ⚕️ Nos guides sont informatifs et ne remplacent pas une consultation vétérinaire.
        </p>
      </div>
    </section>
  );
}
