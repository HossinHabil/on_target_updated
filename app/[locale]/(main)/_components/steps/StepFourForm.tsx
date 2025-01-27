"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormSchemaStepFour } from "@/lib/schema/MultiStepFormSchema";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { PaymentMethodsList } from "./StepFour";

interface StepFourFormProps {
  onSubmitHandler: (
    values: z.infer<typeof FormSchemaStepFour>
  ) => Promise<void>;
  form: UseFormReturn<
    {
      paymentMethodName: string;
    },
    any,
    undefined
  >;
  finalPaymentMethod:
    | {
        sub: string;
        name: string;
        id: string;
        image: string;
        content: string | null;
      }[]
    | PaymentMethodsList[];
}

export default function StepFourForm({
  onSubmitHandler,
  form,
  finalPaymentMethod,
}: StepFourFormProps) {
  return (
    <div className="max-w-[50rem] mx-auto flex flex-col gap-8">
      <FormField
        control={form.control}
        name="paymentMethodName"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={(newValue) => {
                  field.onChange(newValue);
                  onSubmitHandler({
                    ...form.getValues(),
                    paymentMethodName: newValue,
                  });
                }}
                className="grid md:grid-cols-2 lg:grid-cols-3"
              >
                {finalPaymentMethod.map((action) => (
                  <FormItem key={action.id} className="h-60 w-full">
                    <FormControl>
                      <RadioGroupItem
                        value={action.name}
                        className="peer sr-only"
                      ></RadioGroupItem>
                    </FormControl>
                    <FormMessage />
                    <FormLabel className="flex !justify-center text-2xl md:text-3xl font-semibold cursor-pointer !items-center gap-4 rounded-md border p-2 shadow-sm hover:border-ring peer-focus-visible:ring-1 peer-aria-checked:border-ring h-full lg:flex-col lg:items-start lg:justify-between lg:p-5">
                      <Image
                        src={action.image}
                        id={action.id as string}
                        alt={action.name}
                        width={200}
                        height={200}
                        className="cursor-pointer mx-auto my-4 h-full"
                      />
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
