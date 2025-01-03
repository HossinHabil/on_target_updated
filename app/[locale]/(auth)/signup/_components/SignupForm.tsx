"use client";

import { useForm } from "react-hook-form";
import { InputField } from "@/components/sharing/InputField";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  signUpSchema,
  SignUpSchemaType,
} from "@/lib/schema/RegistrationFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { PasswordField } from "@/components/sharing/PasswordField";
import LoadingButton from "@/components/sharing/LoadingButton";
import { signUp } from "../action";
import { useRouter } from "@/i18n/routing";

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });
  const onSubmitHandler = async (values: SignUpSchemaType) => {
    startTransition(async () => {
      try {
        const result = await signUp(values);
        if ("error" in result) {
          toast({
            variant: "destructive",
            title: result.error,
          });
        } else if ("success" in result) {
          toast({
            variant: "default",
            title: result.success,
          });
          router.replace("/login");
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
          <InputField
            control={form.control}
            type="text"
            name="username"
            placeholder="Username"
            className="p-6 rounded-xl border-input bg-input"
          />
          <InputField
            control={form.control}
            type="email"
            name="email"
            placeholder="Email"
            className="p-6 rounded-xl border-input bg-input"
          />
          <PasswordField
            control={form.control}
            type="password"
            name="password"
            placeholder="Password"
            className="p-6 rounded-xl border-input bg-input"
          />
        </div>
        <div className="flex justify-center">
          <LoadingButton
            loading={isPending}
            type="submit"
            className="max-w-96 w-full text-[24px] rounded-xl mx-auto p-6 font-semibold"
          >
            Create Account
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
