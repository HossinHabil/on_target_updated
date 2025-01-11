import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { transaction_id } = await req.json();

    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json({ message: "Missing API KEY" }, { status: 402 });
    }

    const apiKeyDb = await db.user.findUnique({
      where: {
        api_key: apiKey,
      },
    });

    if (!apiKeyDb?.api_key) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!transaction_id) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    const client = await db.client.findUnique({
      where: {
        transactionCode: transaction_id,
      },
    });

    if (!client) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        data: {
          transactionStatus: client.transactionStatus,
          paymentMethod: client.paymentMethodName || "No Payment Method",
          declineReason: client.declineReason || "No Reason",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
