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
    if (status === "success") {
      dispatch(clearCart());
    } else if (status === "failed") {
      showToast('Payment failed. Please try again.', 'error');
    } else if (status === "cancelled") {
    }
  }, [status, dispatch]);

  // Persist completed transaction to history
  useEffect(() => {
    if (status === "success" || status === "failed" || status === "cancelled") {
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
