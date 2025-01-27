"use client";

import PaymentMethodsSkeletonCards from "@/components/sharing/skeleton/PaymentMethodsSkeletonCards";
import { useFetchPaymentMethods } from "./mutations";
import PaymentMethodsCard from "./PaymentMethodsCard";
import PaymentMethodDialog from "./PaymentMethodDialog";
import { CirclePlus, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ManagePaymentMethods from "./ManagePaymentMethods";

type PaymentMethodsRooms = "manage" | "home";

export default function PaymentMethodNames() {
  const { data, status } = useFetchPaymentMethods();
  const [room, setRoom] = useState<PaymentMethodsRooms>("home");
  const [isOpen, setIsOpen] = useState(false);

  if (status === "error") {
    return (
      <h2 className="text-center text-muted-foreground">
        An error occurred while fetching payment methods
      </h2>
    );
  }

  if (status === "pending") {
    return <PaymentMethodsSkeletonCards />;
  }

  if (!data.data) {
    return (
      <div className="grid grid-cols-1 gap-8 my-8 w-full">
        <div className="flex items-center gap-8">
          <h2 className="text-center text-muted-foreground">
            No Payment Methods Found
          </h2>
          <Button
            className="w-fit"
            title="Add Payment Method"
            onClick={() => setIsOpen(true)}
          >
            <CirclePlus className="!h-5 !w-5 text-website_primary_color" />
          </Button>
        </div>
        <PaymentMethodDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 my-8 w-full max-w-[95%] mx-auto">
      <div className="flex justify-end items-center gap-8">
        <PaymentMethodDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        <Button
          className="w-fit"
          title="Add Payment Method"
          onClick={() => setIsOpen(true)}
        >
          <CirclePlus className="!h-5 !w-5 text-website_primary_color" />
        </Button>
        <Button
          className="w-fit"
          title="Manage Payment Methods"
          onClick={() => setRoom("manage")}
        >
          <Settings className="!h-5 !w-5" />
        </Button>
        <Button
          className="w-fit"
          title="Payment Method"
          onClick={() => setRoom("home")}
        >
          <Home className="!h-5 !w-5 text-website_primary_color" />
        </Button>
      </div>
      {room === "home" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8 w-full">
          {data.data.map((paymentMethod) => (
            <PaymentMethodsCard
              key={paymentMethod.id}
              paymentMethod={paymentMethod}
            />
          ))}
        </div>
      )}
      {room === "manage" && <ManagePaymentMethods />}
    </div>
  );
}
