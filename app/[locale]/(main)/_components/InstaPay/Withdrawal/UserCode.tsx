"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useFieldArray, useForm } from "react-hook-form";
import { getLangDir } from "rtl-detect";
import { CirclePlus } from "lucide-react";
import LoadingButton from "@/components/sharing/LoadingButton";
import {
  decryptData,
  delay,
  encryptData,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_TRANSACTION_KEY,
} from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import { useSearchParams } from "next/navigation";
import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import { LocalStorageData } from "@/lib/types";
import { useCreateUserCode, useUpdateUserCode } from "./mutations";

export default function UserCode() {
  const { toast } = useToast();
  const t2 = useTranslations("pagination");
  const router = useRouter();
  const locale = useLocale();
  const direction = getLangDir(locale);
  const param = useSearchParams();
  const transactionId = param.get("id");
  const [localStorageData, setLocalStorageData, removeLocalStorage] =
    useLocalStorage(
      transactionId ? LOCAL_STORAGE_TRANSACTION_KEY : LOCAL_STORAGE_KEY,
      ""
    );

  const form = useForm({
    defaultValues: {
      transfers: [{ userCode: "", amount: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "transfers",
  });

  const updateUserCodeMutation = useUpdateUserCode();
  const createUserCodeMutation = useCreateUserCode();

  const handleSubmit = (values: {
    transfers: { userCode: string; amount: string }[];
  }) => {
    try {
      if (!values.transfers[0].userCode || !values.transfers[0].amount) {
        toast({
          variant: "destructive",
          title: "Please fill in all the required filed",
        });
        return;
      }

      const decryptedData: LocalStorageData = decryptData(
        localStorageData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );

      if (transactionId) {
        // Update the existing Client
        updateUserCodeMutation.mutate(
          {
            decryptedData,
            values,
          },
          {
            onSuccess: async (data) => {
              await delay(1500);
              removeLocalStorage();
              router.push(data?.return_url || "/steps/1");
            },
          }
        );
      } else {
        // Create a new Client
        createUserCodeMutation.mutate(
          {
            decryptedData,
            values,
          },
          {
            onSuccess: async (data) => {
              await delay(1500);
              removeLocalStorage();
              router.replace("/steps/1");
            },
          }
        );
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
      });
    }
  };
  return (
    <div className="w-full">
      <Form {...form}>
        <form
          className="space-y-4 text-center w-full"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex flex-col gap-8 mb-8">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="shadow-md flex flex-col gap-4 px-4 py-6 rounded-md"
              >
                <FormField
                  control={form.control}
                  name={`transfers.${index}.userCode`}
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormControl>
                        <Input
                          placeholder="User Code"
                          {...field}
                          className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                            direction === "rtl" ? "text-right" : ""
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`transfers.${index}.amount`}
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormControl>
                        <Input
                          placeholder="Amount"
                          {...field}
                          className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                            direction === "rtl" ? "text-right" : ""
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fields.length > 1 && (
                  <Button type="button" onClick={() => remove(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}

            <div className="flex items-center justify-center">
              <CirclePlus
                size={40}
                className="text-primary cursor-pointer"
                onClick={() => append({ userCode: "", amount: "" })}
              />
            </div>

            <div className="flex w-full justify-between p-4">
              <LoadingButton
                onClick={() => {
                  const decryptedData = decryptData(
                    localStorageData,
                    env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
                  );

                  if (decryptedData) {
                    const { paymentMethodName, ...newObj } = decryptedData;
                    setLocalStorageData({ ...newObj, paymentMethodName: null });

                    const encryptedData = encryptData(
                      newObj,
                      env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
                    );
                    setLocalStorageData(encryptedData);

                    if (transactionId) {
                      router.replace(`/steps/4/?id=${transactionId}`);
                    } else {
                      router.replace(`/steps/4`);
                    }
                  }
                }}
              >
                {t2("back")}
              </LoadingButton>
              <LoadingButton
                type="submit"
                loading={
                  transactionId
                    ? updateUserCodeMutation.isPending
                    : createUserCodeMutation.isPending
                }
              >
                {t2("confirm")}
              </LoadingButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
