import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const currentData = new Date();
  const nowUTC = new Date(currentData.toISOString());
  const thresholdTime = new Date(nowUTC.getTime() - 1 * 60 * 1000);
  try {
    const result = await db.vodafone.updateMany({
      where: {
        reserved: true,
        reservedAt: {
          lt: thresholdTime.toISOString(),
        },
      },
      data: {
        initialAmount: 60000,
        reserved: false,
        reservedAt: null,
        monthlyAmount: 0,
        monthlyLimit: false,
      },
    });
    if (result.count === 0) {
      return NextResponse.json(
        {
          message: `Nothing has been updated and result is ${result.count} and the Date now is ${currentData} and the Threshold Time is ${thresholdTime} and URC TIME IS: ${nowUTC}`,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          message: `result is ${result.count} and the Date now is ${currentData} and the Threshold Time is ${thresholdTime} and URC TIME IS: ${nowUTC}`,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Did not work" }, { status: 500 });
  }
}
