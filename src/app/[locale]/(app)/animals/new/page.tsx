"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function NewAnimalPage() {
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
    color: "",
    microchipId: "",
    vetName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.species) return;

    setLoading(true);
    try {
      const body = {
        ...form,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
        birthDate: form.birthDate || null,
        sex: form.sex || null,
        breed: form.breed || null,
        color: form.color || null,
        microchipId: form.microchipId || null,
        vetName: form.vetName || null,
      };

      const res = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Animal créé avec succès");
      router.push(`/${locale}`);
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
    <div className="px-5 py-8 max-w-lg mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t("common.back")}
        </button>
        <h1 className="text-2xl font-serif text-ink">{t("animals.addNew")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-cyan focus:border-transparent"
              placeholder="Milo"
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

          {/* Breed */}
          <div>
            <label className="block text-xs font-mono text-muted uppercase tracking-wide mb-1.5">
              {t("animals.fields.breed")}
            </label>
            <input
              type="text"
              value={form.breed}
              onChange={(e) => field("breed", e.target.value)}
              className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-cyan focus:border-transparent"
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
              className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-cyan focus:border-transparent"
            />
          </div>

          {/* Sex */}
          <div>
            <label className="block text-xs font-mono text-muted uppercase tracking-wide mb-1.5">
              {t("animals.fields.sex")}
            </label>
            <div className="flex gap-2">
              {(["MALE", "FEMALE"] as const).map((sx) => (
                <button
                  key={sx}
                  type="button"
                  onClick={() => field("sex", form.sex === sx ? "" : sx)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm transition-colors ${
                    form.sex === sx
                      ? "border-cyan bg-cyan-light text-cyan font-medium"
                      : "border-border bg-white text-muted"
                  }`}
                >
                  {t(`animals.sex.${sx}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Sterilized */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.sterilized}
              onChange={(e) => field("sterilized", e.target.checked)}
              className="w-4 h-4 accent-cyan rounded"
            />
            <span className="text-sm text-ink">{t("animals.fields.sterilized")}</span>
          </label>

          {/* Weight */}
          <div>
            <label className="block text-xs font-mono text-muted uppercase tracking-wide mb-1.5">
              {t("animals.fields.weight")}
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={form.weightKg}
              onChange={(e) => field("weightKg", e.target.value)}
              className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-cyan focus:border-transparent"
            />
          </div>

          {/* Vet */}
          <div>
            <label className="block text-xs font-mono text-muted uppercase tracking-wide mb-1.5">
              {t("animals.fields.vet")}
            </label>
            <input
              type="text"
              value={form.vetName}
              onChange={(e) => field("vetName", e.target.value)}
              className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-cyan focus:border-transparent"
            />
          </div>
        </Card>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={!form.name}
        >
          Créer le profil
        </Button>
      </form>
    </div>
  );
}
