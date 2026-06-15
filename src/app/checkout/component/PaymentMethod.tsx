import { CreditCard } from "lucide-react";

export function PaymentMethod() {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6">
      <h2 className="text-[#F5F5F3] text-lg font-semibold font-syne mb-6">
        Payment
      </h2>

      {/* Interswitch Option — selected by default */}
      <div className="flex items-center gap-4 border border-[#E8C547] bg-[#1A1A1A] rounded-xl px-5 py-4 cursor-pointer">
        <div className="text-[#E8C547]">
          <CreditCard size={20} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[#F5F5F3] text-sm font-medium">Pay via Interswitch</p>
          <p className="text-[#888888] text-[12px]">Card, bank transfer, USSD & more</p>
        </div>
      </div>

      <p className="text-[#555555] text-[11px] mt-4 text-center">
        You'll be securely redirected to Interswitch to complete your payment.
      </p>
    </div>
  );
}