"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import PhotoUpload from "./PhotoUpload";
import type { SymptomData } from "@/types";

interface SymptomFormProps {
  onSubmit: (data: SymptomData) => void;
  animalId: string;
  loading?: boolean;
}

const BODY_AREAS = [
  "head", "eyes", "ears", "nose", "mouth",
  "skin", "paws", "abdomen", "back", "behavior", "other",
] as const;

const pageVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 60 : -60,
    opacity: 0,
  }),
};

export default function SymptomForm({ onSubmit, animalId, loading = false }: SymptomFormProps) {
  const t = useTranslations("diagnosis");
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [bodyArea, setBodyArea] = useState("");
  const [symptomsText, setSymptomsText] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [evolution, setEvolution] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    onSubmit({
      bodyArea,
      symptomsText,
      duration,
      intensity,
      evolution,
      photos,
      animalId,
    });
  };

  const canGoNext1 = !!bodyArea;
  const canGoNext2 = symptomsText.length >= 20;

  const sinceOptions: string[] = t.raw("step2.sinceOptions") as string[];
  const intensityOptions: string[] = t.raw("step2.intensityOptions") as string[];
  const evolutionOptions: string[] = t.raw("step2.evolutionOptions") as string[];

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-colors",
                step === s
                  ? "bg-cyan text-white"
                  : step > s
                  ? "bg-cyan-light text-cyan"
                  : "bg-cream text-muted border border-border"
              )}
            >
              {step > s ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s
              )}
            </div>
            {s < 3 && (
              <div className={cn("h-px w-8 transition-colors", step > s ? "bg-cyan" : "bg-border")} />
            )}
          </div>
        ))}
        <span className="ml-2 text-xs text-muted font-mono">
          {t("stepIndicator", { step })}
        </span>
      </div>

      {/* Step Content */}
      <div className="overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-lg font-medium text-ink">{t("step1.title")}</h2>
                <p className="text-sm text-muted mt-1">{t("step1.label")}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {BODY_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setBodyArea(area)}
                    className={cn(
                      "p-3 rounded-xl border text-sm text-center transition-colors",
                      bodyArea === area
                        ? "border-cyan bg-cyan-light text-cyan font-medium"
                        : "border-border bg-white text-ink hover:border-cyan/40 hover:bg-cream"
                    )}
                  >
                    {t(`step1.areas.${area}`)}
                  </button>
                ))}
              </div>
              <Button
                variant="primary"
                fullWidth
                disabled={!canGoNext1}
                onClick={goNext}
              >
                {t("../common.next")}
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-lg font-medium text-ink">{t("step2.title")}</h2>
              </div>

              <textarea
                value={symptomsText}
                onChange={(e) => setSymptomsText(e.target.value)}
                placeholder={t("step2.placeholder")}
                rows={4}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-cyan focus:border-transparent resize-none"
              />
              {symptomsText.length > 0 && symptomsText.length < 20 && (
                <p className="text-xs text-amber-600">
                  {20 - symptomsText.length} caractères manquants
                </p>
              )}

              {/* Duration chips */}
              <div>
                <p className="text-xs font-mono text-muted mb-2 uppercase tracking-wide">{t("step2.since")}</p>
                <div className="flex flex-wrap gap-2">
                  {sinceOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDuration(opt)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs border transition-colors",
                        duration === opt
                          ? "border-cyan bg-cyan-light text-cyan font-medium"
                          : "border-border bg-white text-muted hover:border-cyan/40"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity chips */}
              <div>
                <p className="text-xs font-mono text-muted mb-2 uppercase tracking-wide">{t("step2.intensity")}</p>
                <div className="flex flex-wrap gap-2">
                  {intensityOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setIntensity(opt)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs border transition-colors",
                        intensity === opt
                          ? "border-cyan bg-cyan-light text-cyan font-medium"
                          : "border-border bg-white text-muted hover:border-cyan/40"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evolution chips */}
              <div>
                <p className="text-xs font-mono text-muted mb-2 uppercase tracking-wide">{t("step2.evolution")}</p>
                <div className="flex flex-wrap gap-2">
                  {evolutionOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setEvolution(opt)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs border transition-colors",
                        evolution === opt
                          ? "border-cyan bg-cyan-light text-cyan font-medium"
                          : "border-border bg-white text-muted hover:border-cyan/40"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={goBack}>
                  {t("../common.back")}
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  disabled={!canGoNext2}
                  onClick={goNext}
                >
                  {t("../common.next")}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-lg font-medium text-ink">{t("step3.title")}</h2>
                <p className="text-sm text-muted mt-1">{t("step3.subtitle")}</p>
              </div>

              <PhotoUpload
                maxFiles={3}
                onFilesChange={setPhotos}
                dropzoneText={t("step3.dropzone")}
              />

              <div className="flex gap-3">
                <Button variant="outline" onClick={goBack}>
                  {t("../common.back")}
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSubmit}
                  loading={loading}
                >
                  {t("analyzeButton")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
