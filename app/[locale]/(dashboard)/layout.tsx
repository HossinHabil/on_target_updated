import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";
import { SessionProvider } from "next-auth/react";
import Header from "./dashboard/_components/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();

  if (!session || !session.user) {
    redirect({
      href: "/login",
      locale: "en",
    });
  }
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col bg-secondary">
        <Header />
        <div className="flex grow gap-5 py-10">{children}</div>
      </div>
    </SessionProvider>
  );
}
