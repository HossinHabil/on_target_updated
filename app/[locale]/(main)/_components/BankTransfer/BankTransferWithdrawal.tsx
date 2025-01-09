"use client";

import { InputField } from "@/components/sharing/InputField";
import LoadingButton from "@/components/sharing/LoadingButton";
import { Form } from "@/components/ui/form";
import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { BankTransferWithdrawalSchema } from "@/lib/schema/MultiStepFormSchema";
import { LocalStorageData } from "@/lib/types";
import {
  decryptData,
  delay,
  encryptData,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_TRANSACTION_KEY,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { getLangDir } from "rtl-detect";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";
import {
  useCreateBankTransferWithdrawal,
  useUpdateBankTransferWithdrawal,
} from "./mutations";

export default function BankTransferWithdrawal() {
  const { toast } = useToast();
  const t = useTranslations("bank");
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

  const updateBankTransferWithdrawalMutation =
    useUpdateBankTransferWithdrawal();
  const createBankTransferWithdrawalMutation =
    useCreateBankTransferWithdrawal();

  const form = useForm<z.infer<typeof BankTransferWithdrawalSchema>>({
    resolver: zodResolver(BankTransferWithdrawalSchema),
    defaultValues: {
      accountHolder: "",
      accountNumber: "",
      bankName: "",
      branchCode: "",
      branchName: "",
      swiftCode: "",
      ibanAccountNumber: "",
    },
  });
  const onSubmitHandler = (
    values: z.infer<typeof BankTransferWithdrawalSchema>
  ) => {
    try {
      const {
        accountHolder,
        accountNumber,
        swiftCode,
        bankName,
        branchCode,
        branchName,
        ibanAccountNumber,
      } = values;

      if (
        !accountHolder ||
        !accountNumber ||
        !bankName ||
        !branchCode ||
        !branchName ||
        !ibanAccountNumber ||
        !swiftCode
      ) {
        toast({
          variant: "destructive",
          title: "Please fill all the fields",
        });
        return;
      }

      const decryptedData: LocalStorageData = decryptData(
        localStorageData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );

      if (transactionId) {
        // Update the existing Client
        updateBankTransferWithdrawalMutation.mutate(
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
        createBankTransferWithdrawalMutation.mutate(
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
    <div className="max-w-[50rem] mx-auto w-full flex flex-col gap-8">
      <h2 className="font-extrabold text-xl md:text-3xl">{t("header")}</h2>
      <Form {...form}>
        <form
          className="space-y-4 text-center w-full"
          onSubmit={form.handleSubmit(onSubmitHandler)}
        >
          <div className="grid grid-cols-1 items-center gap-8 mb-8">
            <InputField
              control={form.control}
              type="text"
              name="accountHolder"
              placeholder={t("account_holder")}
              className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                direction === "rtl" ? "text-right" : "text-left"
              }`}
            />
            <InputField
              control={form.control}
              type="text"
              name="accountNumber"
              placeholder={t("account_number")}
              className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                direction === "rtl" ? "text-right" : "text-left"
              }`}
            />
            <InputField
              control={form.control}
              type="text"
              name="bankName"
              placeholder={t("bank_name")}
              className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                direction === "rtl" ? "text-right" : "text-left"
              }`}
            />
            <InputField
              control={form.control}
              type="text"
              name="branchCode"
              placeholder={t("branch_code")}
              className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                direction === "rtl" ? "text-right" : "text-left"
              }`}
            />
            <InputField
              control={form.control}
              type="text"
              name="branchName"
              placeholder={t("branch_name")}
              className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                direction === "rtl" ? "text-right" : "text-left"
              }`}
            />
            <InputField
              control={form.control}
              type="text"
              name="swiftCode"
              placeholder={t("swift")}
              className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                direction === "rtl" ? "text-right" : "text-left"
              }`}
            />
            <InputField
              control={form.control}
              type="text"
              name="ibanAccountNumber"
              placeholder={t("iban")}
              className={`border-input p-6 placeholder:text-muted-foreground text-primary rounded-2xl shadow-[rgba(0,_0,_0,_0.15)_0px_2px_8px] ${
                direction === "rtl" ? "text-right" : "text-left"
              }`}
            />
          </div>

          <div className="flex w-full justify-between p-4">
            <LoadingButton
              type="button"
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
                  ? updateBankTransferWithdrawalMutation.isPending
                  : createBankTransferWithdrawalMutation.isPending
              }
            >
              {t2("confirm")}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
