import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CarnetPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const user = await getCurrentUser();

  if (!user) redirect(`/${locale}/sign-in`);

  const animals = await prisma.animal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    take: 1,
  });

  if (animals.length > 0) {
    redirect(`/${locale}/carnet/${animals[0].id}`);
  }

  return (
    <div className="px-5 py-16 max-w-lg mx-auto text-center">
      <div className="w-14 h-14 bg-cyan-light rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <h1 className="text-xl font-serif text-ink mb-2">{t("carnet.title")}</h1>
      <p className="text-sm text-muted mb-6">{t("animals.noAnimals")}</p>
      <Link href="/animals/new">
        <Button variant="primary">{t("animals.addFirst")}</Button>
      </Link>
    </div>
  );
}
