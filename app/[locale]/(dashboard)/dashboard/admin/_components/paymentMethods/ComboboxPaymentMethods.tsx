"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaymentMethod } from "@prisma/client";
import {
  useFetchPaymentMethods,
  useUpdatePaymentMethodsUserList,
} from "./mutations";

interface ComboboxPaymentMethodsProps {
  paymentMethodsListUser: PaymentMethod[];
  userId: string;
}

export default function ComboboxPaymentMethods({
  paymentMethodsListUser,
  userId,
}: ComboboxPaymentMethodsProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [selectedMethods, setSelectedMethods] = React.useState<PaymentMethod[]>(
    paymentMethodsListUser
  );

  const { data, status, isPending } = useFetchPaymentMethods();
  const { mutate } = useUpdatePaymentMethodsUserList();

  if (status === "error") {
    return <h2>An error occurred while fetching payment methods</h2>;
  }

  if (status === "pending") {
    return <h2>Loading...</h2>;
  }

  if (!data.data) {
    return <h2>No Payment Methods Found</h2>;
  }

  const togglePaymentMethod = (paymentMethod: PaymentMethod) => {
    const isAlreadySelected = selectedMethods.some(
      (method) => method.id === paymentMethod.id
    );

    if (isAlreadySelected) {
      setSelectedMethods((prev) =>
        prev.filter((method) => method.id !== paymentMethod.id)
      );
      mutate({
        userId,
        selectedPaymentMethodId: paymentMethod.id,
        action: "disconnect",
      });
    } else {
      setSelectedMethods((prev) => [...prev, paymentMethod]);
      mutate({
        userId,
        selectedPaymentMethodId: paymentMethod.id,
        action: "connect",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data.data.find((paymentMethod) => paymentMethod.name === value)
                ?.name
            : "Select Payment Method..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 z-[60]">
        <Command>
          <CommandInput className="h-9" />
          <CommandList>
            <CommandEmpty>No paymentMethod found.</CommandEmpty>
            <CommandGroup>
              {data.data.map((paymentMethod) => (
                <CommandItem
                  key={paymentMethod.name}
                  value={paymentMethod.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={paymentMethod.id}
                      checked={selectedMethods.some(
                        (item) => item.id === paymentMethod.id
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePaymentMethod(paymentMethod);
                      }}
                    />
                    <Label htmlFor={paymentMethod.id}>
                      {paymentMethod.name}
                    </Label>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
