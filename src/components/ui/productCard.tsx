"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { formatCurrency, USD_TO_KOBO } from "@/lib/utils";

export type BadgeVariant = "NEW" | "TRENDING" | "BESTSELLER";

interface ProductCardProps {
  id: number;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
  badge?: BadgeVariant;
  isInCart?: boolean;
  brand: string;
  stock: number;
  onAddToCart: (id: number) => void;
}

export default function ProductCard({
  id,
  title,
  category,
  price,
  thumbnail,
  badge,
  isInCart = false,
  brand,
  stock,
  onAddToCart,
}: ProductCardProps) {
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    if (isInCart) return;
    setAdding(true);
    onAddToCart(id);
    setTimeout(() => setAdding(false), 1200);
  }

  return (
    <div className="group relative bg-[#161616] border border-[#2A2A2A] hover:border-[#3A3A3A] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer">

      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EDEBE6]">
        <Image
          src={thumbnail || "/placeholder.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 bg-[#E8C547] text-[#0C0C0C] text-[10px] font-semibold tracking-[0.08em] uppercase px-[10px] py-1 rounded-full">
            {badge}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[11px] text-[#888888] tracking-[0.1em] uppercase mb-1 font-['Inter']">
            {category}
          </p>
          <h3 className="text-[15px] font-semibold text-[#F5F5F3] leading-snug font-['Syne']">
            {title}
          </h3>
        </div>

        {/* Price + Cart button */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[16px] font-bold text-[#F5F5F3] font-['Syne']">
            {formatCurrency(price * USD_TO_KOBO)}
          </span>

          <button
            onClick={handleAdd}
            className={`w-[38px] h-[38px] rounded-[10px] border-none flex items-center justify-center flex-shrink-0 transition-all duration-200
              ${isInCart || adding
                ? "bg-[#E8C547] text-[#0C0C0C] scale-100"
                : "bg-[#2A2A2A] text-[#F5F5F3] hover:bg-[#333333]"
              }
              ${adding ? "scale-90" : "scale-100"}
              ${isInCart ? "cursor-default" : "cursor-pointer"}
            `}
          >
            {isInCart ? (
              <Check size={16} strokeWidth={2.5} />
            ) : (
              <ShoppingBag size={15} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}