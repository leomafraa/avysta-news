import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RequireAuth } from "@/components/RequireAuth";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </RequireAuth>
  );
}
