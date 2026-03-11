import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import AnimalAvatar from "@/components/animals/AnimalAvatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatDate, formatAge, getDaysUntil } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AnimalDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale });
  const user = await getCurrentUser();

  if (!user) redirect(`/${locale}/sign-in`);

  const animal = await prisma.animal.findUnique({
    where: { id },
    include: {
      diagnoses: { orderBy: { createdAt: "desc" }, take: 5 },
      healthEvents: { orderBy: { date: "desc" }, take: 5 },
    },
  });

  if (!animal || animal.userId !== user.id) notFound();

  const pendingReminders = animal.healthEvents.filter(
    (e) => e.nextDue && getDaysUntil(e.nextDue) <= 30
  );

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="px-5 py-6">
        <Link
          href="/animals"
          className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t("animals.title")}
        </Link>

        <div className="flex items-center gap-4">
          <AnimalAvatar
            species={animal.species}
            photoUrl={animal.photoUrl}
            name={animal.name}
            size="xl"
          />
          <div>
            <h1 className="text-2xl font-serif text-ink">{animal.name}</h1>
            <p className="text-sm text-muted">
              {t(`animals.species.${animal.species}`)}
              {animal.breed ? ` · ${animal.breed}` : ""}
            </p>
            {animal.birthDate && (
              <p className="text-sm text-muted mt-0.5">
                {formatAge(animal.birthDate, t as (key: string, values?: Record<string, number>) => string)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="px-5 pb-4">
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {animal.sex && (
              <div>
                <p className="text-xs font-mono text-muted">{t("animals.fields.sex")}</p>
                <p className="text-sm text-ink mt-0.5">{t(`animals.sex.${animal.sex}`)}</p>
              </div>
            )}
            {animal.weightKg && (
              <div>
                <p className="text-xs font-mono text-muted">{t("animals.fields.weight")}</p>
                <p className="text-sm text-ink mt-0.5">{animal.weightKg} kg</p>
              </div>
            )}
            {animal.sterilized && (
              <div>
                <p className="text-xs font-mono text-muted">{t("animals.fields.sterilized")}</p>
                <Badge variant="success">Oui</Badge>
              </div>
            )}
            {animal.vetName && (
              <div>
                <p className="text-xs font-mono text-muted">{t("animals.fields.vet")}</p>
                <p className="text-sm text-ink mt-0.5">{animal.vetName}</p>
              </div>
            )}
            {animal.microchipId && (
              <div className="col-span-2">
                <p className="text-xs font-mono text-muted">{t("animals.fields.microchip")}</p>
                <p className="text-sm text-ink font-mono mt-0.5">{animal.microchipId}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
        <Link href={`/diagnose?animalId=${animal.id}`}>
          <div className="flex items-center gap-2 p-3 bg-cyan text-white rounded-2xl text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            {t("home.analyzeButton")}
          </div>
        </Link>
        <Link href={`/carnet/${animal.id}`}>
          <div className="flex items-center gap-2 p-3 bg-white border border-border rounded-2xl text-sm font-medium text-ink">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            {t("carnet.title")}
          </div>
        </Link>
      </div>

      {/* Pending reminders */}
      {pendingReminders.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-xs font-mono text-muted uppercase tracking-wide mb-2">{t("home.pending")}</p>
          <div className="space-y-2">
            {pendingReminders.slice(0, 3).map((r) => (
              <Card key={r.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{r.name}</p>
                    <p className="text-xs text-muted">{r.nextDue ? formatDate(r.nextDue, locale) : ""}</p>
                  </div>
                  <Badge variant={r.nextDue && getDaysUntil(r.nextDue) < 0 ? "danger" : "warning"}>
                    {r.nextDue && getDaysUntil(r.nextDue) < 0 ? t("home.overdue") : t("home.pending")}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent diagnoses */}
      {animal.diagnoses.length > 0 && (
        <div className="px-5 pb-8">
          <p className="text-xs font-mono text-muted uppercase tracking-wide mb-2">{t("home.lastAnalysis")}</p>
          <div className="space-y-2">
            {animal.diagnoses.slice(0, 3).map((d) => (
              <Card key={d.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm text-ink truncate">{d.symptomsText.slice(0, 50)}...</p>
                    <p className="text-xs text-muted mt-0.5">{formatDate(d.createdAt, locale)}</p>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
