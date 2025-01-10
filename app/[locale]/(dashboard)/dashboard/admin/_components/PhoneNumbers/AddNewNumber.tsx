"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AddNewNumberForm from "./AddNewNumberForm";
import LoadingButton from "@/components/sharing/LoadingButton";
import { useSubmitVodafonePhoneNumber } from "./mutations";
import { AddNewVodafoneNumber } from "@/lib/schema/Dashboard";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export default function AddNewNumber() {
  const { toast } = useToast();
  const { mutate, isPending } = useSubmitVodafonePhoneNumber();

  const onSubmit = (values: z.infer<typeof AddNewVodafoneNumber>) => {
    if (!values) {
      toast({
        title: "Please fill up the fields",
      });
      return;
    }
    mutate(
      {
        phoneHolder: values.userName,
        phoneNumber: values.phoneNumber,
      }
    );
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add New Number</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Number</DialogTitle>
          <DialogDescription>
            Write the number without country code
          </DialogDescription>
        </DialogHeader>
        <AddNewNumberForm onSubmit={onSubmit} />
        <DialogFooter>
          <LoadingButton
            type="submit"
            loading={isPending}
            form="add-number-form"
          >
            Save changes
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
