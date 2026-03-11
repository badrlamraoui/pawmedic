import { cn, formatDate, getDaysUntil } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

type HealthEventType = "VACCINE" | "TREATMENT" | "VET_VISIT" | "DEWORMING" | "ANTIPARASITIC" | "OTHER";

interface HealthEvent {
  id: string;
  type: HealthEventType;
  name: string;
  date: Date;
  nextDue?: Date | null;
  vetName?: string | null;
  notes?: string | null;
}

interface HealthEventCardProps {
  event: HealthEvent;
  t: (key: string, values?: Record<string, unknown>) => string;
  locale?: string;
}

const typeIcons: Record<HealthEventType, React.ReactNode> = {
  VACCINE: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
  ),
  TREATMENT: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  ),
  VET_VISIT: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  DEWORMING: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  ANTIPARASITIC: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  OTHER: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  ),
};

function getStatus(nextDue?: Date | null): "upToDate" | "due" | "overdue" {
  if (!nextDue) return "upToDate";
  const daysUntil = getDaysUntil(nextDue);
  if (daysUntil < 0) return "overdue";
  if (daysUntil <= 30) return "due";
  return "upToDate";
}

const statusVariant: Record<string, "success" | "warning" | "danger"> = {
  upToDate: "success",
  due: "warning",
  overdue: "danger",
};

export default function HealthEventCard({ event, t, locale = "fr-FR" }: HealthEventCardProps) {
  const status = getStatus(event.nextDue);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-cyan-light text-cyan flex items-center justify-center shrink-0">
          {typeIcons[event.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-ink">{event.name}</h4>
            <Badge variant={statusVariant[status]}>
              {t(`carnet.status.${status}`)}
            </Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            {t(`carnet.eventTypes.${event.type}`)} · {formatDate(event.date, locale)}
          </p>
          {event.nextDue && (
            <p className="text-xs text-muted mt-0.5">
              {t("carnet.nextDue")}: {formatDate(event.nextDue, locale)}
            </p>
          )}
          {event.vetName && (
            <p className="text-xs text-muted mt-0.5">{event.vetName}</p>
          )}
          {event.notes && (
            <p className="text-xs text-muted mt-1 italic">{event.notes}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
