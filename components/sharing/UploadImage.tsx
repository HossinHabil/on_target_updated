"use client";

import {
  useDeleteImage,
  useUploadImage,
} from "@/app/[locale]/(main)/_components/Vodafone/mutations";
import { useToast } from "@/hooks/use-toast";
import {
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_TRANSACTION_KEY,
  UploadButton,
} from "@/lib/utils";
import { ImagePopUp } from "./ImagePopUp";
import LoadingButton from "./LoadingButton";
import { useLocalStorage } from "usehooks-ts";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const UploadImage = () => {
  const param = useSearchParams();
  const transactionId = param.get("id");
  const [localStorageData, setLocalStorageData] = useLocalStorage(
    transactionId ? LOCAL_STORAGE_TRANSACTION_KEY : LOCAL_STORAGE_KEY,
    ""
  );
  const { toast } = useToast();

  const { mutate: uploadImage, data } = useUploadImage({
    localStorageData,
    setLocalStorageData,
  });
  const useDeleteImageMutation = useDeleteImage({
    localStorageData,
    setLocalStorageData,
  });
  const [image, setImage] = useState<string | undefined>(data);

  useEffect(() => {
    if (data) {
      setImage(data);
    }
  }, [data]);

  return (
    <>
      {image ? (
        <div className="flex flex-col gap-4">
          <LoadingButton
            onClick={() =>
              useDeleteImageMutation.mutate(image, {
                onSuccess: () => setImage(""),
              })
            }
            loading={useDeleteImageMutation.isPending}
          >
            Delete
          </LoadingButton>
          <ImagePopUp item={image} title="View Uploaded Image" />
        </div>
      ) : (
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={uploadImage}
          onUploadError={(error: Error) => {
            toast({
              variant: "destructive",
              title: "Error uploading image",
            });
          }}
        />
      )}
    </>
  );
};
