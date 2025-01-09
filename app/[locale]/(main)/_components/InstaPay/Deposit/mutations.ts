import { useToast } from "@/hooks/use-toast";
import { LocalStorageData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import {
  createUserCode,
  createUserName,
  updateUserCode,
  updateUserName,
} from "./actions";

export function useUpdateUserCode() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (decryptedData: LocalStorageData) =>
      updateUserCode(decryptedData),
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
    mutationFn: (decryptedData: LocalStorageData) =>
      createUserCode(decryptedData),
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
    },
  });
}
export function useUpdateUserName() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (decryptedData: LocalStorageData) =>
      updateUserName(decryptedData),
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
    },
  });
}
export function useCreateUserName() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (decryptedData: LocalStorageData) =>
      createUserName(decryptedData),
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
    },
  });
}
