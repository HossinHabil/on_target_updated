import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Vodafone from "./Vodafone";

export const PhoneNumbers = () => {
  return (
    <Tabs defaultValue="users" className="flex flex-col items-center">
      <TabsList className="w-full md:w-[80%] mx-auto justify-around">
        <TabsTrigger value="vodafone">Vodafone</TabsTrigger>
        <TabsTrigger value="fawry">Fawry</TabsTrigger>
        <TabsTrigger value="fawryPay">Fawry Pay</TabsTrigger>
        <TabsTrigger value="orange">Orange</TabsTrigger>
      </TabsList>
      <TabsContent value="vodafone" className="w-full">
        <Vodafone />
      </TabsContent>
    </Tabs>
  );
};
