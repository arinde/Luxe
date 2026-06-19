"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createColumnHelper,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpDown, RotateCcw, Receipt, Trash2, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/components/shared/toast/ToastProvider";
import { 
  useGetTransactionsQuery, 
  useDeleteTransactionMutation,
  useDeleteAllTransactionsMutation,
} from "@/store/api/transactionApi";
import ReceiptModal from "./ReceiptModal";
import DataTable from "@/components/ui/data-table";
import TableSkeleton from "@/components/shared/skeletons/TableSkeleton";

export interface TransactionRecord {
  _id: string;
  txnRef: string;
  amount: number;
  status: "success" | "failed" | "cancelled" | "error" | string;
  responseCode: string;
  message: string;
  completedAt: number;
  items?: { productId: number; title: string; price: number; quantity: number; thumbnail: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  success: "bg-[#4CAF82]/15 text-[#4CAF82] border border-[#4CAF82]/30",
  failed: "bg-[#E05A5A]/15 text-[#E05A5A] border border-[#E05A5A]/30",
  cancelled: "bg-[#888888]/15 text-[#888888] border border-[#888888]/30",
  error: "bg-[#E05A5A]/15 text-[#E05A5A] border border-[#E05A5A]/30",
};

// Delete Confirmation Modal Component
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message, isLoading }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-[#E05A5A]/15 rounded-full">
            <AlertTriangle className="w-6 h-6 text-[#E05A5A]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#F5F5F3] mb-2">{title}</h3>
            <p className="text-sm text-[#888888]">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#888888]" />
          </button>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[#888888] hover:text-[#F5F5F3] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-[#E05A5A] text-white text-sm font-medium rounded-lg hover:bg-[#C94A4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionHistory() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "completedAt", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  
  const router = useRouter();
  const { showToast } = useToast();

  // RTK Query hooks
  const { data: transactionsData, isLoading } = useGetTransactionsQuery();
  const [deleteTransaction, { isLoading: isDeletingSingle }] = useDeleteTransactionMutation();
  const [deleteAllTransactions, { isLoading: isDeletingAll }] = useDeleteAllTransactionsMutation();

  const data = transactionsData?.transactions ?? [];

  // Get selected transaction IDs
  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection)
      .map(index => data[parseInt(index)]?._id)
      .filter(Boolean);
  }, [rowSelection, data]);

  const handleDeleteSingle = async (id: string) => {
    if (!id) return;
    
    setDeletingIds(prev => new Set(prev).add(id));
    try {
      await deleteTransaction(id).unwrap();
      showToast("Transaction deleted successfully", "success");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete transaction", "error");
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    setDeleteModalOpen(true);
  };

  const confirmDeleteSelected = async () => {
    setDeletingIds(new Set(selectedIds));
    
    try {
      // Delete all selected transactions
      await Promise.all(selectedIds.map(id => deleteTransaction(id).unwrap()));
      showToast(`${selectedIds.length} transaction(s) deleted successfully`, "success");
      setRowSelection({}); // Clear selection
    } catch (err) {
      console.error("Bulk delete error:", err);
      showToast("Failed to delete some transactions", "error");
    } finally {
      setDeletingIds(new Set());
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteAll = async () => {
    setDeleteAllModalOpen(true);
  };

  const confirmDeleteAll = async () => {
    try {
      const result = await deleteAllTransactions().unwrap();
      showToast(`All ${result.deletedCount} transactions deleted successfully`, "success");
      setRowSelection({}); // Clear selection
    } catch (err) {
      console.error("Delete all error:", err);
      showToast("Failed to delete all transactions", "error");
    } finally {
      setDeleteAllModalOpen(false);
    }
  };

  const columnHelper = createColumnHelper<TransactionRecord>();

  const columns = useMemo(
    () => [
      // Checkbox column for selection
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="w-4 h-4 rounded border-[#2A2A2A] bg-[#161616] text-[#E8C547] focus:ring-[#E8C547] focus:ring-offset-0 cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 rounded border-[#2A2A2A] bg-[#161616] text-[#E8C547] focus:ring-[#E8C547] focus:ring-offset-0 cursor-pointer"
          />
        ),
      }),
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
        cell: (info) => {
          const status = info.row.original.status;
          const isSuccess = status === "success";
          return (
            <button
              onClick={() => !isSuccess && router.push("/checkout")}
              disabled={isSuccess}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isSuccess
                  ? "bg-[#2A2A2A] text-[#888888] cursor-not-allowed"
                  : "bg-[#E8C547] text-[#0C0C0C] hover:bg-[#D4B23A]"
              }`}
            >
              <RotateCcw size={14} />
              {isSuccess ? "Completed" : "Retry"}
            </button>
          );
        },
      }),
      columnHelper.display({
        id: "delete",
        header: "",
        cell: (info) => {
          const id = info.row.original._id;
          const isDeleting = deletingIds.has(id);
          return (
            <button
              onClick={() => handleDeleteSingle(id)}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-[#E05A5A]/30 text-[#E05A5A] text-xs font-medium rounded-lg hover:bg-[#E05A5A]/15 hover:border-[#E05A5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          );
        },
      }),
    ],
    [columnHelper, router, deletingIds]
  );

  const summary = useMemo(() => {
    const total = data.length;
    const successful = data.filter((t) => t.status === "success").length;
    const failed = data.filter((t) => t.status === "failed" || t.status === "error").length;
    const cancelled = data.filter((t) => t.status === "cancelled").length;
    const errors = data.filter((t) => t.status === "error").length;
    const totalAmount = data
      .filter((t) => t.status === "success")
      .reduce((sum, t) => sum + t.amount, 0);
    return { total, successful, failed, cancelled, errors, totalAmount };
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
        <TableSkeleton rows={6} columns={11} />
      </>
    );
  }

  return (
    <>
      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-[#161616] border border-[#2A2A2A] rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#888888]">
              <span className="text-[#F5F5F3] font-medium">{selectedIds.length}</span> selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRowSelection({})}
              className="px-3 py-1.5 text-sm text-[#888888] hover:text-[#F5F5F3] transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#E05A5A]/15 border border-[#E05A5A]/30 text-[#E05A5A] text-sm font-medium rounded-lg hover:bg-[#E05A5A]/25 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <SummaryCard label="Total" value={summary.total} />
        <SummaryCard label="Successful" value={summary.successful} variant="success" />
        <SummaryCard label="Failed" value={summary.failed} variant="failed" />
        <SummaryCard label="Cancelled" value={summary.cancelled} variant="cancelled" />
        <SummaryCard label="Total Spent" value={summary.totalAmount} isCurrency />
      </div>

      {/* Delete All Button */}
      {data.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-[#E05A5A]/30 text-[#E05A5A] text-sm font-medium rounded-lg hover:bg-[#E05A5A]/15 hover:border-[#E05A5A] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete All
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        enableRowSelection={true}
        emptyMessage="No transactions yet."
      />

      {selectedTxn && (
        <ReceiptModal
          record={selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      )}

      {/* Delete Selected Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteSelected}
        title="Delete Selected Transactions"
        message={`Are you sure you want to delete ${selectedIds.length} selected transaction(s)? This action cannot be undone.`}
        isLoading={isDeletingSingle}
      />

      {/* Delete All Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteAllModalOpen}
        onClose={() => setDeleteAllModalOpen(false)}
        onConfirm={confirmDeleteAll}
        title="Delete All Transactions"
        message={`Are you sure you want to delete all ${data.length} transactions? This action cannot be undone.`}
        isLoading={isDeletingAll}
      />
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
