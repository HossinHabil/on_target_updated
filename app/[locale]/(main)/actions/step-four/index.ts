"use server";
import { db } from "@/lib/db";

export const clientDataHandler = async (transactionId: string) => {
  try {
    const clientData = await db.client.findUnique({
      where: {
        transactionCode: transactionId,
      },
      select: {
        fullName: true,
        email: true,
        phoneNumber: true,
        transactionCode: true,
        paymentMethodName: true,
        transactionAction: true,
        amount: true,
      },
    });

    if (clientData) {
      if (clientData.paymentMethodName) {
        return {
          status: 202,
          data: null,
        };
      } else {
        return {
          status: 200,
          data: clientData,
        };
      }
    } else {
      return {
        status: 201,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
  }
};
