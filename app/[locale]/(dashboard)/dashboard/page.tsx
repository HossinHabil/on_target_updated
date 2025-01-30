import { auth } from "@/auth";
import ClientBar from "./_components/main/ClientBar";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="w-full md:w-11/12 mx-auto p-4">
      <h2 className="font-semibold text-3xl">
        Hello {session && session.user?.name} 👋
      </h2>
      <ClientBar />
    </div>
  );
}
