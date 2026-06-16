"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpDown, RotateCcw, Receipt } from "lucide-react";
import ReceiptModal from "./ReceiptModal";
import DataTable from "@/components/ui/data-table";
import TableSkeleton from "@/components/shared/skeletons/TableSkeleton";

export interface TransactionRecord {
  txnRef: string;
  amount: number;
  status: "success" | "failed" | "cancelled";
  responseCode: string;
  message: string;
  completedAt: number;
  items?: { productId: number; title: string; price: number; quantity: number; thumbnail: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  success: "bg-[#4CAF82]/15 text-[#4CAF82] border border-[#4CAF82]/30",
  failed: "bg-[#E05A5A]/15 text-[#E05A5A] border border-[#E05A5A]/30",
  cancelled: "bg-[#888888]/15 text-[#888888] border border-[#888888]/30",
};

export default function TransactionHistory() {
  const [data, setData] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "completedAt", desc: true },
  ]);
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("luxe_transactions");
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const columnHelper = createColumnHelper<TransactionRecord>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "index",
        header: "#",
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("completedAt", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 hover:text-[#F5F5F3] transition-colors"
          >
            Date
            <ArrowUpDown size={14} />
          </button>
        ),
        cell: (info) => formatDate(info.getValue()),
        sortingFn: "basic",
      }),
      columnHelper.accessor("txnRef", {
        header: "Transaction Ref",
        cell: (info) => (
          <span className="font-mono text-xs">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                STATUS_STYLES[status] ?? STATUS_STYLES.failed
              }`}
            >
              {status}
            </span>
          );
        },
      }),
      columnHelper.accessor("responseCode", {
        header: "Response Code",
        cell: (info) => (
          <span className="font-mono text-xs text-[#888888]">
            {info.getValue() || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("message", {
        header: "Message",
        cell: (info) => (
          <span className="text-xs text-[#888888] max-w-[200px] truncate block">
            {info.getValue() || "—"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "receipt",
        header: "",
        cell: (info) => (
          <button
            onClick={() => setSelectedTxn(info.row.original)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-[#2A2A2A] text-[#888888] text-xs font-medium rounded-lg hover:border-[#E8C547] hover:text-[#E8C547] transition-colors cursor-pointer"
          >
            <Receipt size={14} />
            Receipt
          </button>
        ),
      }),
      columnHelper.display({
        id: "retry",
        header: "",
        cell: (info) => (
          <button
            onClick={() => router.push("/checkout")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8C547] text-[#0C0C0C] text-xs font-semibold rounded-lg hover:bg-[#D4B23A] transition-colors"
          >
            <RotateCcw size={14} />
            Retry
          </button>
        ),
      }),
    ],
    [columnHelper, router]
  );

  const summary = useMemo(() => {
    const total = data.length;
    const successful = data.filter((t) => t.status === "success").length;
    const failed = data.filter((t) => t.status === "failed").length;
    const cancelled = data.filter((t) => t.status === "cancelled").length;
    const totalAmount = data
      .filter((t) => t.status === "success")
      .reduce((sum, t) => sum + t.amount, 0);
    return { total, successful, failed, cancelled, totalAmount };
  }, [data]);

  if (isLoading) {
    return (
      <>
        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[#161616] border border-[#2A2A2A] rounded-xl p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-[#2A2A2A] mb-2" />
              <div className="h-8 w-20 animate-pulse rounded bg-[#2A2A2A]" />
            </div>
          ))}
        </div>
        <TableSkeleton rows={6} columns={9} />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <SummaryCard label="Total" value={summary.total} />
        <SummaryCard label="Successful" value={summary.successful} variant="success" />
        <SummaryCard label="Failed" value={summary.failed} variant="failed" />
        <SummaryCard label="Cancelled" value={summary.cancelled} variant="cancelled" />
        <SummaryCard label="Total Spent" value={summary.totalAmount} isCurrency />
      </div>

      <DataTable
        columns={columns}
        data={data}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="No transactions yet."
      />

      {selectedTxn && (
        <ReceiptModal
          record={selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      )}
    </>
  );
}

function SummaryCard({
  label,
  value,
  variant,
  isCurrency,
}: {
  label: string;
  value: number;
  variant?: "success" | "failed" | "cancelled";
  isCurrency?: boolean;
}) {
  const accent = variant
    ? variant === "success"
      ? "#4CAF82"
      : variant === "failed"
      ? "#E05A5A"
      : "#888888"
    : "#E8C547";

  return (
    <div className="bg-[#161616] border border-[#2A2A2A] rounded-xl p-4">
      <p className="text-[#888888] text-xs uppercase tracking-widest font-medium mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color: accent }}>
        {isCurrency ? formatCurrency(value) : value}
      </p>
    </div>
  );
}
