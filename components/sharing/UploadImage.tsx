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
import { useState } from "react";

export const UploadImage = () => {
  const param = useSearchParams();
  const transactionId = param.get("id");
  const [localStorageData, setLocalStorageData] = useLocalStorage(
    transactionId ? LOCAL_STORAGE_TRANSACTION_KEY : LOCAL_STORAGE_KEY,
    ""
  );
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>();

  const { mutate: uploadImage, data } = useUploadImage();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteImage({
    localStorageData,
    setLocalStorageData,
  });

  return (
    <>
      {data ? (
        <div className="flex flex-col gap-4">
          <LoadingButton onClick={() => deleteImage(data)} loading={isDeleting}>
            Delete
          </LoadingButton>
          {data && <ImagePopUp item={data} title="View Uploaded Image" />}
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
