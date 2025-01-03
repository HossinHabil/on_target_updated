import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { i18n } from "@/i18n-config";

export const routing = defineRouting({
  locales: i18n.locales.map((l) => l.code),
  defaultLocale: "en",
  localePrefix: "never",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
