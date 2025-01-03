"use server";

import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import {
  SignUpSchemaType,
  signUpSchema,
} from "@/lib/schema/RegistrationFormSchema";
import { getUserByEmail } from "@/utils/user";

export const signUp = async (
  values: SignUpSchemaType
): Promise<{ error: string } | { success: string }> => {
  try {
    const validatedFields = signUpSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid Fields!" };
    }

    const { email, username, password } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingEmail = await getUserByEmail(email);

    if (existingEmail) {
      return { error: "Email already exists!" };
    }

    await db.user.create({
      data: {
        email,
        name: username,
        password: hashedPassword,
        role: "User",
      },
    });

    return { success: "Account created successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
