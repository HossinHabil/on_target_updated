"use client";

import LoadingButton from "@/components/sharing/LoadingButton";
import { UploadImage } from "@/components/sharing/UploadImage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { LocalStorageData } from "@/lib/types";
import {
  decryptData,
  delay,
  encryptData,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_TRANSACTION_KEY,
} from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import {
  useCreateBankTransferDeposit,
  useUpdateBankTransferDeposit,
} from "./mutations";

export default function BankTransferDeposit() {
  const { toast } = useToast();
  const t2 = useTranslations("pagination");
  const router = useRouter();
  const param = useSearchParams();
  const transactionId = param.get("id");
  const [localStorageData, setLocalStorageData, removeLocalStorage] =
    useLocalStorage(
      transactionId ? LOCAL_STORAGE_TRANSACTION_KEY : LOCAL_STORAGE_KEY,
      ""
    );

  const updateBankTransferDepositMutation = useUpdateBankTransferDeposit();
  const createBankTransferDepositMutation = useCreateBankTransferDeposit();

  const handleSubmit = () => {
    try {
      const decryptedData: LocalStorageData = decryptData(
        localStorageData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );

      if (!decryptedData.uploadedImage) {
        toast({
          variant: "destructive",
          title: "You have to complete uploading all the documents",
        });
        return;
      }

      if (transactionId) {
        // Update the existing Client
        updateBankTransferDepositMutation.mutate(decryptedData, {
          onSuccess: async (data) => {
            await delay(1500);
            removeLocalStorage();
            router.push(data.return_url || "/steps/1");
          },
        });
      } else {
        // Create a new Client
        createBankTransferDepositMutation.mutate(decryptedData, {
          onSuccess: async (data) => {
            await delay(1500);
            removeLocalStorage();
            router.replace("/steps/1");
          },
        });
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Account Name: ontarget Royal</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold">
          <p>ACCOUNT NUMBER: 5720001000004548</p>
          <p>SWIFT CODE: BMISEGCXXXX</p>
          <p>BANK: BANK MISR</p>
          <p>BRANCH NAME: Miami branch</p>
          <p>BRANCH CODE : 572</p>
          <p>IBAN ACCOUNT NUMBER : EG920002057205720001000004548</p>
        </CardContent>
        <CardFooter className="flex-col justify-center gap-4 text-xl font-semibold">
          <UploadImage />
        </CardFooter>
      </Card>

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
          loading={
            transactionId
              ? updateBankTransferDepositMutation.isPending
              : createBankTransferDepositMutation.isPending
          }
          type="submit"
          onClick={handleSubmit}
        >
          {t2("confirm")}
        </LoadingButton>
      </div>
    </div>
  );
}
