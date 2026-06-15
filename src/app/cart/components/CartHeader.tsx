import { ArrowLeft } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
  onContinueShopping: () => void;
}

export function CartHeader({ itemCount, onContinueShopping }: CartHeaderProps) {
  return (
    <div className="mb-8">
      <button
        onClick={onContinueShopping}
        className="flex items-center gap-2 text-[#888888] text-sm tracking-wide hover:text-[#F5F5F3] transition-colors duration-200 mb-6 bg-transparent border-none cursor-pointer p-0"
      >
        <ArrowLeft size={15} strokeWidth={1.5} />
        <span>Continue shopping</span>
      </button>

      <h1 className="font-syne text-[42px] font-bold text-[#F5F5F3] leading-none mb-2">
        Your cart
      </h1>
      <p className="text-[#888888] text-sm tracking-wide">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </p>
    </div>
  );
}