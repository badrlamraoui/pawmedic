"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { DiagnosisResult as DiagnosisResultType } from "@/types";
import UrgencyBadge from "./UrgencyBadge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface DiagnosisResultProps {
  result: DiagnosisResultType;
  onSave?: () => void;
  onNew?: () => void;
  saving?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DiagnosisResult({
  result,
  onSave,
  onNew,
  saving = false,
}: DiagnosisResultProps) {
  const t = useTranslations("diagnosis");

  const urgencyLabels: Record<string, string> = {
    CRITICAL: t("result.urgency.CRITICAL"),
    WITHIN_48H: t("result.urgency.WITHIN_48H"),
    LOW: t("result.urgency.LOW"),
    WATCH: t("result.urgency.WATCH"),
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Urgency Header */}
      <motion.div variants={itemVariants}>
        <Card className="p-5">
          <UrgencyBadge
            level={result.urgency_level}
            label={urgencyLabels[result.urgency_level]}
            size="lg"
          />
          <p className="mt-3 text-sm text-ink leading-relaxed">
            {result.urgency_reason}
          </p>
        </Card>
      </motion.div>

      {/* Hypotheses */}
      <motion.div variants={itemVariants}>
        <Card className="p-5">
          <h3 className="text-sm font-mono font-medium text-muted uppercase tracking-wide mb-3">
            {t("result.hypotheses")}
          </h3>
          <div className="space-y-3">
            {result.hypotheses.map((hypo, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-ink">{hypo.condition}</span>
                  <span className="text-xs font-mono text-muted">
                    {Math.round(hypo.probability * 100)}%
                  </span>
                </div>
                <div className="w-full bg-cream rounded-full h-1.5 mb-1">
                  <motion.div
                    className="bg-cyan h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${hypo.probability * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  />
                </div>
                <p className="text-xs text-muted leading-relaxed">{hypo.explanation}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Immediate Advice */}
      <motion.div variants={itemVariants}>
        <Card className="p-5">
          <h3 className="text-sm font-mono font-medium text-muted uppercase tracking-wide mb-3">
            {t("result.advice")}
          </h3>
          <ul className="space-y-2">
            {result.immediate_advice.map((advice, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink">
                <span className="mt-1 w-5 h-5 rounded-full bg-cyan-light text-cyan flex items-center justify-center text-xs font-mono font-medium shrink-0">
                  {i + 1}
                </span>
                {advice}
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* Watch For */}
      <motion.div variants={itemVariants}>
        <Card className="p-5 border-amber-100">
          <h3 className="text-sm font-mono font-medium text-amber-600 uppercase tracking-wide mb-3">
            {t("result.watchFor")}
          </h3>
          <ul className="space-y-2">
            {result.watch_for.map((sign, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                {sign}
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={itemVariants}>
        <p className="text-xs text-muted text-center px-2 leading-relaxed italic">
          {result.disclaimer}
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex gap-3">
        {onSave && (
          <Button
            variant="primary"
            fullWidth
            onClick={onSave}
            loading={saving}
          >
            {t("result.save")}
          </Button>
        )}
        {onNew && (
          <Button
            variant="outline"
            fullWidth
            onClick={onNew}
          >
            {t("result.newDiagnosis")}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
