"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useDeletePaymentMethod } from "./mutations";
import { PaymentMethod } from "@prisma/client";

interface PaymentMethodsCardDropdownProps {
  paymentMethod: PaymentMethod;
  className?: string;
  setIsEditing: (isEditing: boolean) => void;
}

export default function PaymentMethodsCardDropdown({
  className,
  paymentMethod,
  setIsEditing,
}: PaymentMethodsCardDropdownProps) {
  const { mutate } = useDeletePaymentMethod();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="absolute top-2 right-2">
        <EllipsisVertical className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEditing(true)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => mutate({id: paymentMethod.id})}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
