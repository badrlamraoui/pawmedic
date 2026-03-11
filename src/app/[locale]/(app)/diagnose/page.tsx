"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SymptomForm from "@/components/diagnosis/SymptomForm";
import DiagnosisResult from "@/components/diagnosis/DiagnosisResult";
import type { DiagnosisResult as DiagnosisResultType, SymptomData } from "@/types";
import { toast } from "sonner";

type PageState = "select" | "form" | "analyzing" | "result";

export default function DiagnosePage() {
  const t = useTranslations();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;

  const [animals, setAnimals] = useState<Array<{ id: string; name: string; species: string; photoUrl?: string }>>([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>("");
  const [pageState, setPageState] = useState<PageState>("select");
  const [result, setResult] = useState<DiagnosisResultType | null>(null);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/animals")
      .then((r) => r.json())
      .then((data) => {
        setAnimals(data.animals || []);
        const animalParam = searchParams.get("animalId");
        if (animalParam) {
          setSelectedAnimalId(animalParam);
          setPageState("form");
        } else if (data.animals?.length === 1) {
          setSelectedAnimalId(data.animals[0].id);
          setPageState("form");
        }
      })
      .catch(() => toast.error(t("errors.generic")));
  }, []);

  const handleSubmit = async (data: SymptomData) => {
    setPageState("analyzing");

    try {
      const formData = new FormData();
      formData.append("animalId", data.animalId);
      formData.append("symptomsText", data.symptomsText);
      formData.append("bodyArea", data.bodyArea);
      formData.append("duration", data.duration);
      formData.append("intensity", data.intensity);
      formData.append("evolution", data.evolution);

      if (data.photos) {
        for (const photo of data.photos) {
          formData.append("photos", photo);
        }
      }

      const res = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
      });

      if (res.status === 429) {
        toast.error(t("diagnosis.limitReached"));
        setPageState("form");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed");
      }

      const json = await res.json();
      setResult(json.result);
      setDiagnosisId(json.diagnosisId);
      setPageState("result");
    } catch {
      toast.error(t("errors.generic"));
      setPageState("form");
    }
  };

  const handleSave = async () => {
    if (!diagnosisId) return;
    setSaving(true);
    toast.success("Analyse sauvegardée dans le carnet");
    setSaving(false);
  };

  const handleNew = () => {
    setResult(null);
    setDiagnosisId(null);
    setPageState("form");
  };

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-ink">{t("diagnosis.title")}</h1>
        <p className="text-sm text-muted mt-1">{t("diagnosis.subtitle")}</p>
      </div>

      <AnimatePresence mode="wait">
        {/* Animal selection */}
        {pageState === "select" && animals.length > 1 && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted">Pour quel animal ?</p>
            {animals.map((animal) => (
              <button
                key={animal.id}
                onClick={() => {
                  setSelectedAnimalId(animal.id);
                  setPageState("form");
                }}
                className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-border hover:border-cyan/40 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-light text-cyan flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{animal.name}</p>
                  <p className="text-xs text-muted">{animal.species}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* Form */}
        {pageState === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <SymptomForm
              onSubmit={handleSubmit}
              animalId={selectedAnimalId}
            />
          </motion.div>
        )}

        {/* Analyzing state */}
        {pageState === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <div className="w-14 h-14 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
            <p className="text-sm text-muted">{t("diagnosis.analyzing")}</p>
          </motion.div>
        )}

        {/* Result */}
        {pageState === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <DiagnosisResult
              result={result}
              onSave={handleSave}
              onNew={handleNew}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
