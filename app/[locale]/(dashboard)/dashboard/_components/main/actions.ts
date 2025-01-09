"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const clientData = async () => {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        status: 401,
        message: "Not Authorized",
        data: [],
      };
    }

    const clientList = await db.client.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        fullName: true,
        email: true,
        phoneNumber: true,
        transactionCode: true,
        paymentMethodName: true,
        transactionAction: true,
        amount: true,
        transactionStatus: true,
        imageUrl: true,
        id: true,
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
      message: "Client data fetched successfully",
      data: clientList,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to fetch client data",
      error: error,
    };
  }
};
