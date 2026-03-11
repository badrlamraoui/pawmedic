"use client";

import { useState } from "react";

interface WaitlistCTAProps {
  variant?: "inline" | "banner";
}

export default function WaitlistCTA({ variant = "inline" }: WaitlistCTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (variant === "banner") {
    return (
      <section className="my-10 rounded-2xl bg-[#f0fdfa] border border-[#0d9488]/20 px-6 py-8 text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#0d9488] mb-2">
          Newsletter santé animale
        </p>
        <h3 className="text-lg font-semibold text-ink mb-2">
          Recevez nos prochains guides vétérinaires
        </h3>
        <p className="text-sm text-muted mb-5 max-w-sm mx-auto">
          Un email par semaine, des conseils pratiques pour la santé de votre chien ou chat.
        </p>
        {status === "success" ? (
          <p className="text-sm font-medium text-[#0d9488]">
            ✓ Parfait ! Vous recevrez nos prochains guides.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              required
              className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-xl bg-[#0d9488] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b8076] transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "..." : "S'abonner"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-2 text-xs text-red-500">Une erreur est survenue. Réessayez.</p>
        )}
      </section>
    );
  }

  // inline variant
  return (
    <div className="my-6 flex flex-col gap-3 rounded-xl border border-border bg-white px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-ink">
          Recevoir nos guides vétérinaires par email
        </p>
        <p className="text-xs text-muted mt-0.5">
          Un email par semaine · Conseils pratiques · Gratuit
        </p>
      </div>
      {status === "success" ? (
        <p className="text-sm font-medium text-[#0d9488]">✓ Vous êtes inscrit !</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.fr"
            required
            className="flex-1 rounded-lg border border-border bg-[#fafafa] px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-[#0d9488] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b8076] transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "..." : "S'abonner"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-xs text-red-500">Une erreur est survenue. Réessayez.</p>
      )}
    </div>
  );
}
