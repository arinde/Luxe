// components/home/HeroSection.tsx
"use client";

import { useRouter } from "next/navigation";
import { useGetProductsCategoryQuery } from "@/store/api/productApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategory } from "@/store/slices/productSlice";

interface HeroSectionProps {
  onShopNow?: () => void;
}

// const categories = ["All", "Handbags", "Jewellery", "Fragrance"];

export function HeroSection({
  onShopNow,
}: HeroSectionProps) {

  const dispatch = useAppDispatch()
 const { data, error, isLoading } = useGetProductsCategoryQuery()
 const categories = data ?? []

 const activeCategory = useAppSelector((state) => state.category.selectedCategory)
 
  return (
    <section className="bg-[#0C0C0C] px-6 md:px-12 pt-16 pb-12">
      {/* Collection Badge */}
      <div className="mb-10">
        <span className="inline-flex items-center gap-2 border border-[#2A2A2A] rounded-full px-4 py-2 text-[#888888] text-[13px] tracking-wide">
          <span className="text-[#E8C547]">✦</span>
          Summer 2025 Collection
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-syne font-bold text-[clamp(58px,12vw,102px)] leading-[0.92] tracking-[-0.02em] text-[#F5F5F3] mb-8 max-w-[900px]">
        Crafted for those
        <br />
        who{" "}
        <span className="text-[#E8C547] italic">notice</span>
        <br />
        everything.
      </h1>

      {/* Subtext */}
      <p className="text-[#888888] text-[15px] leading-relaxed max-w-[360px] mb-10">
        Curated luxury pieces — jewellery, fragrances, and accessories. Each one selected with intention.
      </p>

      {/* CTA */}
      <button
        onClick={onShopNow}
        className="inline-flex items-center gap-3 bg-[#E8C547] text-[#0C0C0C] font-syne font-bold text-[15px] tracking-wide px-7 py-4 rounded-full hover:bg-[#d4b03e] transition-colors duration-200 border-none cursor-pointer mb-14"
      >
        Shop now
        <span className="text-lg">→</span>
      </button>

      {/* Category Pills */}
      <div className="flex items-center gap-3 flex-wrap">
          <button
            key={'all'}
            value={'all'}
            onClick={() => dispatch(setCategory('all'))}
            className={`px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wide border transition-colors duration-200 cursor-pointer ${
              activeCategory === 'all'
                ? "bg-[#E8C547] text-[#0C0C0C] border-[#E8C547]"
                : "bg-transparent text-[#888888] border-[#2A2A2A] hover:border-[#F5F5F3] hover:text-[#F5F5F3]"
            }`}
          >
            All
          </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            value={cat.slug}
            onClick={() => dispatch(setCategory(cat.slug))}
            className={`px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wide border transition-colors duration-200 cursor-pointer ${
              activeCategory === cat.slug
                ? "bg-[#E8C547] text-[#0C0C0C] border-[#E8C547]"
                : "bg-transparent text-[#888888] border-[#2A2A2A] hover:border-[#F5F5F3] hover:text-[#F5F5F3]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
}