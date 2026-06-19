import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export async function POST(req: NextRequest){
    try{

        const body = await req.json()
        const { txnRef, amount, status, responseCode, message, completedAt } = body
        
        if(!txnRef || !amount || !status){
            return NextResponse.json(
                {error: 'Missing required data to save transacation'},
                {status: 400}
            )
        }
        
       
        const doc = await sanityClient.create({
        _type: "transaction",
        txnRef: txnRef,
        amount: amount,
        status: status,
        responseCode: responseCode,
        message: message,
        completedAt: completedAt
        
        })

         return NextResponse.json({
            doc, success: true
       })
    } catch(err) {
        console.error("Save transaction error:", err);
        return NextResponse.json(
             {error: " Failed to Save Transactions"},
            {status: 500}
        )
       
    }
}

export async function GET(req: NextRequest) {

    try {
    const transactions = await sanityClient.fetch(`
      *[_type == "transaction"] | order(_createdAt desc)
    `);

    return NextResponse.json({
      success: true,
      transactions,
    });
  } catch (err) {
    console.error("Fetch transactions error:", err);

    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
    
}

// DELETE all transactions
export async function DELETE(req: NextRequest) {
  try {
    // Fetch all transaction IDs
    const transactions = await sanityClient.fetch(`
      *[_type == "transaction"]{_id}
    `);

    if (transactions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No transactions to delete",
        deletedCount: 0,
      });
    }

    // Delete all transactions
    const deletePromises = transactions.map((txn: { _id: string }) =>
      sanityClient.delete(txn._id)
    );

    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: "All transactions deleted successfully",
      deletedCount: transactions.length,
    });
  } catch (err) {
    console.error("Delete all transactions error:", err);
    return NextResponse.json(
      { error: "Failed to delete all transactions" },
      { status: 500 }
    );
  }
}
