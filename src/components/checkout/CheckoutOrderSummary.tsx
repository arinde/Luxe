import Image from "next/image";
import { Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SummaryItem {
    productId: number;
  thumbnail: string;
  title: string;
  quantity: number;
  price: number;
}

interface CheckoutOrderSummaryProps {
  items: SummaryItem[];
  subtotal: number;
  delivery: number;
  freeDeliveryThreshold: number;
  onPay: () => void;
  isLoading?: boolean;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  delivery,
  freeDeliveryThreshold,
  onPay,
  isLoading = false,
}: CheckoutOrderSummaryProps) {
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const effectiveDelivery = isFreeDelivery ? 0 : delivery;
  const total = subtotal + effectiveDelivery;

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 sticky top-24">
      <h2 className="text-[#F5F5F3] text-lg font-semibold font-syne mb-6">
        Order summary
      </h2>

      {/* Items */}
      <div className="flex flex-col gap-4 mb-6">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3">
            <div className="w-[52px] h-[52px] rounded-lg overflow-hidden bg-[#1E1E1E] flex-shrink-0">
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={52}
                height={52}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#F5F5F3] text-sm font-medium truncate">{item.title}</p>
              <p className="text-[#888888] text-[12px]">Qty {item.quantity}</p>
            </div>
            <p className="text-[#F5F5F3] text-sm font-medium flex-shrink-0">
              {formatCurrency(item.price)}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[#2A2A2A] mb-4" />

      {/* Subtotal & Delivery */}
      <div className="flex justify-between mb-2">
        <span className="text-[#888888] text-sm">Subtotal</span>
        <span className="text-[#F5F5F3] text-sm">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between mb-5">
        <span className="text-[#888888] text-sm">Delivery</span>
        <span className={`text-sm font-medium ${isFreeDelivery ? "text-green-400" : "text-[#F5F5F3]"}`}>
          {isFreeDelivery ? "Free" : formatCurrency(effectiveDelivery)}
        </span>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-[#F5F5F3] text-base font-semibold font-syne">Total</span>
        <span className="text-[#E8C547] text-xl font-bold font-syne">
          {formatCurrency(total)}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={onPay}
        disabled={isLoading}
        className="w-full bg-[#E8C547] text-[#0C0C0C] text-sm font-bold tracking-wide py-4 rounded-xl hover:bg-[#d4b03e] transition-colors duration-200 cursor-pointer border-none font-syne disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : `Pay ${formatCurrency(total)}`}
      </button>

      {/* SSL note */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        <Lock size={11} strokeWidth={1.5} className="text-[#444444]" />
        <p className="text-[#444444] text-[11px]">256-bit SSL encryption</p>
      </div>
    </div>
  );
}