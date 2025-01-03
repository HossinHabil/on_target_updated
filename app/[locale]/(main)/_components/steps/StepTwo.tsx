"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { FormSchemaStepTwo } from "@/lib/schema/MultiStepFormSchema";
import { paymentsActions } from "@/lib/data";
import LoadingButton from "@/components/sharing/LoadingButton";
import { decryptData, encryptData } from "@/lib/utils";
import { env } from "@/env";
import { useLocalStorage } from "usehooks-ts";
import { LOCAL_STORAGE_KEY } from "@/lib/utils";

export default function StepTwo() {
  const [isPending, startTransition] = useTransition();
  const [localStorageData, setLocalStorageData] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    ""
  );
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("fund");
  const t2 = useTranslations("pagination");

  const form = useForm<z.infer<typeof FormSchemaStepTwo>>({
    resolver: zodResolver(FormSchemaStepTwo),
    defaultValues: {
      transactionAction: "deposit",
    },
  });

  type FormSchemaStepTwoType = z.infer<typeof FormSchemaStepTwo>;

  const { setValue } = form;

  useEffect(() => {
    const decryptedData = decryptData(
      localStorageData,
      env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
    );
    if (decryptedData) {
      (Object.keys(decryptedData) as (keyof FormSchemaStepTwoType)[]).forEach(
        (key) => {
          setValue(key, decryptedData[key] as any);
        }
      );
    }
  }, [localStorageData, setValue]);

  const onSubmitHandler = (values: z.infer<typeof FormSchemaStepTwo>) => {
    startTransition(() => {
      const decryptedData = decryptData(
        localStorageData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );
      const collectedData = { ...decryptedData, ...values };
      const encryptedData = encryptData(
        collectedData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );
      setLocalStorageData(encryptedData);
      router.replace(`/steps/3`);
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 text-center w-full"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <div className="max-w-[50rem] mx-auto flex flex-col gap-8">
          <FormField
            control={form.control}
            name="transactionAction"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid lg:grid-cols-2"
                  >
                    {paymentsActions.map((action) => (
                      <FormItem key={action.id}>
                        <FormControl>
                          <RadioGroupItem
                            value={action.value}
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormMessage />
                        <FormLabel className="flex h-[80px] !justify-center text-2xl md:text-3xl font-semibold cursor-pointer !items-center gap-4 rounded-md border p-2 shadow-sm hover:border-ring peer-focus-visible:ring-1 peer-aria-checked:border-ring lg:h-full lg:flex-col lg:items-start lg:justify-between lg:p-5">
                          {action.value === "deposit"
                            ? t("deposit")
                            : t("withdrawal")}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full justify-between p-4 max-w-[50rem] mx-auto">
          <LoadingButton
            type="button"
            onClick={() => router.replace(`/steps/1`)}
          >
            {t2("back")}
          </LoadingButton>
          <LoadingButton loading={isPending} type="submit">
            {t2("next")}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
