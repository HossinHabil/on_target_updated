"use server";

import { db } from "@/lib/db";
import { BankTransferWithdrawalProps, LocalStorageData } from "@/lib/types";
import { TransactionStatus } from "@prisma/client";
import crypto from "crypto";

export const updateBankTransferDeposit = async (
  decryptedData: LocalStorageData
) => {
  try {
    const updatedClient = await db.client.update({
      where: {
        transactionCode: decryptedData.transactionCode,
      },
      include: {
        bankTransfer: true,
      },
      data: {
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        imageUrl: decryptedData.uploadedImage,
        transactionStatus: TransactionStatus.Pending,
      },
    });

    return {
      status: 200,
      message: "Done, Transaction has been submitted successfully",
      return_url: updatedClient.return_url,
    };
  } catch (error) {
    console.error("Error updating Vodafone deposit:", error);
    return {
      status: 500,
      message: "Failed to update Vodafone deposit",
      error: error,
    };
  }
};

export const createBankTransferDeposit = async (
  decryptedData: LocalStorageData
) => {
  try {
    if (!decryptedData) {
      throw new Error("Decrypted data is required");
    }

    const transactionCode = crypto.randomInt(100_000, 1_000_000).toString();

    await db.client.create({
      include: {
        bankTransfer: true,
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
        bankTransfer: {
          create: {},
        },
      },
    });

    return {
      status: 200,
      message: "Done, Transaction has been submitted successfully",
    };
  } catch (error) {
    console.error("Error updating Vodafone deposit:", error);
    return {
      status: 500,
      message: "Failed to update Vodafone deposit",
      error: error,
    };
  }
};

export const updateBankTransferWithdrawal = async ({
  decryptedData,
  values,
}: BankTransferWithdrawalProps) => {
  try {
    const updatedClient = await db.client.update({
      where: {
        transactionCode: decryptedData.transactionCode,
      },
      include: {
        BankTransferWithdrawal: true,
      },
      data: {
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        imageUrl: decryptedData.uploadedImage,
        transactionStatus: TransactionStatus.Pending,
        BankTransferWithdrawal: {
          create: {
            accountHolder: values.accountHolder,
            accountNumber: values.accountNumber,
            bankName: values.bankName,
            branchCode: values.branchCode,
            branchName: values.branchName,
            ibanNumber: values.ibanAccountNumber,
            swiftCode: values.swiftCode,
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
    console.error("Error updating Vodafone deposit:", error);
    return {
      status: 500,
      message: "Failed to update Vodafone deposit",
      error: error,
    };
  }
};

export const createBankTransferWithdrawal = async ({
  decryptedData,
  values,
}: BankTransferWithdrawalProps) => {
  try {
    const transactionCode = crypto.randomInt(100_000, 1_000_000).toString();

    const newClient = await db.client.create({
      include: {
        BankTransferWithdrawal: true,
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
        BankTransferWithdrawal: {
          create: {
            accountHolder: values.accountHolder,
            accountNumber: values.accountNumber,
            bankName: values.bankName,
            branchCode: values.branchCode,
            branchName: values.branchName,
            ibanNumber: values.ibanAccountNumber,
            swiftCode: values.swiftCode,
          },
        },
      },
    });

    return {
      status: 200,
      message: "Done, Transaction has been submitted successfully",
    };
  } catch (error) {
    console.error("Error updating Vodafone deposit:", error);
    return {
      status: 500,
      message: "Failed to update Vodafone deposit",
      error: error,
    };
  }
};
