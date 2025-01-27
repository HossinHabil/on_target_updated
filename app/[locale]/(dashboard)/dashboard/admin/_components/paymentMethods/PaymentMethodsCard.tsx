"use client";

import { PaymentMethod } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import PaymentMethodsCardDropdown from "./PaymentMethodsCardDropdown";
import EditPaymentMethod from "./EditPaymentMethod";
import { useState } from "react";

export default function PaymentMethodsCard({
  paymentMethod,
}: {
  paymentMethod: PaymentMethod;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="w-full h-60 relative">
      <CardHeader>
        <Image
          src={paymentMethod.image}
          alt={paymentMethod.sub}
          width={300}
          height={150}
          className="object-contain h-[150px] mx-auto"
        />
        <PaymentMethodsCardDropdown
          paymentMethod={paymentMethod}
          setIsEditing={setIsEditing}
        />
        <EditPaymentMethod isEditing={isEditing} setIsEditing={setIsEditing} paymentMethod={paymentMethod} />
      </CardHeader>
      <CardContent className="space-y-2 text-center">
        <CardTitle>{paymentMethod.name}</CardTitle>
        <CardDescription>{paymentMethod.content}</CardDescription>
      </CardContent>
    </Card>
  );
}
