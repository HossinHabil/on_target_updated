import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { TransactionStatus } from "@prisma/client";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const {
      transaction_id,
      client_id,
      fullName,
      email,
      phone_number,
      transaction_type,
      amount,
      company_name,
      callback,
      return_url,
    } = await req.json();

    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json({ message: "Missing API KEY" }, { status: 402 });
    }

    // check if the apiKey is associated with an account

    const apiKeyDb = await db.user.findUnique({
      where: {
        api_key: apiKey,
      },
    });

    if (!apiKeyDb?.api_key) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (
      !transaction_id ||
      !client_id ||
      !fullName ||
      !phone_number ||
      !transaction_type ||
      !amount ||
      !company_name
    ) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    const existingTransaction = await db.client.findUnique({
      where: {
        transactionCode: transaction_id,
      },
    });

    // Store the transaction in the database
    if (!existingTransaction) {
      await db.client.create({
        data: {
          fullName,
          email,
          phoneNumber: phone_number,
          company_name,
          amount,
          transactionAction: transaction_type,
          transactionCode: transaction_id,
          transactionStatus: TransactionStatus.Pending,
          client_id,
          callback,
          return_url,
          paymentMethodName: "",
          imageUrl: [],
          userId: apiKeyDb.id,
        },
      });

      return NextResponse.json({
        // redirectUrl: `https://www.ontarget.exchange/steps/4?id=${transaction_id}`,
        redirectUrl: `http://localhost:3000/steps/4?id=${transaction_id}`,
      });
    }

    if (existingTransaction?.transactionStatus === "Completed") {
      return NextResponse.json(
        { message: "Transaction has been completed" },
        { status: 409 }
      );
    } else {
      return NextResponse.json({
        redirectUrl: `https://www.ontarget.exchange/en/steps/4?id=${existingTransaction?.transactionCode}`,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
