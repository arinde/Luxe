"use client";

import { X, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionRecord } from "./TransactionHistory";

interface ReceiptModalProps {
  record: TransactionRecord;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  success: "Successful",
  failed: "Failed",
  cancelled: "Cancelled",
};

export default function ReceiptModal({ record, onClose }: ReceiptModalProps) {
  function handleDownload() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${record.txnRef}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 40px; max-width: 500px; margin: auto; }
    .header { text-align: center; margin-bottom: 32px; }
    .header h1 { font-size: 28px; letter-spacing: 2px; margin: 0; }
    .header span { color: #d4a838; }
    .header p { color: #666; font-size: 12px; margin-top: 4px; }
    .divider { border: none; border-top: 1px dashed #ccc; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .label { color: #666; }
    .value { font-weight: 600; text-align: right; }
    .status { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status.success { background: #e8f5e9; color: #2e7d32; }
    .status.failed { background: #fbe9e7; color: #c62828; }
    .status.cancelled { background: #f5f5f5; color: #616161; }
    .footer { text-align: center; margin-top: 32px; font-size: 11px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>LU<span>XE</span></h1>
    <p>Payment Receipt</p>
  </div>
  <hr class="divider">
  <div class="row"><span class="label">Transaction Ref</span><span class="value">${record.txnRef}</span></div>
  <div class="row"><span class="label">Date</span><span class="value">${formatDate(record.completedAt)}</span></div>
  <div class="row"><span class="label">Amount</span><span class="value">${formatCurrency(record.amount)}</span></div>
  <div class="row"><span class="label">Status</span><span class="value"><span class="status ${record.status}">${STATUS_LABELS[record.status] ?? record.status}</span></span></div>
  <div class="row"><span class="label">Response Code</span><span class="value">${record.responseCode || "—"}</span></div>
  <div class="row"><span class="label">Message</span><span class="value">${record.message || "—"}</span></div>
  <hr class="divider">
  <div class="footer">
    <p>Thank you for shopping with LUXE</p>
    <p>${formatDate(record.completedAt)}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${record.txnRef}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 bg-transparent border-none text-[#888888] hover:text-[#F5F5F3] cursor-pointer transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="font-extrabold text-[22px] tracking-[0.08em] text-[#F5F5F3] font-syne">
            LU<span className="text-[#E8C547]">XE</span>
          </h2>
          <p className="text-[#888888] text-xs mt-1">Payment Receipt</p>
        </div>

        <div className="border-t border-[#2A2A2A] pt-4 space-y-3">
          <Row label="Transaction Ref" value={record.txnRef} mono />
          <Row label="Date" value={formatDate(record.completedAt)} />
          <Row label="Amount" value={formatCurrency(record.amount)} />
          <Row label="Status" value={
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
              record.status === "success"
                ? "bg-[#4CAF82]/15 text-[#4CAF82] border border-[#4CAF82]/30"
                : record.status === "failed"
                ? "bg-[#E05A5A]/15 text-[#E05A5A] border border-[#E05A5A]/30"
                : "bg-[#888888]/15 text-[#888888] border border-[#888888]/30"
            }`}>
              {STATUS_LABELS[record.status] ?? record.status}
            </span>
          } />
          <Row label="Response Code" value={record.responseCode || "—"} />
          <Row label="Message" value={record.message || "—"} />
        </div>

        <button
          onClick={handleDownload}
          className="w-full mt-6 h-11 bg-[#E8C547] text-[#0C0C0C] font-semibold text-sm rounded-xl hover:bg-[#D4B23A] transition-colors flex items-center justify-center gap-2 cursor-pointer border-none"
        >
          <Download size={16} />
          Download Receipt
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#888888] text-sm">{label}</span>
      <span
        className={`text-[#F5F5F3] text-sm text-right max-w-[60%] truncate ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
