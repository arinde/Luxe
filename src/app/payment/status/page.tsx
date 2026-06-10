"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { setVerifyResult, setFailed, resetPayment } from "@/store/slices/paymentSlice";
import { useVerifyPaymentQuery } from "@/store/api/paymentApi";
import ResultCard from "@/components/payment/ResultCard";
import Breadcrumb from "@/components/ui/breadCrumb";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const txnRef = searchParams.get("ref");
  const dispatch = useAppDispatch();
  const router = useRouter();
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
    }
  }, [isError, dispatch]);

  useEffect(() => {
    if (status === "success") {
      dispatch(clearCart());
      sessionStorage.removeItem("luxe_txn_ref");
      sessionStorage.removeItem("luxe_txn_amount");
    }
  }, [status, dispatch]);

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