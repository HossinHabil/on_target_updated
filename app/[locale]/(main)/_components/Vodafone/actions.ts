"use server";

import { db } from "@/lib/db";
import { vodafonePhoneNumber, vodafonePhoneNumberSelect } from "@/lib/types";
import { ClientUploadedFileData } from "uploadthing/types";
import { UTApi } from "uploadthing/server";

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
