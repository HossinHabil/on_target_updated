import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import loginImage from "@/public/auth/login-image.jpg";
import LoginForm from "./_components/LoginForm";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Page() {
  const session = await auth();
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="md:w-1/2 w-full space-y-10 overflow-auto p-10 sm:px-2 lg:p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
              Login to your account
            </h1>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Signup
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt="Login Image"
          className="hidden md:block w-1/2 object-cover"
        />
      </div>
    </main>
  );
}
