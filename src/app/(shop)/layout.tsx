import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MembersListBanner } from "@/components/layout/members-list";
import { SupportWidget } from "@/components/support/support-widget";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <MembersListBanner />
      <Footer />
      <SupportWidget />
    </>
  );
}
