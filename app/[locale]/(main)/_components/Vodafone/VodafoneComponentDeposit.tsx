"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  decryptData,
  delay,
  encryptData,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_TRANSACTION_KEY,
} from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import LoadingButton from "@/components/sharing/LoadingButton";
import { useTranslations } from "next-intl";
import { env } from "@/env";
import {
  useCreateVodafoneNumbersDeposit,
  useFetchPhoneNumbers,
  useUpdateReservedNumbers,
  useUpdateVodafoneNumbersDeposit,
} from "./mutations";
import VodafoneNumberCards from "@/components/sharing/skeleton/VodafoneNumberCards";
import { UploadImage } from "@/components/sharing/UploadImage";
import { useToast } from "@/hooks/use-toast";
import { LocalStorageData } from "@/lib/types";
import { useRouter } from "@/i18n/routing";

export default function VodafoneComponentDeposit() {
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

  const { data: phoneNumbersArray, status } =
    useFetchPhoneNumbers(localStorageData);
  const { mutateAsync, isPending: isPendingUpdate } =
    useUpdateReservedNumbers();
  const updateVodafoneNumbersMutation = useUpdateVodafoneNumbersDeposit();
  const createVodafoneNumbersMutation = useCreateVodafoneNumbersDeposit();

  const handleSubmit = async () => {
    try {
      const decryptedData: LocalStorageData = decryptData(
        localStorageData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );

      if (
        decryptedData.uploadedImage?.length !==
        phoneNumbersArray?.fetchedNumbers.length
      ) {
        toast({
          variant: "destructive",
          title: "You have to complete uploading all the documents",
        });
        return;
      }

      if (transactionId) {
        // Update the existing Client
        updateVodafoneNumbersMutation.mutate(
          {
            decryptedData,
            phoneNumbersArray: phoneNumbersArray?.fetchedNumbers,
            remainderAmount: phoneNumbersArray.remainderAmount,
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
        createVodafoneNumbersMutation.mutate(
          {
            decryptedData,
            phoneNumbersArray: phoneNumbersArray?.fetchedNumbers,
            remainderAmount: phoneNumbersArray.remainderAmount,
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

  if (status === "pending") {
    return <VodafoneNumberCards />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-muted-foreground">
        An error occurred while fetching phoneNumbers
      </p>
    );
  }

  return (
    <div className="max-w-[50rem] mx-auto w-full flex flex-col gap-8">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-0 justify-between items-center text-center`}
      >
        {phoneNumbersArray.fetchedNumbers.map((number, i) => {
          return (
            <Card key={number.id} className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Transaction Number {i + 1}</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-semibold">
                {number?.phoneNumber}
              </CardContent>
              <CardFooter className="flex-col justify-center gap-4 text-xl font-semibold">
                <p>
                  {i < phoneNumbersArray?.fetchedNumbers.length - 1
                    ? `${number.initialAmount.toFixed(0)} EGP`
                    : `${
                        phoneNumbersArray.remainderAmount % 60000 === 0
                          ? 60000
                          : phoneNumbersArray.remainderAmount.toFixed(0)
                      } EGP`}
                </p>

                <UploadImage />
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="flex w-full justify-between p-4">
        <LoadingButton
          type="button"
          loading={isPendingUpdate}
          onClick={async () => {
            await mutateAsync(phoneNumbersArray.fetchedNumbers, {
              onSuccess: () => {
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
              },
            });
          }}
        >
          {t2("back")}
        </LoadingButton>
        <LoadingButton
          loading={
            transactionId
              ? updateVodafoneNumbersMutation.isPending
              : createVodafoneNumbersMutation.isPending
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
