"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputField } from "@/components/sharing/InputField";
import { FormSchemaStepOne } from "@/lib/schema/MultiStepFormSchema";
import { useForm } from "react-hook-form";
import { decryptData, encryptData, LOCAL_STORAGE_KEY } from "@/lib/utils";
import { env } from "@/env";
import { useLocale } from "next-intl";
import { getLangDir } from "rtl-detect";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingButton from "@/components/sharing/LoadingButton";
import { useLocalStorage } from "usehooks-ts";

export default function StepOne() {
  const [isPending, startTransition] = useTransition();
  const [localStorageData, setLocalStorageData] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    ""
  );
  const router = useRouter();
  const locale = useLocale();
  const direction = getLangDir(locale);
  const t = useTranslations("info");
  const t2 = useTranslations("pagination");

  const form = useForm<z.infer<typeof FormSchemaStepOne>>({
    resolver: zodResolver(FormSchemaStepOne),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      terms: false,
    },
  });

  type FormSchemaStepOneType = z.infer<typeof FormSchemaStepOne>;

  const { setValue } = form;

  useEffect(() => {
    const decryptedData = decryptData(
      localStorageData,
      env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
    );
    if (decryptedData) {
      (Object.keys(decryptedData) as (keyof FormSchemaStepOneType)[]).forEach(
        (key) => {
          setValue(key, decryptedData[key] as any);
        }
      );
    }
  }, [localStorageData, setValue]);

  const onSubmitHandler = (values: z.infer<typeof FormSchemaStepOne>) => {
    startTransition(() => {
      const encryptedData = encryptData(
        values,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );
      setLocalStorageData(encryptedData);
      router.replace(`/steps/2`);
    });
  };
  return (
    <div className="max-w-[50rem] mx-auto w-full flex flex-col gap-8">
      <h2
        className={`font-extrabold text-xl md:text-3xl ${
          direction === "rtl" ? "text-right" : "text-left"
        }`}
      >
        {t("header")}
      </h2>
      <Form {...form}>
        <form
          className="space-y-4 text-center w-full"
          onSubmit={form.handleSubmit(onSubmitHandler)}
        >
          <div className="grid grid-cols-1 items-center gap-8 mb-8">
            <InputField
              control={form.control}
              type="text"
              name="fullName"
              placeholder={t("full_name")}
              className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                direction === "rtl" ? "text-right" : "text-left"
              }`}
            />
            <InputField
              control={form.control}
              type="email"
              name="email"
              placeholder={t("email")}
              className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                direction === "rtl" ? "text-right" : ""
              }`}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormControl>
                    <PhoneInput
                      country={"eg"}
                      disableDropdown
                      onlyCountries={["eg"]}
                      value={field.value}
                      onChange={field.onChange}
                      inputClass={`border-input p-6 placeholder:text-muted-foreground text-primary !w-full !rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                        direction === "rtl" ? "text-right" : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem
                className={`${
                  direction === "rtl"
                    ? "text-right flex-row-reverse gap-2"
                    : "text-left"
                } flex items-baseline`}
              >
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-base text-primary ml-2">
                  {t("terms")}
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full py-4">
            <LoadingButton
              loading={isPending}
              className={`${direction === "rtl" ? "ml-auto" : "mr-auto"}`}
            >
              {t2("next")}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
