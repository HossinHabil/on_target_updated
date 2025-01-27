"use client";

import { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  decryptData,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_TRANSACTION_KEY,
} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { redirect } from "@/i18n/routing";
import { env } from "@/env";
import VodafoneComponent from "../Vodafone/VodafoneComponent";
import InstaPayComponent from "../InstaPay/InstaPayComponent";
import BankTransferComponent from "../BankTransfer/BankTransferComponent";
import FawryComponent from "../Fawry/FawryComponent";

export default function StepFive() {
  const param = useSearchParams();
  const transactionId = param.get("id");
  const [localStorageData, setLocalStorageData, removeLocalStorage] =
    useLocalStorage(
      transactionId ? LOCAL_STORAGE_TRANSACTION_KEY : LOCAL_STORAGE_KEY,
      ""
    );

  const decryptedData = decryptData(
    localStorageData,
    env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
  );

  const switchHandler = useCallback((paymentMethod: string) => {
    switch (paymentMethod) {
      case "wallet":
        return <VodafoneComponent />;
      case "instapay":
        return <InstaPayComponent />;
      case "banktransfer":
        return <BankTransferComponent />;
      case "fawrypay":
        return <FawryComponent />;
      default:
        return redirect({
          href: "/steps/1",
          locale: "en",
        });
    }
  }, []);

  return (
    <>
      {decryptedData?.paymentMethodName &&
        switchHandler(decryptedData.paymentMethodName.toLowerCase().replace(/\s+/g, ""))}
    </>
  );
}
