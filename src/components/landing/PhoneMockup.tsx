export default function PhoneMockup() {
  return (
    <div
      className="relative mx-auto"
      style={{ maxWidth: 280, transform: "rotate(3deg)" }}
    >
      {/* Phone frame */}
      <div
        className="relative bg-ink rounded-[2.5rem] p-2 shadow-2xl"
        style={{ border: "2px solid #333" }}
      >
        {/* Screen */}
        <div className="bg-cream rounded-[2rem] overflow-hidden" style={{ minHeight: 520 }}>
          {/* Status bar */}
          <div className="bg-white px-6 pt-4 pb-2 flex items-center justify-between">
            <span className="text-xs font-mono text-ink">9:41</span>
            <div className="w-20 h-5 bg-ink rounded-full" />
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-ink rounded-sm opacity-70" />
              <div className="w-3 h-3 bg-ink rounded-sm opacity-50" />
            </div>
          </div>

          {/* App header */}
          <div className="bg-white px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-cyan rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <span className="font-mono text-sm font-medium text-ink">Pawmedic</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Greeting */}
            <div>
              <p className="text-xs text-muted font-mono">Bonjour Marie</p>
              <p className="text-sm font-medium text-ink mt-0.5">Comment va Milo ?</p>
            </div>

            {/* Diagnosis result card */}
            <div className="bg-white rounded-2xl border border-border p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-mono text-amber-600">Consulter sous 48h</span>
              </div>
              <p className="text-xs font-medium text-ink mb-1.5">Analyse de Milo — Yeux</p>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs text-muted">Conjonctivite</span>
                    <span className="text-xs font-mono text-muted">72%</span>
                  </div>
                  <div className="h-1 bg-cream rounded-full">
                    <div className="h-1 bg-cyan rounded-full" style={{ width: "72%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs text-muted">Allergie</span>
                    <span className="text-xs font-mono text-muted">18%</span>
                  </div>
                  <div className="h-1 bg-cream rounded-full">
                    <div className="h-1 bg-cyan rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Reminder card */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-800">Vaccin antirabique</p>
                  <p className="text-xs text-amber-600 mt-0.5">Milo · Dans 12 jours</p>
                </div>
              </div>
            </div>

            {/* Quick action */}
            <button className="w-full bg-cyan text-white rounded-2xl py-3 text-xs font-medium">
              Analyser un symptôme
            </button>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-1.5">
          <div className="w-12 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Decorative glow */}
      <div
        className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(13,148,136,0.15) 0%, transparent 70%)",
          transform: "scale(1.1)",
        }}
      />
    </div>
  );
}
