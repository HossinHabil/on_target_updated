import { redirect } from "@/i18n/routing";

export default function Home() {
  return redirect({
    href: "/steps/1",
    locale: "en",
  });
}
