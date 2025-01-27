"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { AddPaymentMethod } from "@/lib/schema/Dashboard";
import { InputField } from "@/components/sharing/InputField";
import { PaymentMethod } from "@prisma/client";

interface EditPaymentMethodFormProps {
    onSubmit: (values: z.infer<typeof AddPaymentMethod>) => void
    paymentMethod: PaymentMethod
}

export default function EditPaymentMethodForm({onSubmit, paymentMethod}: EditPaymentMethodFormProps) {
  const form = useForm<z.infer<typeof AddPaymentMethod>>({
    resolver: zodResolver(AddPaymentMethod),
    defaultValues: {
      name: paymentMethod.name || "",
      content: paymentMethod.content || "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values: z.infer<typeof AddPaymentMethod>) => onSubmit(values)
        )}
        className="space-y-8"
        id="Edit-payment-method-form"
      >
        <InputField
          control={form.control}
          type="text"
          name="name"
          placeholder="Payment Method Name"
          className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px]`}
        />
        <InputField
          control={form.control}
          type="text"
          name="content"
          placeholder="Description"
          className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px]`}
        />
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>
    </Form>
  );
}
