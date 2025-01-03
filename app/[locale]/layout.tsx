import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "../ReactQueryProvider";
import { getDirection } from "@/i18n-config";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: {
    template: "Form",
    default: "Form",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={getDirection(locale) === "rtl" ? "rtl" : "ltr"}>
      <body className="bg-background">
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
