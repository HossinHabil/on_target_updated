"use server";

import { db } from "@/lib/db";

export async function fetchUsersThroughTransactionId({
  transactionId,
}: {
  transactionId: string | null;
}) {
  try {
    if (!transactionId) {
      const paymentMethodsList = await db.paymentMethod.findMany();
      return {
        status: 201,
        data: paymentMethodsList,
      }
    }

    const client = await db.client.findUnique({
      where: {
        transactionCode: transactionId,
      },
    });

    if (!client?.id) {
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: client.userId as string,
      },
      include: {
        paymentMethods: true,
      },
    });

    return {
      status: 200,
      data: user?.paymentMethods || [],
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}
