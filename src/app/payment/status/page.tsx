"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { setVerifyResult, setFailed, resetPayment } from "@/store/slices/paymentSlice";
import { useVerifyPaymentQuery } from "@/store/api/paymentApi";
import ResultCard from "../component/ResultCard";
import Breadcrumb from "@/components/ui/breadCrumb";
import { useToast } from "@/components/shared/toast/ToastProvider";


interface saveTransactionData {
  txnRef: string;
  amount: number;
  status: string;
  responseCode: string;
  message: string;
  completedAt: number;
}

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const txnRef = searchParams.get("ref");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showToast } = useToast();
  const { status, error, responseCode, amount } = useAppSelector(
    (state) => state.payment
  );

  const storedAmount =
    typeof window !== "undefined"
      ? Number(sessionStorage.getItem("luxe_txn_amount") ?? 0)
      : 0;

  const shouldSkip =
    !txnRef ||
    txnRef === "none" ||
    !storedAmount;

  const { data, isError, isLoading } = useVerifyPaymentQuery(
    { txnRef: txnRef ?? "", amount: storedAmount },
    { skip: shouldSkip }
  );

  async function SaveTransaction(transactionData : saveTransactionData){
    try{
      await fetch('/api/transactions', {
        method: "POST",
        body: JSON.stringify(transactionData),
        headers: {"Content-Type": "application/json"}
      })
    } catch(err){
      console.error("Failed to save transaction:", err);
      showToast(`${err} Failed to Save Transaction`, 'error')
      
    }
  }
  useEffect(() => {
    if (data) {
      dispatch(
        setVerifyResult({ responseCode: data.responseCode, message: data.message })
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(setFailed("Verification failed. Please contact support."));
      showToast('Payment verification failed. Please contact support.', 'error');
    }
  }, [isError, dispatch, showToast]);

  useEffect(() => {
    // Save ALL transaction types to database (success, failed, cancelled, error)
    if ((status === "success" || status === "failed" || status === "cancelled" || status === "error") && txnRef && txnRef !== "none") {
      const transactionData: saveTransactionData = {
        txnRef: txnRef,
        amount: amount ?? storedAmount,
        status: status,
        responseCode: responseCode ?? (status === "cancelled" ? "CANCELLED" : ""),
        message: error ?? (status === "cancelled" ? "Transaction was cancelled by user" : status === "error" ? "Transaction error occurred" : "Payment failed"),
        completedAt: Date.now(),
      };
      
      SaveTransaction(transactionData);
      
      // Show appropriate toast messages
      if (status === "success") {
        dispatch(clearCart());
      } else if (status === "failed") {
        showToast('Payment failed. Please try again.', 'error');
      } else if (status === "cancelled") {
        showToast('Payment was cancelled.', 'info');
      } else if (status === "error") {
        showToast('Transaction error occurred. Please try again.', 'error');
      }
    }
  }, [status, dispatch, amount, txnRef, responseCode, error, storedAmount, showToast]);

  // useEffect(() => {
  //   SaveTransaction({
  //     txnRef: "7dhsdisdjdd87cw",
  //     amount: 1273900,
  //     status: "success",
  //     responseCode: "00",
  //     message: "the tranaction was succefful",
  //     completedAt: Date.now(),
  //   })
  // })

  // Persist completed transaction to history
  useEffect(() => {
    if (status === "success" || status === "failed" || status === "cancelled" || status === "error") {
      const record: any = {
        txnRef: txnRef || sessionStorage.getItem("luxe_txn_ref") || "",
        amount: amount ?? storedAmount,
        status,
        responseCode: responseCode ?? "",
        message: error ?? "",
        completedAt: Date.now(),
      };
      if (status === "success") {
        const savedItems = localStorage.getItem("luxe_receipt_items");
        if (savedItems) {
          try { record.items = JSON.parse(savedItems); } catch {}
        }
      }
      if (!record.txnRef) return;
      const history = JSON.parse(
        localStorage.getItem("luxe_transactions") || "[]"
      );
      const existingIndex = history.findIndex(
        (t: any) => t.txnRef === record.txnRef
      );
      if (existingIndex >= 0) {
        history[existingIndex] = record;
      } else {
        history.unshift(record);
      }
      localStorage.setItem("luxe_transactions", JSON.stringify(history));
    }
  }, [status, txnRef, amount, responseCode, error, storedAmount]);

  function handleRetry() {
    dispatch(resetPayment());
    router.push("/checkout");
  }

  function handleHome() {
    dispatch(resetPayment());
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] px-6 py-10">
      <Breadcrumb />
      <div className="flex items-center justify-center mt-20">
        <ResultCard
          status={status}
          responseCode={responseCode}
          error={error}
          amount={amount}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0C0C0C]" />}>
      <PaymentStatusContent />
    </Suspense>
  );
}
