import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import {
  createBankTransferDeposit,
  createBankTransferWithdrawal,
  updateBankTransferDeposit,
  updateBankTransferWithdrawal,
} from "./actions";
import { BankTransferWithdrawalProps, LocalStorageData } from "@/lib/types";

export function useUpdateBankTransferDeposit() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (decryptedData: LocalStorageData) =>
      updateBankTransferDeposit(decryptedData),
  });
}

export function useCreateBankTransferDeposit() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (decryptedData: LocalStorageData) =>
      createBankTransferDeposit(decryptedData),
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
    },
  });
}

export function useUpdateBankTransferWithdrawal() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ decryptedData, values }: BankTransferWithdrawalProps) =>
      updateBankTransferWithdrawal({
        decryptedData,
        values,
      }),
  });
}

export function useCreateBankTransferWithdrawal() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ decryptedData, values }: BankTransferWithdrawalProps) =>
      createBankTransferWithdrawal({
        decryptedData,
        values,
      }),
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
    },
  });
}
