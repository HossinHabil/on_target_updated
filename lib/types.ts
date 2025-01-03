import { Prisma } from "@prisma/client";

export interface LocalStorageData {
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  terms: boolean | null;
  transactionAction: string | null;
  amount: string | null;
  paymentMethodName: string | null;
  transactionCode: string | null;
  uploadedImage: string[] | null;
}

export type vodafonePhoneNumber = Prisma.VodafoneGetPayload<{
  select: { id: true; phoneNumber: true; initialAmount: true };
}>;

export const vodafonePhoneNumberSelect = {
  id: true,
  phoneNumber: true,
  initialAmount: true,
} satisfies Prisma.VodafoneSelect;
