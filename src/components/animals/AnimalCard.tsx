import { Link } from "@/i18n/navigation";
import AnimalAvatar from "./AnimalAvatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatAge } from "@/lib/utils";
import type { AnimalWithHealth } from "@/types";

interface AnimalCardProps {
  animal: AnimalWithHealth;
  t: (key: string, values?: Record<string, unknown>) => string;
}

export default function AnimalCard({ animal, t }: AnimalCardProps) {
  const hasAlerts = animal.pendingReminders > 0;

  return (
    <Link href={`/animals/${animal.id}`}>
      <Card hover className="p-4">
        <div className="flex items-start gap-3">
          <AnimalAvatar
            species={animal.species}
            photoUrl={animal.photoUrl}
            name={animal.name}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-ink truncate">{animal.name}</h3>
              {hasAlerts ? (
                <Badge variant="warning">
                  {t("animals.health.alerts", { count: animal.pendingReminders })}
                </Badge>
              ) : (
                <Badge variant="success">{t("animals.health.good")}</Badge>
              )}
            </div>
            <p className="text-sm text-muted mt-0.5">
              {t(`animals.species.${animal.species}`)}
              {animal.breed && ` · ${animal.breed}`}
            </p>
            {animal.birthDate && (
              <p className="text-xs text-muted mt-1">
                {formatAge(animal.birthDate, t as (key: string, values?: Record<string, number>) => string)}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
