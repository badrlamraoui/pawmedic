"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import AnimalSwitcher from "@/components/animals/AnimalSwitcher";
import HealthEventCard from "@/components/carnet/HealthEventCard";
import VaccineCard from "@/components/carnet/VaccineCard";
import DiagnosisResult from "@/components/diagnosis/DiagnosisResult";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { DiagnosisResult as DiagnosisResultType } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "vaccines" | "treatments" | "visits" | "analyses";

interface HealthEvent {
  id: string;
  type: string;
  name: string;
  date: string;
  nextDue?: string | null;
  vetName?: string | null;
  notes?: string | null;
}

interface DiagnosisEntry {
  id: string;
  symptomsText: string;
  bodyArea?: string | null;
  urgencyLevel: string;
  resultJson: DiagnosisResultType;
  createdAt: string;
}

export default function CarnetAnimalPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const animalId = params.animalId as string;

  const [activeTab, setActiveTab] = useState<Tab>("vaccines");
  const [animals, setAnimals] = useState<Array<{ id: string; name: string; species: "DOG" | "CAT"; photoUrl?: string | null }>>([]);
  const [healthEvents, setHealthEvents] = useState<HealthEvent[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisResultType | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/animals").then((r) => r.json()),
      fetch(`/api/health-events/${animalId}`).then((r) => r.json()),
      fetch(`/api/diagnoses/${animalId}`).then((r) => r.json()),
    ]).then(([animalsData, eventsData, diagnosesData]) => {
      setAnimals(animalsData.animals || []);
      setHealthEvents(eventsData.events || []);
      setDiagnoses(diagnosesData.diagnoses || []);
      setLoading(false);
    });
  }, [animalId]);

  const vaccineEvents = healthEvents.filter((e) => e.type === "VACCINE");
  const treatmentEvents = healthEvents.filter((e) =>
    ["TREATMENT", "DEWORMING", "ANTIPARASITIC"].includes(e.type)
  );
  const visitEvents = healthEvents.filter((e) => e.type === "VET_VISIT");

  const tabs: { key: Tab; label: string }[] = [
    { key: "vaccines", label: t("carnet.tabs.vaccines") },
    { key: "treatments", label: t("carnet.tabs.treatments") },
    { key: "visits", label: t("carnet.tabs.visits") },
    { key: "analyses", label: t("carnet.tabs.analyses") },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin" />
      </div>
    );
  }

  const currentAnimal = animals.find((a) => a.id === animalId);

  if (selectedDiagnosis) {
    return (
      <div className="px-5 py-8 max-w-lg mx-auto">
        <button
          onClick={() => setSelectedDiagnosis(null)}
          className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t("common.back")}
        </button>
        <DiagnosisResult result={selectedDiagnosis} onNew={() => setSelectedDiagnosis(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-serif text-ink">{t("carnet.title")}</h1>
          <div className="flex items-center gap-3">
            <a
              href={`/api/export/${animalId}`}
              download
              className="flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
              title="Exporter en PDF"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              PDF
            </a>
            <Link href="/carnet/add" className="text-xs text-cyan">{t("carnet.addEvent")}</Link>
          </div>
        </div>

        {/* Animal switcher */}
        {animals.length > 1 && currentAnimal && (
          <AnimalSwitcher
            animals={animals as Array<{ id: string; name: string; species: "DOG" | "CAT"; photoUrl?: string | null }>}
            selectedId={animalId}
            onSelect={(id) => {
              window.location.href = `/${locale}/carnet/${id}`;
            }}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="px-5 border-b border-border">
        <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-3 py-3 text-xs font-mono whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-cyan text-cyan"
                  : "border-transparent text-muted hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 py-4 space-y-3">
        {activeTab === "vaccines" && (
          <>
            {vaccineEvents.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">{t("carnet.noEvents")}</p>
            ) : (
              vaccineEvents.map((e) => (
                <VaccineCard
                  key={e.id}
                  event={{
                    ...e,
                    date: new Date(e.date),
                    nextDue: e.nextDue ? new Date(e.nextDue) : null,
                  }}
                  t={t as (key: string, values?: Record<string, unknown>) => string}
                  locale={locale}
                />
              ))
            )}
          </>
        )}

        {activeTab === "treatments" && (
          <>
            {treatmentEvents.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">{t("carnet.noEvents")}</p>
            ) : (
              treatmentEvents.map((e) => (
                <HealthEventCard
                  key={e.id}
                  event={{
                    ...e,
                    type: e.type as any,
                    date: new Date(e.date),
                    nextDue: e.nextDue ? new Date(e.nextDue) : null,
                  }}
                  t={t as (key: string, values?: Record<string, unknown>) => string}
                  locale={locale}
                />
              ))
            )}
          </>
        )}

        {activeTab === "visits" && (
          <>
            {visitEvents.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">{t("carnet.noEvents")}</p>
            ) : (
              visitEvents.map((e) => (
                <HealthEventCard
                  key={e.id}
                  event={{
                    ...e,
                    type: e.type as any,
                    date: new Date(e.date),
                    nextDue: e.nextDue ? new Date(e.nextDue) : null,
                  }}
                  t={t as (key: string, values?: Record<string, unknown>) => string}
                  locale={locale}
                />
              ))
            )}
          </>
        )}

        {activeTab === "analyses" && (
          <>
            {diagnoses.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">{t("carnet.noEvents")}</p>
            ) : (
              diagnoses.map((d) => (
                <Card
                  key={d.id}
                  hover
                  className="p-4 cursor-pointer"
                  onClick={() => setSelectedDiagnosis(d.resultJson)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{d.symptomsText.slice(0, 60)}...</p>
                      <p className="text-xs text-muted mt-0.5">
                        {d.bodyArea && `${d.bodyArea} · `}
                        {formatDate(d.createdAt, locale)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        d.urgencyLevel === "CRITICAL"
                          ? "danger"
                          : d.urgencyLevel === "WITHIN_48H"
                          ? "warning"
                          : "success"
                      }
                    >
                      {d.urgencyLevel}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
