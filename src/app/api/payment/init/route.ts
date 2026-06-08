import { NextRequest, NextResponse } from "next/server";
import { generateTxnRef } from "@/lib/generateTxnRef";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, customerEmail, customerName, customerPhone } = body;

        if (!amount || !customerEmail || !customerName || !customerPhone) {
            return NextResponse.json(
                { error: "Missing required fields" },
                {status: 400 }
            );
        }

        const txnRef = generateTxnRef(amount);

        return NextResponse.json({
            txnRef,
            amount,
            merchantCode: process.env.ISW_MERCHANT_CODE,
            payItemId: process.env.ISW_PAY_ITEM_ID,
            currency: 566,
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/status`,
            customerEmail,
            customerName,
            customerPhone,
        });
    } catch {
        return NextResponse.json(
            {error: " Failed to initialize payments"},
            {status: 500}
        )
    }
}