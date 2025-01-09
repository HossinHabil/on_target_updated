"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-7xl h-svh space-y-5 px-5 py-10 text-center">
      <div className="w-full h-full max-w-5xl mx-auto flex flex-col justify-center space-y-8">
        <h1 className="text-3xl font-bold">Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Button asChild className="w-1/2 mx-auto">
          <Link href="/" className="font-semibold">
            Go Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
