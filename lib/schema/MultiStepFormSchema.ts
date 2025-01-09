import { z } from "zod";

export const FormSchemaStepOne = z.object({
  fullName: z
    .string()
    .min(2, { message: "This field is required" })
    .max(15)
    .regex(/^[a-zA-Z]+ [a-zA-Z]+$/, "Please enter a valid name"),
  email: z.string().email({ message: "Please enter a valid email" }),
  phoneNumber: z
    .string()
    .min(8, { message: "This field is required" })
    .max(15)
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  terms: z.boolean().refine((value) => value === true, {
    message: "Please agree to the terms",
  }),
});
export const FormSchemaStepTwo = z.object({
  transactionAction: z.enum(["withdrawal", "deposit"]).optional(),
});
export const FormSchemaStepThree = z.object({
  amount: z.coerce.number().gte(50, "Must be 50 and above"),
});
export const FormSchemaStepFour = z.object({
  paymentMethodName: z.string(),
});
export const BankTransferWithdrawalSchema = z.object({
  accountNumber: z.string().min(1, "Required"),
  accountHolder: z.string().min(1, "Required"),
  bankName: z.string().min(1, "Required"),
  swiftCode: z.string().min(1, "Required"),
  branchName: z.string().min(1, "Required"),
  branchCode: z.string().min(1, "Required"),
  ibanAccountNumber: z.string().min(1, "Required"),
});

export type BankTransferWithdrawalType = z.infer<
  typeof BankTransferWithdrawalSchema
>;
