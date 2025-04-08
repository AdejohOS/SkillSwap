import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";

interface SiteLayoutProps {
  children: React.ReactNode;
}
const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <main className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </main>
  );
};

export default SiteLayout;
