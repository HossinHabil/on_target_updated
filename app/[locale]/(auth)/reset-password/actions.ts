"use server";

import { db } from "@/lib/db";
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/lib/schema/RegistrationFormSchema";
import bcrypt from "bcryptjs";

export default async function resetPassword(
  values: ResetPasswordSchemaType,
  id: string
) {
  try {
    const validatedFields = ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid Fields!" };
    }

    if (!id) {
      return { error: "Id not found" };
    }
    
    const { password, confirmPassword } = validatedFields.data;
    
    if (password !== confirmPassword) {
        return { error: "Password does not match" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUserPassword = await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });

    if (!updateUserPassword) {
      return {
        status: 500,
        error: "Something went wrong",
      };
    }

    return {
      status: 200,
      success: "Password updated successfully",
    };
  } catch (error) {
    return {
      status: 500,
      success: "Something went wrong",
    };
  }
}
