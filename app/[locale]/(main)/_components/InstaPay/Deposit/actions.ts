"use server";

import { db } from "@/lib/db";
import { LocalStorageData } from "@/lib/types";
import { TransactionStatus } from "@prisma/client";
import crypto from "crypto";

export const updateUserCode = async (decryptedData: LocalStorageData) => {
  try {
    if (!decryptedData) {
      throw new Error("Decrypted data is required");
    }

    if (decryptedData.uploadedImage.length === 0) {
      throw new Error("You have to complete uploading all the documents");
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

    const updatedClient = await db.client.update({
      where: {
        transactionCode: decryptedData.transactionCode,
      },
      include: {
        InstaPay: true,
      },
      data: {
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        imageUrl: decryptedData.uploadedImage,
        transactionStatus: TransactionStatus.Pending,
        InstaPay: {
          update: {
            qrCodeImage: decryptedData.uploadedImage[0],
          },
        },
      },
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

export const createUserCode = async (decryptedData: LocalStorageData) => {
  try {
    if (!decryptedData) {
      throw new Error("Decrypted data is required");
    }

    if (!decryptedData.uploadedImage[0]) {
      throw new Error("The uploaded image URL is missing or invalid.");
    }

    const transactionCode = crypto.randomInt(100_000, 1_000_000).toString();

    await db.client.create({
      data: {
        fullName: decryptedData.fullName,
        email: decryptedData.email,
        phoneNumber: decryptedData.phoneNumber,
        amount: Number(decryptedData.amount),
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        imageUrl: decryptedData.uploadedImage,
        transactionStatus: TransactionStatus.Pending,
        transactionCode: transactionCode,
        InstaPay: {
          create: {
            qrCodeImage: decryptedData.uploadedImage[0],
          },
        },
      },
    });

    return {
      status: 200,
      message: "Done, Transaction has been submitted successfully",
    };
  } catch (error) {
    console.error("Error updating Instapay deposit:", error);
    return {
      status: 500,
      message: "Failed to update Instapay deposit",
      error: error,
    };
  }
};

export const updateUserName = async (decryptedData: LocalStorageData) => {
  try {
    if (!decryptedData) {
      throw new Error("Decrypted data is required");
    }

    if (decryptedData.uploadedImage.length === 0) {
      throw new Error("You have to complete uploading all the documents");
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

    const updatedClient = await db.client.update({
      where: {
        transactionCode: decryptedData.transactionCode,
      },
      include: {
        InstaPay: true,
      },
      data: {
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        imageUrl: decryptedData.uploadedImage,
        transactionStatus: TransactionStatus.Pending,
        InstaPay: {
          create: {
            userNumberImage: decryptedData.uploadedImage[0],
          },
        },
      },
    });

    return {
      status: 200,
      message: "Done, Transaction has been submitted successfully",
      return_url: updatedClient.return_url,
    };
  } catch (error) {
    console.error("Error updating Instapay deposit:", error);
    return {
      status: 500,
      message: "Failed to update Instapay deposit",
      error: error,
    };
  }
};

export const createUserName = async (decryptedData: LocalStorageData) => {
  try {
    if (!decryptedData) {
      throw new Error("Decrypted data is required");
    }

    if (decryptedData.uploadedImage.length === 0) {
      throw new Error("You have to complete uploading all the documents");
    }

    const transactionCode = crypto.randomInt(100_000, 1_000_000).toString();

    await db.client.create({
      include: {
        InstaPay: true,
      },
      data: {
        fullName: decryptedData.fullName,
        email: decryptedData.email,
        phoneNumber: decryptedData.phoneNumber,
        amount: Number(decryptedData.amount),
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        imageUrl: decryptedData.uploadedImage,
        transactionStatus: TransactionStatus.Pending,
        transactionCode: transactionCode,
        InstaPay: {
          create: {
            userNumberImage: decryptedData.uploadedImage[0],
          },
        },
      },
    });

    return {
      status: 200,
      message: "Done, Transaction has been submitted successfully",
    };
  } catch (error) {
    console.error("Error updating Instapay deposit:", error);
    return {
      status: 500,
      message: "Failed to update Instapay deposit",
      error: error,
    };
  }
};
