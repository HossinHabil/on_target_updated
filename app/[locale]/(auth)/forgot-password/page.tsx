"use client";

import { Link } from "@/i18n/routing";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  return (
    <main className="flex flex-col h-screen items-center justify-center p-5">
      <div className="flex flex-col justify-center items-center space-y-5 p-5 h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl bg-card shadow-2xl">
        <h2 className="text-xl md:text-3xl font-semibold">
          Forgot Your Password, it is ok
        </h2>
        <p className="text-base md:text-lg">
          In order to get instructions to reset your password, please enter your
          email address associated with your account
        </p>

        <ForgotPasswordForm />

        <Button asChild>
          <Link href="/login" className="block text-center">
            Back to Login
          </Link>
        </Button>
      </div>
    </main>
  );
}
