"use client";

import LoadingButton from "@/components/sharing/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditPaymentMethodForm from "./EditPaymentMethodForm";
import { UploadButton } from "@/lib/utils";
import { useState } from "react";
import { z } from "zod";
import { AddPaymentMethod } from "@/lib/schema/Dashboard";
import { ImagePopUp } from "@/components/sharing/ImagePopUp";
import { PaymentMethod } from "@prisma/client";
import { useEditPaymentMethod } from "./mutations";

interface EditPaymentMethodProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  paymentMethod: PaymentMethod;
}

export default function EditPaymentMethod({
  isEditing,
  setIsEditing,
  paymentMethod,
}: EditPaymentMethodProps) {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const { mutate, isPending } = useEditPaymentMethod();

  const onSubmit = (values: z.infer<typeof AddPaymentMethod>) => {
    mutate(
      {
        id: paymentMethod.id,
        inputValues: values,
        updatedImage: uploadedImage,
      },
      {
        onSuccess: () => {
          setUploadedImage("");
          setIsEditing(false);
        },
      }
    );
  };
  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment Method</DialogTitle>
          <DialogDescription>Modify the payment method</DialogDescription>
        </DialogHeader>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(e) => {
            setUploadedImage(e[0].url);
          }}
        />
        {uploadedImage && (
          <ImagePopUp item={uploadedImage} title="View Uploaded Image" />
        )}
        <EditPaymentMethodForm
          onSubmit={onSubmit}
          paymentMethod={paymentMethod}
        />
        <DialogFooter>
          <LoadingButton
            type="submit"
            loading={isPending}
            form="Edit-payment-method-form"
          >
            Confirm
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
