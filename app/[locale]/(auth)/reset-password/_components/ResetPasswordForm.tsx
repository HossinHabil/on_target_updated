"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import LoadingButton from "@/components/sharing/LoadingButton";
import { PasswordField } from "@/components/sharing/PasswordField";
import {
    ResetPasswordSchemaType,
  ResetPasswordSchema,
} from "@/lib/schema/RegistrationFormSchema";
import { useRouter } from "@/i18n/routing";
import resetPassword from "../actions";

export default function ResetPasswordForm({id}: {id: string}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  });
  const onSubmitHandler = async (values: ResetPasswordSchemaType) => {
    startTransition(async () => {
      try {
        const data = await resetPassword(values, id);
        if (data.error) {
          toast({
            variant: "destructive",
            title: data.error,
          });
        }
        if (data.success) {
          toast({
            variant: "default",
            title: data.success,
          });
          router.replace(`/login`);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
        });
      }
    });
  };
  return (
    <Form {...form}>
      <form
        className="space-y-4 lg:relative p-8 max-w-[45rem] w-full mx-auto"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <div className="grid grid-cols-1 gap-4 mb-8">
        <PasswordField
            control={form.control}
            type="password"
            name="password"
            placeholder="Password"
            className="p-6 rounded-xl border-input bg-input"
          />
          <PasswordField
            control={form.control}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="p-6 rounded-xl border-input bg-input"
          />
        </div>
        <div className="flex justify-center">
          <LoadingButton
            loading={isPending}
            type="submit"
            className="max-w-96 w-full text-[24px] rounded-xl mx-auto p-6 font-semibold"
          >
            Confirm
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
