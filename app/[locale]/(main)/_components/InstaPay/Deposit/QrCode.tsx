"use client";

import Image from "next/image";
import { UploadImage } from "@/components/sharing/UploadImage";
import instapay_barcode from "@/public/main/instapay_barcode.webp";
import LoadingButton from "@/components/sharing/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import {
  decryptData,
  delay,
  encryptData,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_TRANSACTION_KEY,
} from "@/lib/utils";
import { env } from "@/env";
import { LocalStorageData } from "@/lib/types";
import { useCreateUserCode, useUpdateUserCode } from "./mutations";

export default function QrCode() {
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

  const updateUserCodeMutation = useUpdateUserCode();
  const createUserCodeMutation = useCreateUserCode();

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
        updateUserCodeMutation.mutate(decryptedData, {
          onSuccess: async (data) => {
            await delay(1500);
            removeLocalStorage();
            router.push(data.return_url || "/steps/1");
          },
        });
      } else {
        // Create a new Client
        createUserCodeMutation.mutate(decryptedData, {
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
    <div className="w-full">
      <Image
        src={instapay_barcode}
        alt="qr_code"
        width="300"
        height="300"
        className="mx-auto mb-8"
      />
      <UploadImage />

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
          onClick={handleSubmit}
        >
          {t2("confirm")}
        </LoadingButton>
      </div>
    </div>
  );
}
