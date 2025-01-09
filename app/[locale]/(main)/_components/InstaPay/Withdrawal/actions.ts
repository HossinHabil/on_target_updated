"use server";

import { db } from "@/lib/db";
import {
  InstaPayWithdrawalWithUserCodeProps,
  WithdrawalWithPhoneNumberProps,
} from "@/lib/types";
import { TransactionStatus } from "@prisma/client";
import crypto from "crypto";

export const updatePhoneNumber = async ({
  decryptedData,
  values,
}: WithdrawalWithPhoneNumberProps) => {
  try {
    if (!decryptedData) {
      throw new Error("Decrypted data is required");
    }

    const existingClient = await db.client.findUnique({
      where: {
        transactionCode: decryptedData.transactionCode,
      },
    });

    if (!existingClient) {
      throw new Error(
        `Client with transactionCode ${decryptedData.transactionCode} not found`
      );
    }

    const updatedClient = await db.$transaction(async (db) => {
      const ClientData = {
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        transactionCode: decryptedData.transactionCode,
        transactionStatus: TransactionStatus.Pending,
        InstaPayWithdrawal: {
          create: values.transfers.map((item) => ({
            userNumber: item.phoneNumber,
            amount: item.amount,
          })),
        },
      };
      // Update the client and return the result with vodafoneCash included
      return db.client.update({
        where: {
          transactionCode: decryptedData.transactionCode,
        },
        include: {
          InstaPayWithdrawal: true,
        },
        data: ClientData,
      });
    });

    return {
      status: 200,
      message: "Done, Transaction has been submitted successfully",
      return_url: updatedClient.return_url,
    };
  } catch (error) {
    console.log("Error updating Instapay deposit:", error);
    return {
      status: 500,
      message: "Failed to update Instapay deposit",
      error: error,
    };
  }
};

export const createPhoneNumber = async ({
  decryptedData,
  values,
}: WithdrawalWithPhoneNumberProps) => {
  try {
    if (!decryptedData) {
      throw new Error("Decrypted data is required");
    }

    const transactionCode = crypto.randomInt(100_000, 1_000_000).toString();

    await db.$transaction(async (db) => {
      const ClientData = {
        fullName: decryptedData.fullName,
        email: decryptedData.email,
        phoneNumber: decryptedData.phoneNumber,
        amount: Number(decryptedData.amount),
        imageUrl: [],
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        transactionCode,
        transactionStatus: TransactionStatus.Pending,
        InstaPayWithdrawal: {
          create: values.transfers.map((item) => ({
            userNumber: item.phoneNumber,
            amount: item.amount,
          })),
        },
      };
      // Create client and return the result with vodafoneCash included
      return db.client.create({
        include: {
          InstaPayWithdrawal: true,
        },
        data: ClientData,
      });
    });

    return {
      status: 200,
      message: "Done, Transaction has been submitted successfully",
    };
  } catch (error) {
    console.log("Error updating Instapay deposit:", error);
    return {
      status: 500,
      message: "Failed to update Instapay deposit",
      error: error,
    };
  }
};

export const updateUserCode = async ({
  decryptedData,
  values,
}: InstaPayWithdrawalWithUserCodeProps) => {
  try {
    if (!decryptedData) {
      throw new Error("Decrypted data is required");
    }

    const existingClient = await db.client.findUnique({
      where: {
        transactionCode: decryptedData.transactionCode,
      },
    });

    if (!existingClient) {
      throw new Error(
        `Client with transactionCode ${decryptedData.transactionCode} not found`
      );
    }

    const updatedClient = await db.$transaction(async (db) => {
      const ClientData = {
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        transactionCode: decryptedData.transactionCode,
        transactionStatus: TransactionStatus.Pending,
        InstaPayWithdrawal: {
          create: values.transfers.map((item) => ({
            userCode: item.userCode,
            amount: item.amount,
          })),
        },
      };
      // Update the client and return the result with vodafoneCash included
      return db.client.update({
        where: {
          transactionCode: decryptedData.transactionCode,
        },
        include: {
          InstaPayWithdrawal: true,
        },
        data: ClientData,
      });
    });

    return {
      status: 200,
      message: "Done, Transaction has been submitted successfully",
      return_url: updatedClient.return_url,
    };
  } catch (error) {
    console.log("Error updating Instapay deposit:", error);
    return {
      status: 500,
      message: "Failed to update Instapay deposit",
      error: error,
    };
  }
};

export const createUserCode = async ({
  decryptedData,
  values,
}: InstaPayWithdrawalWithUserCodeProps) => {
  try {
    if (!decryptedData) {
      throw new Error("Decrypted data is required");
    }

    const transactionCode = crypto.randomInt(100_000, 1_000_000).toString();

    await db.$transaction(async (db) => {
      const ClientData = {
        fullName: decryptedData.fullName,
        email: decryptedData.email,
        phoneNumber: decryptedData.phoneNumber,
        amount: Number(decryptedData.amount),
        imageUrl: [],
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        transactionCode,
        transactionStatus: TransactionStatus.Pending,
        InstaPayWithdrawal: {
          create: values.transfers.map((item) => ({
            userCode: item.userCode,
            amount: item.amount,
          })),
        },
      };
      // Create client and return the result with vodafoneCash included
      return db.client.create({
        include: {
          InstaPayWithdrawal: true,
        },
        data: ClientData,
      });
    });

    return {
      status: 200,
      message: "Done, Transaction has been submitted successfully",
    };
  } catch (error) {
    console.log("Error updating Instapay deposit:", error);
    return {
      status: 500,
      message: "Failed to update Instapay deposit",
      error: error,
    };
  }
};
