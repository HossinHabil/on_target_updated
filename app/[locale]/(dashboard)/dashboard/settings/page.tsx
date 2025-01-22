import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import GenerateApi from "./_components/GenerateApi";

export default function Settings() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 p-4">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-evenly mb-8 bg-indigo" >
          <TabsTrigger
            value="profile"
            className="bg-purple data-[state=active]:!bg-blush !text-white font-semibold"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="bg-purple data-[state=active]:!bg-blush !text-white font-semibold"
          >
            Generate API Key
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <h2>Profile</h2>
        </TabsContent>
        <TabsContent value="api">
          <GenerateApi />
        </TabsContent>
      </Tabs>
    </div>
  );
}
