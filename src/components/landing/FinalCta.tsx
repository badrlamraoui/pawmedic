"use client";

import WaitlistForm from "./WaitlistForm";

interface FinalCtaProps {
  title: string;
  subtitle: string;
  placeholder: string;
  button: string;
  success: string;
  alreadyRegistered: string;
  locale: string;
}

export default function FinalCta({
  title,
  subtitle,
  placeholder,
  button,
  success,
  alreadyRegistered,
  locale,
}: FinalCtaProps) {
  return (
    <section className="py-20 px-5 bg-ink">
      <div className="max-w-2xl mx-auto text-center">
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-white leading-tight">
            {title}
          </h2>
          <p className="text-base text-white/60 leading-relaxed">{subtitle}</p>
          <WaitlistForm
            placeholder={placeholder}
            buttonText={button}
            successText={success}
            alreadyRegisteredText={alreadyRegistered}
            locale={locale}
            dark
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
