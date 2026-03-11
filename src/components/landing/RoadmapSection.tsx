import { cn } from "@/lib/utils";

interface Milestone {
  label: string;
  features: string;
}

interface RoadmapSectionProps {
  eyebrow: string;
  title: string;
  m1: Milestone;
  m3: Milestone;
  m6: Milestone;
}

export default function RoadmapSection({ eyebrow, title, m1, m3, m6 }: RoadmapSectionProps) {
  const milestones = [
    { ...m1, current: true },
    { ...m3, current: false },
    { ...m6, current: false },
  ];

  return (
    <section className="py-20 px-5 bg-cream">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-mono text-muted tracking-widest uppercase mb-3">{eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-ink">{title}</h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-10">
            {milestones.map((milestone, i) => (
              <div key={i} className="relative pl-14">
                {/* Dot */}
                <div
                  className={cn(
                    "absolute left-[13px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    milestone.current
                      ? "bg-cyan border-cyan"
                      : "bg-white border-border"
                  )}
                >
                  {milestone.current && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <div className="flex flex-wrap items-start gap-3">
                  {/* Label */}
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-mono font-medium",
                      milestone.current
                        ? "bg-cyan text-white"
                        : "bg-cream text-muted border border-border"
                    )}
                  >
                    {milestone.label}
                  </span>
                </div>

                {/* Features */}
                <p className="mt-2 text-sm text-muted leading-relaxed">{milestone.features}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
