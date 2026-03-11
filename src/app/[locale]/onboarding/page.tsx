"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function OnboardingPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    species: "DOG",
    breed: "",
    birthDate: "",
    sex: "",
    sterilized: false,
    weightKg: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    setLoading(true);
    try {
      const res = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
          birthDate: form.birthDate || null,
          sex: form.sex || null,
          breed: form.breed || null,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      router.push(`/${locale}/dashboard`);
    } catch {
      toast.error(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-cyan rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-ink">{t("onboarding.title")}</h1>
          <p className="text-sm text-muted mt-2">{t("onboarding.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="p-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wide mb-1.5">
                {t("animals.fields.name")} *
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => field("name", e.target.value)}
                className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-cyan"
                placeholder="Milo"
                autoFocus
              />
            </div>

            {/* Species */}
            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wide mb-1.5">
                {t("animals.fields.species")} *
              </label>
              <div className="flex gap-2">
                {(["DOG", "CAT"] as const).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => field("species", sp)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm transition-colors ${
                      form.species === sp
                        ? "border-cyan bg-cyan-light text-cyan font-medium"
                        : "border-border bg-white text-muted"
                    }`}
                  >
                    {t(`animals.species.${sp}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Breed (optional) */}
            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wide mb-1.5">
                {t("animals.fields.breed")}
              </label>
              <input
                type="text"
                value={form.breed}
                onChange={(e) => field("breed", e.target.value)}
                className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-cyan"
              />
            </div>

            {/* Birth date */}
            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wide mb-1.5">
                {t("animals.fields.birthDate")}
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => field("birthDate", e.target.value)}
                className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-cyan"
              />
            </div>
          </Card>

          <Button type="submit" variant="primary" fullWidth loading={loading} disabled={!form.name}>
            {t("onboarding.submit")}
          </Button>

          <button
            type="button"
            onClick={() => router.push(`/${locale}`)}
            className="w-full text-sm text-muted hover:text-ink transition-colors py-2"
          >
            {t("onboarding.skip")}
          </button>
        </form>
      </div>
    </div>
  );
}
