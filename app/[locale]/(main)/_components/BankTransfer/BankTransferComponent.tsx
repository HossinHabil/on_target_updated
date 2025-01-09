"use client";

import { useLocalStorage } from "usehooks-ts";
import {
  decryptData,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_TRANSACTION_KEY,
} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { env } from "@/env";
import { redirect } from "@/i18n/routing";
import BankTransferDeposit from "./BankTransferDeposit";
import BankTransferWithdrawal from "./BankTransferWithdrawal";

export default function BankTransferComponent() {
  const param = useSearchParams();
  const transactionId = param.get("id");
  const [localStorageData] = useLocalStorage(
    transactionId ? LOCAL_STORAGE_TRANSACTION_KEY : LOCAL_STORAGE_KEY,
    ""
  );
  const decryptedData = decryptData(
    localStorageData,
    env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
  );

  if (!decryptData || !decryptedData.transactionAction) {
    return redirect({
      href: "/steps/1",
      locale: "en",
    });
  }

  return (
    <>
      {decryptedData.transactionAction.toLocaleLowerCase() === "deposit" ? (
        <BankTransferDeposit />
      ) : (
        <BankTransferWithdrawal />
      )}
    </>
  );
}
