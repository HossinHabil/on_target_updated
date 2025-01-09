import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Users from "./_components/Users";
import Clients from "./_components/Clients";

export default async function Admin() {
  const session = await auth();

  if (session?.user.role !== "Admin") {
    return notFound();
  }
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Tabs
        defaultValue="users"
        className="w-full h-full flex flex-col items-center overflow-auto bg-card p-8 rounded-lg"
      >
        <TabsList className="w-full justify-around">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="phone_numbers">Phone Numbers</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="w-full">
          <Users />
        </TabsContent>
        <TabsContent value="clients" className="w-full">
          <Clients />
        </TabsContent>
      </Tabs>
    </div>
  );
}
