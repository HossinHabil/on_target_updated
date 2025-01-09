"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { MenuBarLinks } from "@/lib/data";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
  return (
    <div className={className}>
      {MenuBarLinks.map((item) => (
        <Button
          variant="outline"
          className="flex items-center justify-start gap-3"
          title={item.name}
          aria-label={item.name}
          asChild
          key={item.id}
        >
          <Link href={item.href}>
            <item.icon className="!h-5 !w-5" />
            <span className="hidden lg:inline">{item.name}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
