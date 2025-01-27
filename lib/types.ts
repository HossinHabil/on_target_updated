import { Prisma } from "@prisma/client";
import { BankTransferWithdrawalType } from "./schema/MultiStepFormSchema";
import { AddNewVodafoneNumber, AddPaymentMethod } from "./schema/Dashboard";
import { z } from "zod";

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

export type AddNewVodafonePhoneNumber = Prisma.VodafoneGetPayload<{
  select: { phoneHolder: true; phoneNumber: true };
}>;

export interface AddNewNumberFormProps {
  onSubmit: (values: z.infer<typeof AddNewVodafoneNumber>) => void;
}
export interface AddPaymentMethodFormProps {
  onSubmit: (values: z.infer<typeof AddPaymentMethod>) => void;
}

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

export interface DateRange {
  from: Date;
  to: Date | undefined;
}

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
  /** Alignment of popover */
  align?: "start" | "center" | "end";
  /** Option for locale */
  locale?: string;
  /** Option for showing compare feature */
  showCompare?: boolean;
  setRangeObject: React.Dispatch<
    React.SetStateAction<{
      from: Date;
      to: Date | undefined;
    }>
  >;
}

export interface updatePaymentMethodProps {
  inputValues: z.infer<typeof AddPaymentMethod>;
  updatedImage: string;
  id: string;
}
export interface addPaymentMethodProps {
  inputValues: z.infer<typeof AddPaymentMethod>;
  updatedImage: string;
}

export interface updatePaymentMethodsUserListProps {
  selectedPaymentMethodId: string;
  userId: string;
  action: "connect" | "disconnect";
}
