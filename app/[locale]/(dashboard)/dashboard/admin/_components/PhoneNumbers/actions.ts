"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AddNewVodafonePhoneNumber } from "@/lib/types";
import { Vodafone } from "@prisma/client";

export const fetchVodafoneNumbers = async () => {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        status: 401,
        message: "Not Authorized",
        data: null,
      };
    }

    if (session.user.role !== "Admin") {
      return {
        status: 403,
        message: "Forbidden",
        data: null,
      };
    }

    const vodafoneNumbers = await db.vodafone.findMany();

    if (!vodafoneNumbers.length) {
      return {
        status: 404,
        message: "No Vodafone Numbers Found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Vodafone Phone Number fetched successfully",
      data: vodafoneNumbers,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
      error,
    };
  }
};

export const submitVodafoneNumber = async ({phoneHolder, phoneNumber}: AddNewVodafonePhoneNumber) => {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        status: 401,
        message: "Not Authorized",
      };
    }

    if (session.user.role !== "Admin") {
      return {
        status: 403,
        message: "Forbidden",
      };
    }

    await db.vodafone.create({
      data: {
        phoneHolder,
        phoneNumber,
        initialAmount: 6000,
        monthlyAmount: 0,
        totalAmount: 0,
      }
    })

    return {
      status: 200,
      message: "Vodafone number has been submited successfully",
    }
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
      error,
    };
  }
};
export const deleteVodafonePhoneNumber = async ({id}: Vodafone) => {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        status: 401,
        message: "Not Authorized",
      };
    }

    if (session.user.role !== "Admin") {
      return {
        status: 403,
        message: "Forbidden",
      };
    }

    await db.vodafone.delete({
      where: {
        id
      }
    })

    return {
      status: 200,
      message: "Vodafone number has been deleted successfully",
    }
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
      error,
    };
  }
};
