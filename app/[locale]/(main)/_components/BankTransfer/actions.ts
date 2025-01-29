"use server";

import { db } from "@/lib/db";
import { BankTransferWithdrawalProps, LocalStorageData } from "@/lib/types";
import { newRegistrationEmailTemplate } from "@/templates/english/newRegistrationEmailTemplate";
import { newClientEn } from "@/templates/english/transactionPending";
import sendEmail from "@/utils/sendEmail";
import { TransactionStatus } from "@prisma/client";
import crypto from "crypto";
import { getLocale } from "next-intl/server";

export const updateBankTransferDeposit = async (
  decryptedData: LocalStorageData
) => {
  try {
    const locale = await getLocale();

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

    if (!updatedClient.email) {
      throw new Error(
        `Client with transactionCode ${decryptedData.transactionCode} not found`
      );
    }

    await sendEmail({
      from: "mail@ontarget.exchange",
      toAdmin: "ontargetnoti@outlook.com",
      toClient: updatedClient.email,
      subjectAdmin: `New Vodafone Client Registration`,
      subjectClient: `${
        locale === "en"
          ? "Payment Pending – We’re On It"
          : "دفعتك قيد الانتظار - نحن نعمل على ذلك"
      }`,
      bodyAdmin: newRegistrationEmailTemplate({
        decryptedData,
        transactionCode: decryptedData.transactionCode,
      }),
      bodyClient: `${
        locale === "en"
          ? newClientEn(updatedClient)
          : newClientEn(updatedClient)
      }`,
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

    const locale = await getLocale();

    const transactionCode = crypto.randomInt(100_000, 1_000_000).toString();

    const newClient = await db.client.create({
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

    if (!newClient.email) {
      throw new Error(
        `Client with transactionCode ${decryptedData.transactionCode} not found`
      );
    }

    await sendEmail({
      from: "mail@ontarget.exchange",
      toAdmin: "ontargetnoti@outlook.com",
      toClient: newClient.email,
      subjectAdmin: `New Vodafone Client Registration`,
      subjectClient: `${
        locale === "en"
          ? "Payment Pending – We’re On It"
          : "دفعتك قيد الانتظار - نحن نعمل على ذلك"
      }`,
      bodyAdmin: newRegistrationEmailTemplate({
        decryptedData,
        transactionCode,
      }),
      bodyClient: `${
        locale === "en" ? newClientEn(newClient) : newClientEn(newClient)
      }`,
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
    const locale = await getLocale();
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

    if (!updatedClient.email) {
      throw new Error(
        `Client with transactionCode ${decryptedData.transactionCode} not found`
      );
    }

    await sendEmail({
      from: "mail@ontarget.exchange",
      toAdmin: "ontargetnoti@outlook.com",
      toClient: updatedClient.email,
      subjectAdmin: `New Vodafone Client Registration`,
      subjectClient: `${
        locale === "en"
          ? "Payment Pending – We’re On It"
          : "دفعتك قيد الانتظار - نحن نعمل على ذلك"
      }`,
      bodyAdmin: newRegistrationEmailTemplate({
        decryptedData,
        transactionCode: decryptedData.transactionCode,
      }),
      bodyClient: `${
        locale === "en"
          ? newClientEn(updatedClient)
          : newClientEn(updatedClient)
      }`,
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
    const locale = await getLocale();
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

    if (!newClient.email) {
      throw new Error(
        `Client with transactionCode ${decryptedData.transactionCode} not found`
      );
    }

    await sendEmail({
      from: "mail@ontarget.exchange",
      toAdmin: "ontargetnoti@outlook.com",
      toClient: newClient.email,
      subjectAdmin: `New Vodafone Client Registration`,
      subjectClient: `${
        locale === "en"
          ? "Payment Pending – We’re On It"
          : "دفعتك قيد الانتظار - نحن نعمل على ذلك"
      }`,
      bodyAdmin: newRegistrationEmailTemplate({
        decryptedData,
        transactionCode,
      }),
      bodyClient: `${
        locale === "en" ? newClientEn(newClient) : newClientEn(newClient)
      }`,
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
