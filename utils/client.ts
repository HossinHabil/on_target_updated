"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export const getClientList = async () => {
  try {
    const session = await auth();

    if (!session) {
      return {
        status: 401,
        data: [],
        message: "Not Authorized",
      };
    }

    const clientList = await db.client.findMany({
      where: {
        userId: session.user.id,
      },
    });

    if (!clientList.length) {
      return {
        status: 402,
        message: "No Client Found",
        data: [],
      };
    }

    return {
      status: 200,
      data: clientList,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
      data: null,
    };
  }
};
