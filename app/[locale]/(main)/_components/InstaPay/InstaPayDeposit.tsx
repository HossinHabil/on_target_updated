"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserName from "./Deposit/UserName";
import QrCode from "./Deposit/QrCode";

export default function InstaPayDeposit() {
  return (
    <Tabs defaultValue="qr_code" className="w-full">
      <TabsList className="w-full justify-evenly mb-8 bg-indigo">
        <TabsTrigger
          value="qr_code"
          className="bg-purple data-[state=active]:!bg-blush !text-white font-semibold"
        >
          QR Code
        </TabsTrigger>
        <TabsTrigger
          value="user_name"
          className="bg-purple data-[state=active]:!bg-blush !text-white font-semibold"
        >
          User Name
        </TabsTrigger>
      </TabsList>
      <TabsContent value="qr_code">
        <QrCode />
      </TabsContent>
      <TabsContent value="user_name" className="text-center">
        <UserName />
      </TabsContent>
    </Tabs>
  );
}
