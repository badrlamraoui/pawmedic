import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/auth";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { Link } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const user = await getCurrentUser();

  if (!user) redirect(`/${locale}/sign-in`);

  const planVariant = {
    FREE: "muted" as const,
    PREMIUM: "default" as const,
    FAMILLE: "success" as const,
  }[user.plan];

  const planLabel = {
    FREE: t("profile.planFree"),
    PREMIUM: t("profile.planPremium"),
    FAMILLE: t("profile.planFamille"),
  }[user.plan];

  return (
    <div className="px-5 py-8 max-w-lg mx-auto space-y-5">
      <h1 className="text-2xl font-serif text-ink">{t("profile.title")}</h1>

      {/* User info */}
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <UserButton />
          <div>
            <p className="text-sm font-medium text-ink">{user.email}</p>
          </div>
        </div>
      </Card>

      {/* Subscription */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-mono text-muted uppercase tracking-wide">{t("profile.plan")}</p>
          <Badge variant={planVariant}>{planLabel}</Badge>
        </div>

        {user.plan === "FREE" && (
          <div className="space-y-3">
            <div className="text-sm text-muted">
              <p>3 analyses IA / mois</p>
              <p>1 animal</p>
            </div>
            <Link href={`/api/checkout?plan=PREMIUM&locale=${locale}`}>
              <Button variant="primary" fullWidth>{t("profile.upgrade")}</Button>
            </Link>
          </div>
        )}

        {user.plan !== "FREE" && user.lsCurrentPeriodEnd && (
          <p className="text-xs text-muted">
            Renouvellement le {new Date(user.lsCurrentPeriodEnd).toLocaleDateString(locale)}
          </p>
        )}
      </Card>

      {/* Language */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-mono text-muted uppercase tracking-wide">{t("profile.language")}</p>
          <LanguageSwitcher />
        </div>
      </Card>

      {/* Legal links */}
      <Card className="p-5 space-y-3">
        <Link href="/legal/mentions" className="block text-sm text-ink hover:text-cyan transition-colors">
          {t("legal.mentions")}
        </Link>
        <div className="border-t border-border" />
        <Link href="/legal/privacy" className="block text-sm text-ink hover:text-cyan transition-colors">
          {t("legal.privacy")}
        </Link>
        <div className="border-t border-border" />
        <Link href="/legal/cgv" className="block text-sm text-ink hover:text-cyan transition-colors">
          {t("legal.cgv")}
        </Link>
      </Card>

      {/* Sign out */}
      <SignOutButton redirectUrl={`/${locale}`}>
        <Button variant="outline" fullWidth className="text-red-600 border-red-200 hover:bg-red-50">
          {t("profile.signOut")}
        </Button>
      </SignOutButton>
    </div>
  );
}
