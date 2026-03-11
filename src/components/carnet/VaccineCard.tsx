import { formatDate, getDaysUntil } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface VaccineEvent {
  id: string;
  name: string;
  date: Date;
  nextDue?: Date | null;
  vetName?: string | null;
  notes?: string | null;
}

interface VaccineCardProps {
  event: VaccineEvent;
  t: (key: string, values?: Record<string, unknown>) => string;
  locale?: string;
}

export default function VaccineCard({ event, t, locale = "fr-FR" }: VaccineCardProps) {
  const daysUntil = event.nextDue ? getDaysUntil(event.nextDue) : null;

  let statusKey = "upToDate";
  let badgeVariant: "success" | "warning" | "danger" = "success";

  if (daysUntil !== null) {
    if (daysUntil < 0) {
      statusKey = "overdue";
      badgeVariant = "danger";
    } else if (daysUntil <= 30) {
      statusKey = "due";
      badgeVariant = "warning";
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        {/* Vaccine icon */}
        <div className="w-9 h-9 rounded-xl bg-cyan-light text-cyan flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-ink leading-tight">{event.name}</h4>
            <Badge variant={badgeVariant}>{t(`carnet.status.${statusKey}`)}</Badge>
          </div>

          <p className="text-xs text-muted mt-0.5">
            {t("carnet.lastDate")}: {formatDate(event.date, locale)}
          </p>

          {event.nextDue && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">
                  {t("carnet.nextDue")}: {formatDate(event.nextDue, locale)}
                </p>
                {daysUntil !== null && (
                  <span
                    className={cn(
                      "text-xs font-mono font-medium",
                      daysUntil < 0
                        ? "text-red-600"
                        : daysUntil <= 30
                        ? "text-amber-600"
                        : "text-emerald-600"
                    )}
                  >
                    {daysUntil < 0
                      ? `${Math.abs(daysUntil)}j de retard`
                      : daysUntil === 0
                      ? "Aujourd'hui"
                      : `Dans ${daysUntil}j`}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-1.5 w-full h-1 bg-cream rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    daysUntil !== null && daysUntil < 0
                      ? "bg-red-400 w-full"
                      : daysUntil !== null && daysUntil <= 30
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  )}
                  style={{
                    width:
                      daysUntil !== null && daysUntil >= 0
                        ? `${Math.min(100, Math.max(5, 100 - (daysUntil / 365) * 100))}%`
                        : "100%",
                  }}
                />
              </div>
            </div>
          )}

          {event.vetName && (
            <p className="text-xs text-muted mt-1">{event.vetName}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
