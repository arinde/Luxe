import { Trash2 } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface CartItemProps {
  productId: number;
  thumbnail: string;
  category: string;
  title: string;
  quantity: number;
  price: number;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

export function CartItem({
  productId,
  thumbnail,
  category,
  title,
  quantity,
  price,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-5 p-5 rounded-2xl border border-[#2A2A2A] bg-[#141414]">
      {/* Product Image */}
      <div className="w-[90px] h-[90px] rounded-xl overflow-hidden bg-[#1E1E1E] flex-shrink-0">
        <Image
          src={thumbnail}
          alt={title}
          width={90}
          height={90}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-[#888888] text-[11px] uppercase tracking-[0.12em] mb-1">
          {category}
        </p>
        <p className="text-[#F5F5F3] text-[15px] font-medium font-syne truncate">
          {title}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-3 border border-[#2A2A2A] rounded-full px-3 py-1.5">
            <button
              onClick={() => onDecrease(productId)}
              className="text-[#888888] hover:text-[#F5F5F3] transition-colors bg-transparent border-none cursor-pointer w-4 h-4 flex items-center justify-center text-lg leading-none"
            >
              −
            </button>
            <span className="text-[#F5F5F3] text-sm w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => onIncrease(productId)}
              className="text-[#888888] hover:text-[#F5F5F3] transition-colors bg-transparent border-none cursor-pointer w-4 h-4 flex items-center justify-center text-lg leading-none"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Price + Remove */}
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        <p className="text-[#F5F5F3] text-[16px] font-semibold font-syne">
          {formatCurrency(price * quantity)}
        </p>
        <button
          onClick={() => onRemove(productId)}
          className="text-[#444444] hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer p-1"
        >
          <Trash2 size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
