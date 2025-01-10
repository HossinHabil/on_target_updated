"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { AddNewVodafoneNumber } from "@/lib/schema/Dashboard";
import { InputField } from "@/components/sharing/InputField";
import { AddNewNumberFormProps } from "@/lib/types";

export default function AddNewNumberForm({ onSubmit }: AddNewNumberFormProps) {
  const form = useForm<z.infer<typeof AddNewVodafoneNumber>>({
    resolver: zodResolver(AddNewVodafoneNumber),
    defaultValues: {
      userName: "",
      phoneNumber: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values: z.infer<typeof AddNewVodafoneNumber>) => onSubmit(values)
        )}
        className="space-y-8"
        id="add-number-form"
      >
        <InputField
          control={form.control}
          type="text"
          name="userName"
          placeholder="Enter The User Name"
          className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px]`}
        />
        <InputField
          control={form.control}
          type="text"
          name="phoneNumber"
          placeholder="Enter The User Name"
          className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px]`}
        />
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>
    </Form>
  );
}
