import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email({ message: "Please enter a valid email" }),
  username: requiredString
    .min(4, "Username must be at least 4 characters long")
    .max(15)
    .regex(/^[a-zA-Z]+ [a-zA-Z]+$/, "Please enter a full name"),
  password: requiredString
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(15, { message: "Password must be no more than 15 characters long." })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    })
    .regex(/\d/, { message: "Password must include at least one number." })
    .regex(/[#\[\]()@$&*!?|,.^/+_-]/, {
      message:
        "Password must include at least one special character (#[]()@$&*!?|,.^/+_-).",
    }),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: requiredString.email({ message: "Please enter a valid email" }),
  password: requiredString,
});

export type LoginSchemaType = z.infer<typeof loginSchema>;