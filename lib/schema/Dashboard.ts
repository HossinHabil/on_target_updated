import { z } from "zod";

export const AddNewVodafoneNumber = z.object({
    userName: z
    .string()
    .min(2, { message: "This field is required" })
    .max(15)
    .regex(/^[a-zA-Z]+ [a-zA-Z]+$/, "Please enter a valid name"),
    phoneNumber: z
    .string()
    .min(8, { message: "This field is required" })
    .max(15)
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
})

export const AddPaymentMethod = z.object({
    name: z.string().min(1, "Required"),
    content: z.string().optional()
})