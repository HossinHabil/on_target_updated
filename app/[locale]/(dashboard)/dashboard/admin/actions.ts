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
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        paymentMethods: true,
      },
      orderBy: {
        createdAt: "desc",
      }
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
      };
    }

    if (session.user.role !== "Admin") {
      return {
        status: 403,
        message: "Not Authorized",
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

    return {
      status: 200,
      message: "Role updated successfully"
    }
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

export const deleteClient = async ({id}: {id: string}) => {
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
        message: "Not Authorized",
      };
    }

    await db.client.delete({
      where: {
        id
      }
    });

    return {
      status: 200,
      message: "Client was deleted successfully"
    }
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    }
  }
}

export const declineClient = async ({id, declineReason}: {id: string, declineReason: string}) => {
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
        message: "Not Authorized",
      };
    }

    await db.client.update({
      where: {
        id,
      },
      data: {
        transactionStatus: "Declined",
        declineReason,
      },
    });

    return {
      status: 200,
      message: "Transaction status has been updated successfully"
    }
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    }
  }
}

export const approveClient = async ({id,}: {id: string}) => {
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
        message: "Not Authorized",
      };
    }

    await db.client.update({
      where: {
        id,
      },
      data: {
        transactionStatus: "Completed",
      }
    });

    return {
      status: 200,
      message: "Transaction status has been updated successfully"
    }
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    }
  }
}

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
      orderBy: {
        createdAt: "desc",
      }
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

export const deleteUser = async ({id}: {id: string}) => {
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
        message: "Not Authorized",
      };
    }

    await db.user.delete({
      where: {
        id
      }
    });

    return {
      status: 200,
      message: "User was deleted successfully"
    }
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    }
  }
}
