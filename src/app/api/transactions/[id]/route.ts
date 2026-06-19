import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single transaction by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const transaction = await sanityClient.fetch(
      `*[_type == "transaction" && _id == $id][0]`,
      { id }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (err) {
    console.error("Fetch transaction error:", err);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

// DELETE individual transaction by ID
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    await sanityClient.delete(id);

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    console.error("Delete transaction error:", err);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
