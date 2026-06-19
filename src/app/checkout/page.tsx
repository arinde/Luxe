'use client';

import { useState, useEffect, useRef } from "react";
import { CheckoutHeader } from "@/app/checkout/component/CheckoutHeader";
import { ContactInformationForm } from "@/app/checkout/component/ContactInformationForm";
import { DeliveryAddressForm } from "@/app/checkout/component/DeliveryAddressForm";
// import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { CheckoutOrderSummary } from "@/app/checkout/component/CheckoutOrderSummary";
import Breadcrumb from "@/components/ui/breadCrumb";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { setInitiating, setProcessing, sdkCompleted, setFailed } from "@/store/slices/paymentSlice";
import { useInitPaymentMutation } from "@/store/api/paymentApi";
import { useInterswitch } from "@/hooks/useInterswitch";
import { useToast } from "@/components/shared/toast/ToastProvider";

declare global {
  interface Window {
    webpayCheckout: (request: object) => void;
  }
}

export default function CheckoutPage() {
 
  const [contact, setContact] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [address, setAddress] = useState({ address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setIsMounted] = useState(false)

  const isFirstRender = useRef(true);
   const DELIVERY = 3500;                    // ₦3,500
  const DELIVERY_IN_KOBO = DELIVERY * 100;  // 350,000 kobo
  const FREE_DELIVERY_THRESHOLD = 100000;   
  const items = useAppSelector((state) => state.cart.items);
  const displayItems = mounted ? items : []
  const paymentStatus = useAppSelector((state) => state.payment.status);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showToast } = useToast();

  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalInKobo = subtotal + DELIVERY_IN_KOBO;


  const [initPayment, { isLoading: isInitiating }] = useInitPaymentMutation();

  useInterswitch();

  // Load saved form data on mount
  useEffect(() => {
    const saved = localStorage.getItem("luxe_checkout_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.contact) {
          // Filter out placeholder values
          const filteredContact = {
            fullName: parsed.contact.fullName || "",
            email: parsed.contact.email || "",
            phoneNumber: parsed.contact.phoneNumber?.startsWith("+") ? parsed.contact.phoneNumber : "",
          };
          setContact(filteredContact);
        }
        if (parsed.address) setAddress(parsed.address);
      } catch {}
    }
  }, []);
  useEffect(() => setIsMounted(true), [])

  // Save form data on every change (skip initial mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(
      "luxe_checkout_form",
      JSON.stringify({ contact, address })
    );
  }, [contact, address]);

  // FSM transitions → redirect
  useEffect(() => {
    if (paymentStatus === "verifying") {
      const txnRef = sessionStorage.getItem("luxe_txn_ref");
      if (txnRef) router.push(`/payment/status?ref=${txnRef}`);
    }
    if (paymentStatus === "cancelled" || paymentStatus === "failed" || paymentStatus === "error") {
      router.push("/payment/status?ref=none");
    }
  }, [paymentStatus, router]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!contact.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!contact.email.trim()) newErrors.email = "Email is required";
    if (!contact.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!contact.phoneNumber.startsWith("+")) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    if (!address.address.trim()) newErrors.address = "Delivery address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handlePay() {
    if (!validate()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    dispatch(setInitiating());

    try {
      localStorage.setItem("luxe_receipt_items", JSON.stringify(items));

      const result = await initPayment({
        amount: totalInKobo,
        customerEmail: contact.email,
        customerName: contact.fullName,
        customerPhone: contact.phoneNumber,
      }).unwrap();

      dispatch(setProcessing({ txnRef: result.txnRef, amount: result.amount }));

      sessionStorage.setItem("luxe_txn_ref", result.txnRef);
      sessionStorage.setItem("luxe_txn_amount", String(totalInKobo));

      window.webpayCheckout({
        merchant_code: result.merchantCode,
        pay_item_id: result.payItemId,
        txn_ref: result.txnRef,
        amount: result.amount,
        currency: result.currency,
        site_redirect_url: result.redirectUrl,
        cust_name: contact.fullName,
        cust_email: contact.email,
        cust_mobile_no: contact.phoneNumber,
        pay_item_name: "LUXE Order",
        mode: process.env.NEXT_PUBLIC_ISW_MODE,
        onComplete: (response: { responseCode: string; txnref: string }) => {  
          sessionStorage.setItem("luxe_txn_ref", response.txnref);
          dispatch(
            sdkCompleted({
              responseCode: response.responseCode,
              txnRef: response.txnref,
            })
          );
        },
      });
    } catch {
      dispatch(setFailed("Could not initiate payment. Please try again."));
      showToast('Payment initiation failed. Please try again.', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] px-6 py-10 mx-auto">
      <Breadcrumb />
      <CheckoutHeader onBackToCart={() => router.push("/cart")} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-8 items-start">
        {/* Left: Forms */}
        <div className="flex flex-col gap-5">
          <ContactInformationForm
            values={contact}
            errors={errors}
            onChange={(field, value) =>
              setContact((prev) => ({ ...prev, [field]: value }))
            }
          />
          <DeliveryAddressForm
            values={address}
            errors={errors}
            onChange={(field, value) =>
              setAddress((prev) => ({ ...prev, [field]: value }))
            }
          />
          {/* <PaymentMethod /> */}
        </div>

        {/* Right: Summary */}
        <CheckoutOrderSummary
          items={displayItems}
          subtotal={subtotal}
          delivery={DELIVERY_IN_KOBO}
          freeDeliveryThreshold={FREE_DELIVERY_THRESHOLD}
          onPay={handlePay}
          isLoading={isInitiating}
        />
      </div>
    </div>
  );
}
