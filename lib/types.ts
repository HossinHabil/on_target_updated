import { Prisma } from "@prisma/client";
import { BankTransferWithdrawalType } from "./schema/MultiStepFormSchema";

export interface LocalStorageData {
  fullName: string;
  email: string;
  phoneNumber: string;
  terms: boolean;
  transactionAction: string;
  amount: string;
  paymentMethodName: string;
  transactionCode: string;
  uploadedImage: string[];
}

export type vodafonePhoneNumber = Prisma.VodafoneGetPayload<{
  select: { id: true; phoneNumber: true; initialAmount: true };
}>;

export const vodafonePhoneNumberSelect = {
  id: true,
  phoneNumber: true,
  initialAmount: true,
} satisfies Prisma.VodafoneSelect;

export interface VodafoneNumbersDepositProps {
  decryptedData: LocalStorageData;
  phoneNumbersArray: vodafonePhoneNumber[] | undefined;
  remainderAmount: number;
}

export interface VodafoneNumbersWithdrawalProps {
  decryptedData: LocalStorageData;
  values: { transfers: { phoneNumber: string; amount: string }[] };
}

export interface BankTransferWithdrawalProps {
  decryptedData: LocalStorageData;
  values: BankTransferWithdrawalType;
}

export interface WithdrawalWithPhoneNumberProps {
  decryptedData: LocalStorageData;
  values: { transfers: { phoneNumber: string; amount: string }[] };
}

export interface InstaPayWithdrawalWithUserCodeProps {
  decryptedData: LocalStorageData;
  values: { transfers: { userCode: string; amount: string }[] };
}

export type UsersTableProps = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    image: true;
    role: true;
  };
}>;

export type ClientTableProps = Prisma.ClientGetPayload<{
  select: {
    id: true;
    phoneNumber: true;
    email: true;
    fullName: true;
    transactionAction: true;
    transactionCode: true;
    transactionStatus: true;
    imageUrl: true;
    amount: true;
    paymentMethodName: true;
    userId: true;
  };
}>;

export type ClientTablePropsWithRelations = Prisma.ClientGetPayload<{
  include: {
    BankTransferWithdrawal: true;
    bankTransfer: true;
    InstaPay: true;
    InstaPayWithdrawal: true;
    fawryPay: true;
    VodafoneWithdrawal: true;
  };
}>;
