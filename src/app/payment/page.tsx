"use client";

import TransactionHistory from "./component/TransactionHistory";
import Breadcrumb from "@/components/ui/breadCrumb";

export default function PaymentHistoryPage() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] px-6 py-10">
      <Breadcrumb />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[#F5F5F3] font-['Syne'] text-2xl font-semibold mb-8">
          Transaction History
        </h1>
        <TransactionHistory />
      </div>
    </div>
  );
}
