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
  ${record.items && record.items.length > 0 ? `
  <hr class="divider">
  <h3 style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#666;margin-bottom:12px;">Items Purchased</h3>
  ${record.items.map(item => `
  <div style="display:flex;align-items:center;gap:12px;padding:6px 0;">
    <img src="${item.thumbnail}" alt="${item.title}" style="width:36px;height:36px;border-radius:6px;object-fit:cover;" />
    <div style="flex:1;font-size:13px;">
      <div style="font-weight:600;">${item.title}</div>
      <div style="color:#888;">NGN ${(item.price / 100).toLocaleString()} x ${item.quantity}</div>
    </div>
    <div style="font-weight:600;font-size:13px;">NGN ${((item.price * item.quantity) / 100).toLocaleString()}</div>
  </div>
  `).join("")}
  ` : ""}
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

        {record.items && record.items.length > 0 && (
          <div className="border-t border-[#2A2A2A] pt-4 mt-4">
            <h3 className="text-[#F5F5F3] text-xs font-semibold uppercase tracking-widest mb-3">Items Purchased</h3>
            <div className="space-y-2">
              {record.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] overflow-hidden shrink-0 border border-[#2A2A2A]">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5F5F3] text-sm truncate">{item.title}</p>
                    <p className="text-[#888888] text-xs">{formatCurrency(item.price)} x {item.quantity}</p>
                  </div>
                  <span className="text-[#F5F5F3] text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
