"use client";

import { useEffect, useState } from "react";
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
import { useTranslations } from "next-intl";
import { env } from "@/env";
import LoadingButton from "@/components/sharing/LoadingButton";
import { useFetchUsers } from "@/app/[locale]/(dashboard)/dashboard/admin/mutations";
import { useFetchUsersThroughTransactionId } from "./mutations";
import PaymentMethodsSkeletonCards from "@/components/sharing/skeleton/PaymentMethodsSkeletonCards";
import { PaymentMethod } from "@prisma/client";
import StepFourForm from "./StepFourForm";

export interface PaymentMethodsList {
  id: string;
  name: string;
  image: string;
  value: {
    paymentMethodName: string;
  };
}

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
  const t2 = useTranslations("pagination");

  const { data, status } = useFetchUsersThroughTransactionId({ transactionId });

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
      console.log("collectedData", collectedData);
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

  if (status === "pending") {
    return <PaymentMethodsSkeletonCards />;
  }

  if (status === "error") {
    return (
      <h2 className="text-center text-muted-foreground">
        An error occurred while fetching users
      </h2>
    );
  }

  if (status === "success") {
    if (!data?.data || data?.data.length === 0) {
      return (
        <Form {...form}>
          <form className="space-y-4 text-center w-full">
            <StepFourForm
              form={form}
              onSubmitHandler={onSubmitHandler}
              finalPaymentMethod={paymentsMethods}
            />
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
    } else {
      return (
        <Form {...form}>
          <form className="space-y-4 text-center w-full">
            <StepFourForm
              form={form}
              onSubmitHandler={onSubmitHandler}
              finalPaymentMethod={data.data}
            />
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
  }
}
