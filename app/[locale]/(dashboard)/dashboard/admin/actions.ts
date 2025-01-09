"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export const fetchUsers = async () => {
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

    const users = await db.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
        image: true,
        id: true,
      },
    });

    if (!users.length) {
      return {
        status: 404,
        message: "No Users Found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Users fetched successfully",
      data: users,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
      error,
    };
  }
};

export const updateUserRole = async ({
  id,
  role,
}: {
  id: string;
  role: Role;
}) => {
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
        message: "Not Authorized",
        data: null,
      };
    }

    await db.user.update({
      where: {
        id: id,
      },
      data: {
        role,
      },
    });
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
      error,
    };
  }
};

export const fetchClients = async ({}) => {
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

    const clients = await db.client.findMany({
      include: {
        bankTransfer: true,
        BankTransferWithdrawal: true,
        InstaPay: true,
        InstaPayWithdrawal: true,
        fawryPay: true,
        VodafoneWithdrawal: true,
      },
    });

    if (!clients.length) {
      return {
        status: 404,
        message: "No Clients Found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Clients fetched successfully",
      data: clients,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
      error,
    };
  }
};
