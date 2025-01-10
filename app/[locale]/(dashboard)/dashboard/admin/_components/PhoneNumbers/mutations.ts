import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteVodafonePhoneNumber,
  fetchVodafoneNumbers,
  submitVodafoneNumber,
} from "./actions";
import { AddNewVodafonePhoneNumber } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Vodafone } from "@prisma/client";

const vodafoneNumbersQueryKey: QueryKey = ["fetchvodafoneNumbers"];
export function useFetchVodafoneNumbers() {
  return useQuery({
    queryKey: vodafoneNumbersQueryKey,
    queryFn: fetchVodafoneNumbers,
  });
}

export function useSubmitVodafonePhoneNumber() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phoneHolder, phoneNumber }: AddNewVodafonePhoneNumber) =>
      submitVodafoneNumber({
        phoneHolder,
        phoneNumber,
      }),
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: vodafoneNumbersQueryKey });
      queryClient.invalidateQueries({ queryKey: vodafoneNumbersQueryKey });
      toast({
        title: data.message,
      });
    },
  });
}

export function useDeleteVodafonePhoneNumber() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Vodafone) => deleteVodafonePhoneNumber(item),
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: vodafoneNumbersQueryKey });
      queryClient.invalidateQueries({ queryKey: vodafoneNumbersQueryKey });
      toast({
        title: data.message,
      });
    },
  });
}
