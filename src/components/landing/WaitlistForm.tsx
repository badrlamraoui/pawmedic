"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WaitlistFormProps {
  placeholder?: string;
  buttonText?: string;
  successText?: string;
  alreadyRegisteredText?: string;
  locale?: string;
  dark?: boolean;
  className?: string;
}

export default function WaitlistForm({
  placeholder = "votre@email.fr",
  buttonText = "Rejoindre la liste d'attente",
  successText = "Inscription confirmée. On vous contacte bientôt.",
  alreadyRegisteredText = "Cette adresse est déjà inscrite.",
  locale = "fr",
  dark = false,
  className,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      const data = await res.json();

      if (res.status === 409) {
        toast.info(alreadyRegisteredText);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        toast.error("Une erreur est survenue. Réessayez.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      toast.error("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-5 py-4",
              dark ? "bg-white/10 text-white" : "bg-cyan-light text-cyan"
            )}
          >
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", dark ? "bg-white/20" : "bg-cyan/10")}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium">{successText}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className={cn(
                "flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan transition-colors",
                dark
                  ? "bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:border-white/40"
                  : "bg-white text-ink placeholder:text-muted border border-border focus:border-cyan"
              )}
            />
            <button
              type="submit"
              disabled={loading || !email}
              className={cn(
                "px-5 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed",
                dark
                  ? "bg-cyan text-white hover:bg-cyan-dark"
                  : "bg-ink text-white hover:bg-ink/90"
              )}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {buttonText}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
