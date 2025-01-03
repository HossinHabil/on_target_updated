"use server";

import { signIn } from "@/auth";
import {
  loginSchema,
  LoginSchemaType,
} from "@/lib/schema/RegistrationFormSchema";

export const login = async (values: LoginSchemaType) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  try {
    const { email, password } = validatedFields.data;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: "Logged Successfully" };
  } catch (error: any) {
    switch (error.name) {
      case "CredentialsSignin":
        return { error: "Invalid credentials!" };
      default:
        return { error: "Something went wrong!" };
    }
  }
};
