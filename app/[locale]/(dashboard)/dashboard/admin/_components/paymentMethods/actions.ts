"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  addPaymentMethodProps,
  updatePaymentMethodProps,
  updatePaymentMethodsUserListProps,
} from "@/lib/types";

export async function fetchPaymentMethods() {
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

    const paymentMethods = await db.paymentMethod.findMany();

    if (!paymentMethods.length) {
      return {
        status: 404,
        message: "No Payment Methods Found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Payment Methods Fetched Successfully",
      data: paymentMethods,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function addPaymentMethod({
  inputValues,
  updatedImage,
}: addPaymentMethodProps) {
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

    await db.paymentMethod.create({
      data: {
        image: updatedImage,
        name: inputValues.name,
        content: inputValues.content,
        sub: inputValues.name.toLowerCase().replace(/\s+/g, ""),
      },
    });

    return {
      status: 200,
      message: "Payment Method Added Successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function deletePaymentMethod({ id }: { id: string }) {
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

    await db.paymentMethod.delete({
      where: {
        id,
      },
    });

    return {
      status: 200,
      message: "Payment Method Deleted Successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function updatePaymentMethod({
  inputValues,
  updatedImage,
  id,
}: updatePaymentMethodProps) {
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

    if (updatedImage) {
      await db.paymentMethod.update({
        where: {
          id,
        },
        data: {
          name: inputValues.name,
          content: inputValues.content,
          image: updatedImage,
        },
      });
    } else {
      await db.paymentMethod.update({
        where: {
          id,
        },
        data: {
          name: inputValues.name,
          content: inputValues.content,
        },
      });
    }
    return {
      status: 200,
      message: "Payment Method Updated Successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function updatePaymentMethodsUserList({
  selectedPaymentMethodId,
  userId,
  action,
}: updatePaymentMethodsUserListProps) {
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

    if (action === "connect") {
      await db.user.update({
        where: { id: userId },
        data: {
          paymentMethods: {
            connect: { id: selectedPaymentMethodId },
          },
        },
      });
    } else if (action === "disconnect") {
      await db.user.update({
        where: { id: userId },
        data: {
          paymentMethods: {
            disconnect: { id: selectedPaymentMethodId },
          },
        },
      });
    }

    return {
      status: 200,
      message: "User Updated Successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}
