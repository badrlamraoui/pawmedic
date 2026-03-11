import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

interface SiteLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function SiteLayout({
  children,
  params,
}: SiteLayoutProps) {
  const { locale } = await params;

  return (
    <>
      <SiteHeader />
      <main className="pt-16 min-h-screen">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}
