import { useToast } from "@/hooks/use-toast";
import {
  InstaPayWithdrawalWithUserCodeProps,
  WithdrawalWithPhoneNumberProps,
} from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import {
  createPhoneNumber,
  createUserCode,
  updatePhoneNumber,
  updateUserCode,
} from "./actions";

export function useUpdatePhoneNumber() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ decryptedData, values }: WithdrawalWithPhoneNumberProps) =>
      updatePhoneNumber({
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

export function useCreatePhoneNumber() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ decryptedData, values }: WithdrawalWithPhoneNumberProps) =>
      createPhoneNumber({
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

export function useUpdateUserCode() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      decryptedData,
      values,
    }: InstaPayWithdrawalWithUserCodeProps) =>
      updateUserCode({
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

export function useCreateUserCode() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      decryptedData,
      values,
    }: InstaPayWithdrawalWithUserCodeProps) =>
      createUserCode({
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
