"use server";

import { db } from "@/lib/db";
import {
  VodafoneNumbersDepositProps,
  VodafoneNumbersWithdrawalProps,
  vodafonePhoneNumber,
  vodafonePhoneNumberSelect,
} from "@/lib/types";
import crypto from "crypto";
import { ClientUploadedFileData } from "uploadthing/types";
import { UTApi } from "uploadthing/server";
import { TransactionStatus } from "@prisma/client";
import { getLocale } from "next-intl/server";
import { newClientEn } from "@/templates/english/transactionPending";
import sendEmail from "@/utils/sendEmail";
import { newRegistrationEmailTemplate } from "@/templates/english/newRegistrationEmailTemplate";

const utapi = new UTApi();

export const fetchPhoneNumbers = async (fetchedAmount: number) => {
  const totalAmount = fetchedAmount;
  const count = Math.ceil(fetchedAmount / 60000);
  const remainderAmount = totalAmount - (count - 1) * 60000;
  const fetchedNumbers: vodafonePhoneNumber[] = [];
  const fetchedPhoneNumbers = new Set<string>();

  const isDuplicate = (
    array: vodafonePhoneNumber[],
    obj: vodafonePhoneNumber,
    property: keyof typeof obj
  ) => {
    return array.some((item) => item[property] === obj[property]);
  };

  try {
    // Fetch the initial batch of phone numbers
    const vodafoneFetchedNumber = await db.vodafone.findMany({
      where: {
        initialAmount: 60000,
        reserved: false,
        monthlyLimit: false,
      },
      select: vodafonePhoneNumberSelect,
      take: count - 1,
    });

    vodafoneFetchedNumber.forEach((num) =>
      fetchedPhoneNumbers.add(num.phoneNumber)
    );
    fetchedNumbers.push(...vodafoneFetchedNumber);

    // Fetch additional numbers if needed
    if (fetchedNumbers.length < count) {
      // Extract phone numbers from the existing array
      const existingNumbers = vodafoneFetchedNumber.map(
        (item) => item.phoneNumber
      );

      // First fetch the numbers with initialAmount < 60000
      let vodafoneFetchedUsedNumber = await db.vodafone.findMany({
        where: {
          initialAmount: { lt: 60000, gte: remainderAmount },
          reserved: false,
          monthlyLimit: false,
        },
        select: vodafonePhoneNumberSelect,
      });

      if (vodafoneFetchedUsedNumber.length > 0) {
        for (let i = 0; i < vodafoneFetchedUsedNumber.length; i++) {
          const findClosestBiggerNumber = (
            arr: { phoneNumber: string; initialAmount: number; id: string }[],
            target: number
          ): {
            phoneNumber: string;
            initialAmount: number;
            id: string;
          } | null => {
            // Filter out numbers greater than or equal to the target
            const filteredArr = arr.filter(
              (item) => item.initialAmount >= target
            );
            // If there are no numbers greater than or equal to the target, return null
            if (filteredArr.length === 0) {
              return null;
            }
            filteredArr.sort((a, b) => a.initialAmount - b.initialAmount);
            return filteredArr[0];
          };
          const closestBiggerObject = findClosestBiggerNumber(
            vodafoneFetchedUsedNumber,
            remainderAmount
          );
          if (closestBiggerObject) {
            if (
              !isDuplicate(fetchedNumbers, closestBiggerObject, "phoneNumber")
            ) {
              fetchedNumbers.push(closestBiggerObject);
            }
          } else {
            console.log("No number greater than or equal to the target found.");
          }
        }
      }

      // If no numbers are found after filtering, fetch numbers with initialAmount === 60000
      if (vodafoneFetchedUsedNumber.length === 0) {
        let secondaryFetch = await db.vodafone.findMany({
          where: {
            initialAmount: 60000,
            reserved: false,
            monthlyLimit: false,
          },
          select: vodafonePhoneNumberSelect,
        });
        // Filter the secondary fetch results as well
        secondaryFetch = secondaryFetch.filter(
          (item) => !existingNumbers.includes(item.phoneNumber)
        );

        // Merge the results
        vodafoneFetchedUsedNumber =
          vodafoneFetchedUsedNumber.concat(secondaryFetch);
      }

      for (
        let i = 0;
        i < vodafoneFetchedUsedNumber.length && fetchedNumbers.length < count;
        i++
      ) {
        const currentNumber = vodafoneFetchedUsedNumber[i];
        if (!fetchedPhoneNumbers.has(currentNumber.phoneNumber)) {
          fetchedPhoneNumbers.add(currentNumber.phoneNumber);
          fetchedNumbers.push(currentNumber);
        }
      }
    }

    // Fetch any remaining numbers to meet the count
    while (fetchedNumbers.length < count) {
      const additionalNumbers = await db.vodafone.findMany({
        where: {
          reserved: false,
          monthlyLimit: false,
        },
        select: vodafonePhoneNumberSelect,
        take: count - fetchedNumbers.length,
      });

      additionalNumbers.forEach((num) => {
        if (!fetchedPhoneNumbers.has(num.phoneNumber)) {
          fetchedPhoneNumbers.add(num.phoneNumber);
          fetchedNumbers.push(num);
        }
      });

      // If no more unique numbers can be fetched, break to avoid infinite loop
      if (additionalNumbers.length === 0) {
        break;
      }
    }
  } catch (error) {
    throw error;
  } finally {
    if (fetchedNumbers.length === count) {
      const updateNumbers = fetchedNumbers.map((item) =>
        db.vodafone.update({
          where: { id: item.id },
          data: {
            reserved: true,
            reservedAt: new Date(),
          },
        })
      );
      await Promise.all(updateNumbers);
    }
    await db.$disconnect();
  }
  return {
    fetchedNumbers,
    remainderAmount,
  };
};

export const updateReservedVodafoneNumbers = async (
  values: vodafonePhoneNumber[]
) => {
  try {
    const updatePromises = values.map((item) =>
      db.vodafone.updateMany({
        where: {
          id: item.id,
        },
        data: {
          reserved: false,
          reservedAt: null,
        },
      })
    );

    await Promise.all(updatePromises);
    return { status: 200, message: "Vodafone numbers have been updated" };
  } catch (error) {
    console.error("Error updating numbers:", error);
  }
};

export const handleUploadImage = async (
  result: ClientUploadedFileData<{ uploadedUrl: string }>[]
): Promise<string> => {
  try {
    const uploadedUrl = result[0].url;

    return uploadedUrl;
  } catch (error) {
    console.error("Error handling uploaded image:", error);
    throw error;
  }
};

export const handleDeleteImage = async (imageUrl: string) => {
  try {
    const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

    await utapi.deleteFiles(fileName);

    return imageUrl;
  } catch (error) {
    console.error("Error handling uploaded image:", error);
    throw error;
  }
};

export const updateVodafoneDeposit = async ({
  decryptedData,
  phoneNumbersArray,
  remainderAmount,
}: VodafoneNumbersDepositProps) => {
  try {
    if (!phoneNumbersArray || phoneNumbersArray.length === 0) {
      throw new Error("Phone numbers array is required and cannot be empty");
    }

    const locale = await getLocale();

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

    const updatedClient = await db.$transaction(async (tx) => {
      const client = await tx.client.update({
        where: {
          transactionCode: decryptedData.transactionCode,
        },
        data: {
          imageUrl: decryptedData.uploadedImage,
          paymentMethodName: decryptedData.paymentMethodName,
          transactionStatus: TransactionStatus.Pending,
        },
      });

      for (let i = 0; i < phoneNumbersArray.length; i++) {
        const item = phoneNumbersArray[i];
        const isLastItem = i === phoneNumbersArray.length - 1;
        const amountToUse = isLastItem
          ? Number(remainderAmount.toFixed(0))
          : item.initialAmount;
        await tx.vodafone.updateMany({
          where: {
            id: item.id,
          },
          data: {
            initialAmount: {
              decrement: amountToUse,
            },
            monthlyAmount: {
              increment: amountToUse,
            },
            totalAmount: {
              increment: amountToUse,
            },
            reserved: false,
          },
        });
      }

      return client;
    });

    if (!updatedClient.email) {
      throw new Error(
        `Client with transactionCode ${decryptedData.transactionCode} not found`
      );
    }

    await sendEmail({
      from: "mail@ontarget.exchange",
      toAdmin: "on-target-eg@outlook.com",
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
      return_url: existingClient.return_url,
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

export const createVodafoneDeposit = async ({
  decryptedData,
  phoneNumbersArray,
  remainderAmount,
}: VodafoneNumbersDepositProps) => {
  try {
    if (!decryptedData) {
      throw new Error("Decrypted data is required");
    }

    if (!phoneNumbersArray || phoneNumbersArray.length === 0) {
      throw new Error("Phone numbers array is required and cannot be empty");
    }

    const locale = await getLocale();

    const transactionCode = crypto.randomInt(100_000, 1_000_000).toString();

    const newClient = await db.$transaction(async (tx) => {
      const createdClient = await tx.client.create({
        data: {
          fullName: decryptedData.fullName,
          email: decryptedData.email,
          phoneNumber: decryptedData.phoneNumber,
          amount: Number(decryptedData.amount),
          paymentMethodName: decryptedData.paymentMethodName,
          transactionAction: decryptedData.transactionAction,
          transactionCode,
          imageUrl: decryptedData.uploadedImage,
          transactionStatus: TransactionStatus.Pending,
          language: locale,
        },
      });

      for (let i = 0; i < phoneNumbersArray.length; i++) {
        const item = phoneNumbersArray[i];
        const isLastItem = i === phoneNumbersArray.length - 1;
        const amountToUse = isLastItem
          ? Number(remainderAmount.toFixed(0))
          : item.initialAmount;
        await tx.vodafone.updateMany({
          where: {
            id: item.id,
          },
          data: {
            initialAmount: {
              decrement: amountToUse,
            },
            monthlyAmount: {
              increment: amountToUse,
            },
            totalAmount: {
              increment: amountToUse,
            },
            reserved: false,
          },
        });
      }

      return createdClient;
    });

    if (!newClient.email) {
      throw new Error(
        `Client with transactionCode ${decryptedData.transactionCode} not found`
      );
    }

    await sendEmail({
      from: "mail@ontarget.exchange",
      toAdmin: "on-target-eg@outlook.com",
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
    console.error("Error creating Vodafone deposit:", error);

    return {
      status: 500,
      message: "Failed to create Vodafone deposit",
      error: error,
    };
  }
};

export const updateVodafoneWithdrawal = async ({
  decryptedData,
  values,
}: VodafoneNumbersWithdrawalProps) => {
  try {
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

    const transferAmounts = values.transfers.map((transfer) => ({
      phoneNumber: transfer.phoneNumber,
      amount: Number(transfer.amount),
    }));

    const totalAmount = transferAmounts.reduce(
      (sum, transfer) => sum + transfer.amount,
      0
    );

    const locale = await getLocale();

    const clientData = {
      amount: totalAmount,
      paymentMethodName: decryptedData.paymentMethodName,
      transactionAction: decryptedData.transactionAction,
      transactionCode: decryptedData.transactionCode as string,
      transactionStatus: TransactionStatus.Pending,
      language: locale,
      VodafoneWithdrawal: { create: transferAmounts },
    };

    const updatedClient = await db.client.update({
      where: {
        transactionCode: decryptedData.transactionCode,
      },
      include: {
        VodafoneWithdrawal: true,
      },
      data: clientData,
    });

    if (!updatedClient.email) {
      throw new Error(
        `Client with transactionCode ${decryptedData.transactionCode} not found`
      );
    }

    await sendEmail({
      from: "mail@ontarget.exchange",
      toAdmin: "on-target-eg@outlook.com",
      toClient: updatedClient.email,
      subjectAdmin: `New Vodafone Client Registration`,
      subjectClient: `${
        locale === "en"
          ? "Payment Pending – We’re On It"
          : "دفعتك قيد الانتظار - نحن نعمل على ذلك"
      }`,
      bodyAdmin: newRegistrationEmailTemplate({
        decryptedData,
        transactionCode: clientData.transactionCode,
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
      return_url: existingClient.return_url,
    };
  } catch (error) {
    console.error("Error updating Vodafone withdrawal:", error);
    return {
      status: 500,
      message: "Failed to update Vodafone withdrawal",
      error: error,
    };
  }
};

export const createVodafoneWithdrawal = async ({
  decryptedData,
  values,
}: VodafoneNumbersWithdrawalProps) => {
  try {
    const locale = await getLocale();

    const transactionCode = crypto.randomInt(100_000, 1_000_000).toString();

    const newClient = await db.$transaction(async (prisma) => {
      const clientData = {
        fullName: decryptedData?.fullName,
        email: decryptedData.email,
        phoneNumber: decryptedData.phoneNumber,
        amount: Number(decryptedData.amount),
        paymentMethodName: decryptedData.paymentMethodName,
        transactionAction: decryptedData.transactionAction,
        transactionStatus: TransactionStatus.Pending,
        transactionCode,
        imageUrl: [],
        language: locale,
        VodafoneWithdrawal: {
          create: values.transfers.map((transfer) => ({
            phoneNumber: transfer.phoneNumber,
            amount: Number(transfer.amount),
          })),
        },
      };

      return prisma.client.create({
        include: { VodafoneWithdrawal: true },
        data: clientData,
      });
    });

    if (!newClient.email) {
      throw new Error(
        `Client with transactionCode ${decryptedData.transactionCode} not found`
      );
    }

    await sendEmail({
      from: "mail@ontarget.exchange",
      toAdmin: "on-target-eg@outlook.com",
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
    console.error("Error creating Vodafone withdrawal:", error);
    return {
      status: 500,
      message: "Failed to create Vodafone withdrawal",
      error: error,
    };
  }
};
