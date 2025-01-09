import { env } from "@/env";
import {
  LocalStorageData,
  VodafoneNumbersDepositProps,
  VodafoneNumbersWithdrawalProps,
  vodafonePhoneNumber,
} from "@/lib/types";
import { decryptData, encryptData } from "@/lib/utils";
import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import {
  createVodafoneDeposit,
  createVodafoneWithdrawal,
  fetchPhoneNumbers,
  handleDeleteImage,
  handleUploadImage,
  updateReservedVodafoneNumbers,
  updateVodafoneDeposit,
  updateVodafoneWithdrawal,
} from "./actions";
import { useToast } from "@/hooks/use-toast";

interface useDeleteImageProps {
  localStorageData: string;
  setLocalStorageData: (data: string) => void;
}

export function useFetchPhoneNumbers(localStorageData: string) {
  const queryKey: QueryKey = ["fetchPhoneNumbers"];
  const decryptedData: LocalStorageData = decryptData(
    localStorageData,
    env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
  );

  if (!decryptedData.amount) {
    throw new Error("Amount is missing");
  }

  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchPhoneNumbers(Number(decryptedData.amount)),
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  return query;
}

export function useUpdateReservedNumbers() {
  return useMutation({
    mutationFn: async (values: vodafonePhoneNumber[]) =>
      updateReservedVodafoneNumbers(values),
  });
}

export function useUploadImage({
  localStorageData,
  setLocalStorageData,
}: useDeleteImageProps) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: handleUploadImage,
    onSuccess: (data) => {
      const decryptedData: LocalStorageData = decryptData(
        localStorageData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );
      const updatedLocalStorageData = {
        ...decryptedData,
        uploadedImage: [...(decryptedData.uploadedImage || []), data],
      };
      const encryptedData = encryptData(
        updatedLocalStorageData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );
      setLocalStorageData(encryptedData);
      toast({
        title: "Image uploaded successfully",
      });
    },
  });
}

export function useDeleteImage({
  localStorageData,
  setLocalStorageData,
}: useDeleteImageProps) {
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["deleteImage"],
    mutationFn: (imageUrl: string) => handleDeleteImage(imageUrl),
    onSuccess: (data) => {
      const decryptedData: LocalStorageData = decryptData(
        localStorageData,
        env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
      );
      if (decryptedData.uploadedImage) {
        const updatedImages = decryptedData.uploadedImage.filter(
          (image) => image !== data
        );
        const updatedLocalStorageData = {
          ...decryptedData,
          uploadedImage: updatedImages,
        };
        const encryptedData = encryptData(
          updatedLocalStorageData,
          env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
        );
        setLocalStorageData(encryptedData);
      }
      toast({
        title: "Image deleted successfully",
      });
    },
  });
}

export function useUpdateVodafoneNumbersDeposit() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      decryptedData,
      phoneNumbersArray,
      remainderAmount,
    }: VodafoneNumbersDepositProps) =>
      updateVodafoneDeposit({
        decryptedData,
        phoneNumbersArray,
        remainderAmount,
      }),
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
    },
  });
}

export function useCreateVodafoneNumbersDeposit() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      decryptedData,
      phoneNumbersArray,
      remainderAmount,
    }: VodafoneNumbersDepositProps) =>
      createVodafoneDeposit({
        decryptedData,
        phoneNumbersArray,
        remainderAmount,
      }),
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
    },
  });
}

export function useUpdateVodafoneNumbersWithdrawal() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ decryptedData, values }: VodafoneNumbersWithdrawalProps) =>
      updateVodafoneWithdrawal({
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

export function useCreateVodafoneNumbersWithdrawal() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ decryptedData, values }: VodafoneNumbersWithdrawalProps) =>
      createVodafoneWithdrawal({
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
