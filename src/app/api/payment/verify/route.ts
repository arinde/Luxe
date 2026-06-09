import { NextRequest, NextResponse } from "next/server";

interface ISWTransactionResponse {
  Amount?: number;
  amount?: number;
  ResponseCode?: string;
  responseCode?: string;
  ResponseDescription?: string;
  responseDescription?: string;
  MerchantReference?: string;
  PaymentReference?: string;
  TransactionDate?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const txnRef = searchParams.get("txnRef");
  const amount = searchParams.get("amount");

  if (!txnRef || !amount) {
    return NextResponse.json(
      { error: "txnRef and amount are required" },
      { status: 400 }
    );
  }

  try {
    const requeryRes = await fetch(
      `${process.env.ISW_REQUERY_BASE_URL}/collections/api/v1/gettransaction.json` +
        `?merchantcode=${process.env.ISW_MERCHANT_CODE}` +
        `&transactionreference=${txnRef}` +
        `&amount=${amount}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!requeryRes.ok) {
      return NextResponse.json(
        { error: "Requery request failed" },
        { status: 502 }
      );
    }

    const rawText = await requeryRes.text();
    const data: ISWTransactionResponse = rawText ? JSON.parse(rawText) : {};

    const responseCode = data.ResponseCode ?? data.responseCode ?? "XX";
    const responseDescription =
      data.ResponseDescription ?? data.responseDescription ?? "Unknown";
    const returnedAmount = data.Amount ?? data.amount ?? 0;

    const isSuccess =
      responseCode === "00" ||
      (process.env.NEXT_PUBLIC_ISW_MODE === "TEST" && responseCode === "Z1");

    let status: "success" | "failed" | "cancelled";
    if (isSuccess) {
      status = "success";
    } else if (responseCode === "09" || responseCode === "021") {
      status = "cancelled";
    } else {
      status = "failed";
    }

    return NextResponse.json({
      status,
      txnRef,
      amount: returnedAmount,
      responseCode,
      message: responseDescription,
    });
  } catch (err) {
    console.error("Verify route error:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        status: "failed",
        responseCode: "XX",
        message: "Network error during verification",
      },
      { status: 500 }
    );
  }
}
