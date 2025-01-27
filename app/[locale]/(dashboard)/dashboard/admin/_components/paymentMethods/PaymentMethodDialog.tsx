"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/sharing/LoadingButton";
import AddPaymentMethodForm from "./AddPaymentMethodForm";
import { useAddPaymentMethod } from "./mutations";
import { UploadButton } from "@/lib/utils";
import { useState } from "react";
import { ImagePopUp } from "@/components/sharing/ImagePopUp";
import { AddPaymentMethod } from "@/lib/schema/Dashboard";
import { z } from "zod";

interface PaymentMethodDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PaymentMethodDialog({
  isOpen,
  setIsOpen,
}: PaymentMethodDialogProps) {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const { mutate, isPending } = useAddPaymentMethod();
  const onSubmit = (values: z.infer<typeof AddPaymentMethod>) => {
    console.log(values);
    mutate({
      inputValues: values,
      updatedImage: uploadedImage,
    },
    {
      onSuccess: () => {
        setUploadedImage("");
        setIsOpen(false);
      }
    }
  )
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Payment Method</DialogTitle>
          <DialogDescription>
            Write the payment method name and description
          </DialogDescription>
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
        <AddPaymentMethodForm onSubmit={onSubmit} />
        <DialogFooter>
          <LoadingButton
            type="submit"
            loading={isPending}
            form="add-payment-method-form"
          >
            Add Payment Method
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
