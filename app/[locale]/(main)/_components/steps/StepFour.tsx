"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";

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
import { useToast } from "@/hooks/use-toast";

import { FormSchemaStepFour } from "@/lib/schema/MultiStepFormSchema";
import { paymentsMethods } from "@/lib/data";
import { clientDataHandler } from "../../actions/step-four/index";
import {
  decryptData,
  encryptData,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_TRANSACTION_KEY,
} from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import { useLocale, useTranslations } from "next-intl";
import { env } from "@/env";
import LoadingButton from "@/components/sharing/LoadingButton";

export default function StepFour() {
  const { toast } = useToast();
  const param = useSearchParams();
  const transactionId = param.get("id");
  const [localStorageData, setLocalStorageData, removeLocalStorageData] =
    useLocalStorage(
      transactionId ? LOCAL_STORAGE_TRANSACTION_KEY : LOCAL_STORAGE_KEY,
      ""
    );
  const router = useRouter();
  const locale = useLocale();
  const t2 = useTranslations("pagination");

  const form = useForm<z.infer<typeof FormSchemaStepFour>>({
    resolver: zodResolver(FormSchemaStepFour),
    defaultValues: {
      paymentMethodName: "",
    },
  });

  type FormSchemaStepFourType = z.infer<typeof FormSchemaStepFour>;

  const { setValue } = form;

  useEffect(() => {
    const decryptedData = decryptData(
      localStorageData,
      env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
    );
    if (decryptedData) {
      (Object.keys(decryptedData) as (keyof FormSchemaStepFourType)[]).forEach(
        (key) => {
          setValue(key, decryptedData[key] as any);
        }
      );
    }
  }, [localStorageData, setValue]);

  const onSubmitHandler = async (
    values: z.infer<typeof FormSchemaStepFour>
  ) => {
    if (transactionId) {
      const clientData = await clientDataHandler(transactionId);

      if (clientData?.status === 202) {
        toast({
          variant: "destructive",
          title: "Transaction code has been used",
        });
        return;
      }

      const collectedData = {
        ...clientData?.data,
        ...values,
        transactionAction: clientData?.data?.transactionAction,
        transactionCode: transactionId,
      };
      const encryptedData = encryptData(
        collectedData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );
      setLocalStorageData(encryptedData);

      router.replace(`/steps/5?id=${transactionId}`);
    }

    if (!transactionId) {
      const decryptedData = decryptData(
        localStorageData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );
      if (
        !values.paymentMethodName ||
        !decryptedData?.fullName ||
        !decryptedData.transactionAction
      ) {
        toast({
          variant: "destructive",
          title: "required step",
        });

        return;
      }
      const collectedData = { ...decryptedData, ...values };
      const encryptedData = encryptData(
        collectedData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );
      setLocalStorageData(encryptedData);
      router.replace(`/steps/5`);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4 text-center w-full">
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
                    {paymentsMethods.map((action) => {
                      return (
                        <FormItem key={action.id} className="h-60 w-full">
                          <FormControl>
                            <RadioGroupItem
                              value={action.value.paymentMethodName}
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
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full justify-between p-4 max-w-[50rem] mx-auto">
          {!transactionId && (
            <LoadingButton
              type="button"
              onClick={() => router.replace(`/steps/3`)}
            >
              {t2("back")}
            </LoadingButton>
          )}
        </div>
      </form>
    </Form>
  );
}
