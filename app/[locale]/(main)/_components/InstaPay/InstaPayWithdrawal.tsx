"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserCode from "./Withdrawal/UserCode";
import UserPhoneNumber from "./Withdrawal/UserPhoneNumber";

export default function InstaPayWithdrawal() {
  return (
    <Tabs defaultValue="user_phone_number" className="w-full">
      <TabsList className="w-full justify-evenly mb-8 bg-indigo">
        <TabsTrigger
          value="user_phone_number"
          className="bg-purple data-[state=active]:!bg-blush !text-white font-semibold"
        >
          User Phone Number
        </TabsTrigger>
        <TabsTrigger
          value="user_code"
          className="bg-purple data-[state=active]:!bg-blush !text-white font-semibold"
        >
          User Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="user_phone_number">
        <UserPhoneNumber />
      </TabsContent>
      <TabsContent value="user_code" className="text-center">
        <UserCode />
      </TabsContent>
    </Tabs>
  );
}
