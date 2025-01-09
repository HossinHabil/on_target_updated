"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

export const generateApiKey = async () => {
  try {
    const session = await auth();

    if (!session) {
      return {
        status: 401,
        message: "Not Authorized",
        data: null,
      };
    }

    const apiKey = crypto.randomBytes(32).toString("hex");

    await db.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        api_key: apiKey,
      },
    });

    return {
      status: 200,
      message: "API key generated successfully",
      data: apiKey,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to generate API key",
      error,
    };
  }
};
