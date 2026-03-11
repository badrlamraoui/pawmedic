interface Step {
  title: string;
  desc: string;
}

interface HowItWorksProps {
  eyebrow: string;
  title: string;
  step1: Step;
  step2: Step;
  step3: Step;
}

function Step1Icon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
}

function Step2Icon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  );
}

function Step3Icon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const steps = [
  { icon: <Step1Icon />, num: "01" },
  { icon: <Step2Icon />, num: "02" },
  { icon: <Step3Icon />, num: "03" },
];

export default function HowItWorks({ eyebrow, title, step1, step2, step3 }: HowItWorksProps) {
  const stepsData = [step1, step2, step3];

  return (
    <section className="py-20 px-5 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-mono text-muted tracking-widest uppercase mb-3">{eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-ink">{title}</h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Dashed connector line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[calc(33%+24px)] right-[calc(33%+24px)] border-t-2 border-dashed border-border" />

          {stepsData.map((step, i) => (
            <div key={i} className="relative text-center">
              {/* Background number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[6rem] font-serif font-bold text-ink/[0.04] leading-none pointer-events-none select-none">
                {steps[i].num}
              </div>

              {/* Icon circle */}
              <div className="relative w-14 h-14 rounded-2xl bg-cyan-light text-cyan flex items-center justify-center mx-auto mb-5 shadow-sm">
                {steps[i].icon}
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cyan text-white rounded-full flex items-center justify-center text-xs font-mono font-bold">
                  {i + 1}
                </div>
              </div>

              <h3 className="text-base font-medium text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
