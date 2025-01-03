"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSchemaStepThree } from "@/lib/schema/MultiStepFormSchema";
import { decryptData, encryptData, LOCAL_STORAGE_KEY } from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import LoadingButton from "@/components/sharing/LoadingButton";
import { useLocale, useTranslations } from "next-intl";
import { getLangDir } from "rtl-detect";
import { env } from "@/env";

export default function StepThree() {
  const [isPending, startTransition] = useTransition();
  const [localStorageData, setLocalStorageData] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    ""
  );
  const router = useRouter();
  const locale = useLocale();
  const direction = getLangDir(locale);
  const t = useTranslations("amount");
  const t2 = useTranslations("pagination");

  const form = useForm<z.infer<typeof FormSchemaStepThree>>({
    resolver: zodResolver(FormSchemaStepThree),
    defaultValues: {
      amount: 0,
    },
  });

  type FormSchemaStepThreeType = z.infer<typeof FormSchemaStepThree>;

  const { setValue } = form;

  useEffect(() => {
    const decryptedData = decryptData(
      localStorageData,
      env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
    );
    if (decryptedData) {
      (Object.keys(decryptedData) as (keyof FormSchemaStepThreeType)[]).forEach(
        (key) => {
          setValue(key, decryptedData[key] as any);
        }
      );
    }
  }, [localStorageData, setValue]);

  const onSubmitHandler = (values: z.infer<typeof FormSchemaStepThree>) => {
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
      router.replace(`/steps/4`);
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 text-center w-full"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <div className="grid grid-cols-1 items-center gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormControl>
                  <div className="relative">
                    <span
                      className={`absolute text-muted bg-slate-400 max-w-8 w-full max-h-8 h-full flex justify-center items-center rounded-full top-[10px] ${
                        direction === "ltr" ? "right-[15px]" : "left-[15px]"
                      }`}
                    >
                      E£
                    </span>
                    <Input
                      placeholder={t("enter_amount")}
                      {...field}
                      className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                        direction === "rtl" ? "text-right" : "text-left"
                      }`}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full justify-between p-4 max-w-[50rem] mx-auto">
          <LoadingButton
            type="button"
            onClick={() => router.replace(`/steps/2`)}
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
