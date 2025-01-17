"use client";

import { useTransition } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { Locale, usePathname, useRouter, routing } from "@/i18n/routing";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LocaleSwitcherSelect() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const searchParam = useSearchParams();
  const transactionId = searchParam.get("id");
  const params = useParams();
  const routes = routing.locales;

  function onSelectChange(locale: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params, query: transactionId ? { id: transactionId } : {} },
        { locale }
      );
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-2xl px-2 py-2 ml-auto">
        <Languages size={35} className="text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {routes.map((locale) => {
          return (
            <DropdownMenuItem
              className="gap-4 cursor-pointer"
              key={locale}
              disabled={isPending}
              onClick={() => onSelectChange(locale)}
            >
              <Image
                src={`/main/flags/${locale}.svg`}
                alt={locale}
                width={30}
                height={30}
              />
              {locale === "ar" ? "العربية" : "English"}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
