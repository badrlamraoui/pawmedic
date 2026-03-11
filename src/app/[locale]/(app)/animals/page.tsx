import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import AnimalCard from "@/components/animals/AnimalCard";
import Button from "@/components/ui/Button";
import { getDaysUntil } from "@/lib/utils";
import type { AnimalWithHealth } from "@/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AnimalsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const user = await getCurrentUser();

  if (!user) redirect(`/${locale}/sign-in`);

  const dbAnimals = await prisma.animal.findMany({
    where: { userId: user.id },
    include: {
      diagnoses: { orderBy: { createdAt: "desc" }, take: 1 },
      healthEvents: {
        where: {
          nextDue: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          reminderSent: false,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const animals: AnimalWithHealth[] = dbAnimals.map((a) => ({
    id: a.id,
    name: a.name,
    species: a.species,
    breed: a.breed,
    birthDate: a.birthDate,
    sex: a.sex,
    sterilized: a.sterilized,
    weightKg: a.weightKg,
    color: a.color,
    microchipId: a.microchipId,
    photoUrl: a.photoUrl,
    vetName: a.vetName,
    pendingReminders: a.healthEvents.filter(
      (e) => e.nextDue && getDaysUntil(e.nextDue) <= 30
    ).length,
    lastDiagnosis: a.diagnoses[0]?.createdAt || null,
  }));

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-ink">{t("animals.title")}</h1>
        <Link href="/animals/new">
          <Button variant="primary" size="sm">{t("animals.addNew")}</Button>
        </Link>
      </div>

      {animals.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-cyan-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="text-base font-medium text-ink mb-1">{t("animals.noAnimals")}</p>
          <p className="text-sm text-muted mb-6">{t("animals.noAnimalsSubtitle")}</p>
          <Link href="/animals/new">
            <Button variant="primary">{t("animals.addFirst")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} t={t as (key: string, values?: Record<string, unknown>) => string} />
          ))}
        </div>
      )}
    </div>
  );
}
