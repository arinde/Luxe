import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      <div className="flex size-20 items-center justify-center rounded-full bg-[#1E1E1E]">
        <ShoppingBag size={32} className="text-[#444444]" strokeWidth={1.2} />
      </div>
      <div className="text-center">
        <h2 className="text-[#F5F5F3] text-xl font-semibold font-syne mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#888888] text-sm">
          Looks like you haven&apos;t added anything yet
        </p>
      </div>
      <Link
        href="/home"
        className="inline-flex items-center gap-2 bg-[#E8C547] text-[#0C0C0C] text-sm font-bold tracking-wide px-8 py-4 rounded-xl hover:bg-[#d4b03e] transition-colors duration-200"
      >
        Continue shopping
      </Link>
    </div>
  );
}
