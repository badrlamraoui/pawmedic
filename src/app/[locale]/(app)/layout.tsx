import BottomNav from "@/components/layout/BottomNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
