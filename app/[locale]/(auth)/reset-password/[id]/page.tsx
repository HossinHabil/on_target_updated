import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";
import { getUserById } from "@/utils/user";
import ResetPasswordForm from "../_components/ResetPasswordForm";

export default async function ResetPassword({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;

  const session = await auth();

  if (session?.user) {
    redirect({
      href: "/dashboard",
      locale: "en",
    });
  }

  const validId = await getUserById(id);

  if (!validId) {
    redirect({
      href: "/login",
      locale: "en",
    });
  }

  return (
    <main className="flex flex-col h-screen items-center justify-center p-5">
      <div className="flex flex-col justify-center items-center space-y-5 p-5 h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl bg-card shadow-2xl">
        <h2 className="text-lg md:text-3xl font-semibold">
          Reset Your Password
        </h2>
        <p className="text-base md:text-lg">
          Please enter your new password and confirm it
        </p>

        <ResetPasswordForm id={id} />
      </div>
    </main>
  );
}
