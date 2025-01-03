import { env } from "@/env";
import { LocalStorageData, vodafonePhoneNumber } from "@/lib/types";
import { decryptData, encryptData } from "@/lib/utils";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchPhoneNumbers,
  handleDeleteImage,
  handleUploadImage,
  updateReservedVodafoneNumbers,
} from "./actions";
import { useToast } from "@/hooks/use-toast";

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
  const mutationKey: MutationKey = ["updateReservedNumbers"];

  return useMutation({
    mutationKey,
    mutationFn: async (values: vodafonePhoneNumber[]) =>
      updateReservedVodafoneNumbers(values),
  });
}

const mutationKey: MutationKey = ["uploadImage"];

export function useUploadImage() {
  const { toast } = useToast();

  return useMutation({
    mutationKey,
    mutationFn: handleUploadImage,
    onSuccess: (data) => {
      toast({
        title: "Image uploaded successfully",
      });
    },
  });
}

interface useDeleteImageProps {
  localStorageData: string;
  setLocalStorageData: (data: string) => void;
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
