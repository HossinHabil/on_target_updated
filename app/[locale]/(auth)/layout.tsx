import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) {
    redirect({
      href: "/dashboard",
      locale: "en"
    });
  }
  return <>{children}</>;
}
