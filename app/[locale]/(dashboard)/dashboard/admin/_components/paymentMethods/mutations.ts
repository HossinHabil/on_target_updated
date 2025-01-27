import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addPaymentMethod,
  deletePaymentMethod,
  fetchPaymentMethods,
  updatePaymentMethod,
  updatePaymentMethodsUserList,
} from "./actions";
import { addPaymentMethodProps, updatePaymentMethodProps, updatePaymentMethodsUserListProps } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethod } from "@prisma/client";

const paymentMethodsQueryKey: QueryKey = ["fetchPaymentMethods"];
export function useFetchPaymentMethods() {
  return useQuery({
    queryKey: paymentMethodsQueryKey,
    queryFn: fetchPaymentMethods,
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deletePaymentMethod({ id }),
    onSuccess: (data) => {
      toast({ title: data.message });
      queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey });
    },
  });
}

export function useEditPaymentMethod() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, inputValues, updatedImage }: updatePaymentMethodProps) =>
      updatePaymentMethod({
        id,
        inputValues,
        updatedImage,
      }),
    onSuccess: (data) => {
      toast({ title: data.message });
      queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey });
    },
  });
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ inputValues, updatedImage }: addPaymentMethodProps) =>
      addPaymentMethod({
        inputValues,
        updatedImage,
      }),
    onSuccess: (data) => {
      toast({ title: data.message });
      queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey });
    },
  });
}

export function useUpdatePaymentMethodsUserList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      selectedPaymentMethodId,
      userId,
      action,
    }: updatePaymentMethodsUserListProps) =>
      updatePaymentMethodsUserList({
        userId,
        selectedPaymentMethodId,
        action,
      }),
    onSuccess: (data) => {
      toast({ title: data.message });
      queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey });
    },
  });
}
