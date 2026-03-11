import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate, getDaysUntil } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AlertsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const user = await getCurrentUser();

  if (!user) redirect(`/${locale}/sign-in`);

  const reminders = await prisma.healthEvent.findMany({
    where: {
      animal: { userId: user.id },
      nextDue: { not: null },
    },
    include: { animal: { select: { id: true, name: true, species: true } } },
    orderBy: { nextDue: "asc" },
  });

  type Reminder = (typeof reminders)[number];
  const pending = reminders.filter((r: Reminder) => r.nextDue && getDaysUntil(r.nextDue) <= 30);
  const upcoming = reminders.filter((r: Reminder) => r.nextDue && getDaysUntil(r.nextDue) > 30);

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-serif text-ink mb-6">{t("alerts.title")}</h1>

      {reminders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-cyan-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <p className="text-base font-medium text-ink mb-1">{t("alerts.noAlerts")}</p>
          <p className="text-sm text-muted">{t("alerts.noAlertsSubtitle")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <p className="text-xs font-mono text-muted uppercase tracking-wide mb-3">{t("home.pending")}</p>
              <div className="space-y-2">
                {pending.map((r: Reminder) => {
                  const daysUntil = r.nextDue ? getDaysUntil(r.nextDue) : null;
                  return (
                    <Link key={r.id} href={`/carnet/${r.animal.id}`}>
                      <Card hover className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${daysUntil !== null && daysUntil < 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink">{r.name}</p>
                            <p className="text-xs text-muted">
                              {r.animal.name} · {r.nextDue ? formatDate(r.nextDue, locale) : ""}
                            </p>
                          </div>
                          <Badge variant={daysUntil !== null && daysUntil < 0 ? "danger" : "warning"}>
                            {daysUntil !== null && daysUntil < 0
                              ? t("home.overdue")
                              : daysUntil !== null
                              ? t("home.daysLeft", { days: daysUntil })
                              : ""}
                          </Badge>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section>
              <p className="text-xs font-mono text-muted uppercase tracking-wide mb-3">À venir</p>
              <div className="space-y-2">
                {upcoming.slice(0, 5).map((r: Reminder) => {
                  const daysUntil = r.nextDue ? getDaysUntil(r.nextDue) : null;
                  return (
                    <Link key={r.id} href={`/carnet/${r.animal.id}`}>
                      <Card hover className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-cyan-light text-cyan flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink">{r.name}</p>
                            <p className="text-xs text-muted">
                              {r.animal.name} · {r.nextDue ? formatDate(r.nextDue, locale) : ""}
                            </p>
                          </div>
                          {daysUntil !== null && (
                            <span className="text-xs font-mono text-muted">Dans {daysUntil}j</span>
                          )}
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
