import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import UrgencyBadge from "@/components/diagnosis/UrgencyBadge";
import { formatDate, calculateAge } from "@/lib/utils";
import type { Locale } from "@/i18n/config";

type Props = { params: Promise<{ locale: Locale }> };

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const tAnimals = await getTranslations("animals");

  const clerkUser = await currentUser();
  if (!clerkUser) redirect(`/${locale}/sign-in`);

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/sign-in`);

  const animals = await prisma.animal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    take: 5,
  });

  const lastDiagnosis = animals.length > 0
    ? await prisma.diagnosis.findFirst({
        where: { animalId: { in: animals.map((a) => a.id) } },
        orderBy: { createdAt: "desc" },
      })
    : null;

  const pendingReminders = await prisma.healthEvent.findMany({
    where: {
      animalId: { in: animals.map((a) => a.id) },
      nextDue: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      reminderSent: false,
    },
    include: { animal: { select: { name: true } } },
    orderBy: { nextDue: "asc" },
    take: 3,
  });

  const firstName = clerkUser.firstName ?? "";

  return (
    <div className="min-h-screen bg-cream px-4 pt-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-mono text-muted uppercase tracking-widest mb-1">
          {t("greeting")}
        </p>
        <h1 className="text-2xl font-serif italic text-ink">
          {firstName || "toi"} 👋
        </h1>
      </div>

      {/* No animals empty state */}
      {animals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-cyan-light flex items-center justify-center mb-6">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5C8.5 5 5 8 5 12s3.5 7 7 7 7-3 7-7-3.5-7-7-7z" />
              <path d="M12 8v4l3 3" />
            </svg>
          </div>
          <h2 className="text-lg font-sans font-medium text-ink mb-2">
            {tAnimals("noAnimals")}
          </h2>
          <p className="text-sm text-muted mb-6 max-w-xs">
            {tAnimals("noAnimalsSubtitle")}
          </p>
          <Link
            href="/animals/new"
            className="bg-cyan text-white font-sans font-medium rounded-full px-6 py-3 text-sm hover:bg-cyan-dark transition-colors"
          >
            {tAnimals("addFirst")}
          </Link>
        </div>
      )}

      {animals.length > 0 && (
        <>
          {/* Animals scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-6 -mx-4 px-4 scrollbar-hide">
            {animals.map((animal) => {
              const age = animal.birthDate ? calculateAge(animal.birthDate) : null;
              return (
                <Link
                  key={animal.id}
                  href={`/animals/${animal.id}`}
                  className="flex-none flex flex-col items-center gap-1.5 bg-white rounded-2xl px-4 py-3 border border-border min-w-[80px] hover:border-cyan transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-light flex items-center justify-center">
                    {animal.species === "DOG" ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#0d9488">
                        <path d="M4.5 11C3.1 11 2 12.1 2 13.5S3.1 16 4.5 16H5c.6 1.2 1.8 2 3 2h8c1.2 0 2.4-.8 3-2h.5c1.4 0 2.5-1.1 2.5-2.5S20.9 11 19.5 11H19l-1-3H6l-1 3h-.5zM9 7c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v1H9V7z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#0d9488">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 6c.8 0 1.5.7 1.5 1.5S10.8 11 10 11s-1.5-.7-1.5-1.5S9.2 8 10 8zm4 0c.8 0 1.5.7 1.5 1.5S14.8 11 14 11s-1.5-.7-1.5-1.5S13.2 8 14 8zm-2 9c-2.2 0-4-1.3-4-3h8c0 1.7-1.8 3-4 3z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-sans font-medium text-ink truncate max-w-[70px]">
                    {animal.name}
                  </span>
                  {age && (
                    <span className="text-[10px] text-muted font-mono">
                      {age.years > 0 ? `${age.years} an${age.years > 1 ? "s" : ""}` : `${age.months} mois`}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/animals/new"
              className="flex-none flex flex-col items-center justify-center gap-1.5 bg-white rounded-2xl px-4 py-3 border border-dashed border-border min-w-[80px] hover:border-cyan transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8778" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="text-[10px] text-muted font-mono">Ajouter</span>
            </Link>
          </div>

          {/* Main CTA */}
          <Link
            href="/diagnose"
            className="block bg-cyan rounded-3xl p-6 mb-6 hover:bg-cyan-dark transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/70 mb-2">
                  {t("analyzeSubtitle")}
                </p>
                <h2 className="text-xl font-serif italic text-white font-medium">
                  {t("analyzeButton")}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M11 8v3l2 2M20 20l-2.5-2.5" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Pending reminders */}
          {pendingReminders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">
                {t("pending")}
              </h3>
              <div className="space-y-2">
                {pendingReminders.map((event) => {
                  const isOverdue = event.nextDue! < new Date();
                  const daysUntil = Math.ceil(
                    (event.nextDue!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl px-4 py-3 border border-border flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-sans font-medium text-ink">
                          {event.name}
                        </p>
                        <p className="text-xs text-muted">
                          {event.animal.name} · {formatDate(event.nextDue!, locale)}
                        </p>
                      </div>
                      <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                        isOverdue
                          ? "bg-red-50 text-red-600"
                          : daysUntil <= 3
                          ? "bg-amber-50 text-amber-700"
                          : "bg-cyan-light text-cyan"
                      }`}>
                        {isOverdue ? t("overdue") : `J+${daysUntil}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Last diagnosis */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">
              {t("lastAnalysis")}
            </h3>
            {lastDiagnosis ? (
              <div className="bg-white rounded-2xl px-4 py-4 border border-border">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <UrgencyBadge level={lastDiagnosis.urgencyLevel as import("@/types").UrgencyLevel} size="sm" />
                    <p className="text-sm font-sans font-medium text-ink mt-2 truncate">
                      {(lastDiagnosis.resultJson as any)?.hypotheses?.[0]?.name ?? "—"}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {formatDate(lastDiagnosis.createdAt, locale)}
                    </p>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8778" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl px-4 py-4 border border-border text-center">
                <p className="text-sm text-muted">{t("noLastAnalysis")}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
