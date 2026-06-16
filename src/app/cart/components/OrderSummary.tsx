import { formatCurrency } from "@/lib/utils";

interface OrderSummaryProps {
  subtotal: number;
  delivery: number;
  freeDeliveryThreshold: number;
  onCheckout: () => void;
}

export function OrderSummary({
  subtotal,
  delivery,
  freeDeliveryThreshold,
  onCheckout,
}: OrderSummaryProps) {
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const effectiveDelivery = isFreeDelivery ? 0 : delivery;
  const effectiveTotal = subtotal + effectiveDelivery;

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 sticky top-24">
      <h2 className="text-[#F5F5F3] text-lg font-semibold font-syne mb-6">
        Order summary
      </h2>

      {/* Subtotal */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#888888] text-sm">Subtotal</span>
        <span className="text-[#F5F5F3] text-sm font-medium">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {/* Delivery */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#888888] text-sm">Delivery</span>
        <span className="text-[#F5F5F3] text-sm font-medium">
          {isFreeDelivery ? "Free" : formatCurrency(effectiveDelivery)}
        </span>
      </div>

      {/* Free delivery note */}
      {!isFreeDelivery && (
        <p className="text-[#555555] text-[11px] mb-5">
          Free delivery on orders over {formatCurrency(freeDeliveryThreshold)}
        </p>
      )}

      {/* Divider */}
      <div className="border-t border-[#2A2A2A] my-5" />

      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-[#F5F5F3] text-base font-semibold font-syne">Total</span>
        <span className="text-[#E8C547] text-xl font-bold font-syne">
          {formatCurrency(effectiveTotal)}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={onCheckout}
        className="w-full bg-[#E8C547] text-[#0C0C0C] text-sm font-bold tracking-wide py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#d4b03e] transition-colors duration-200 cursor-pointer border-none font-syne"
      >
        Proceed to checkout →
      </button>

      <p className="text-center text-[#444444] text-[11px] mt-3 tracking-wide">
        Secure payment via Interswitch
      </p>
    </div>
  );
}