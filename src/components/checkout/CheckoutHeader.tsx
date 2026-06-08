interface CheckoutHeaderProps {
  onBackToCart: () => void;
}

export function CheckoutHeader({ onBackToCart }: CheckoutHeaderProps) {
  return (
    <div className="mb-8">
      <button
        onClick={onBackToCart}
        className="flex items-center gap-2 text-[#888888] text-sm tracking-wide hover:text-[#F5F5F3] transition-colors duration-200 mb-6 bg-transparent border-none cursor-pointer p-0"
      >
        <span>←</span>
        <span>Back to cart</span>
      </button>

      <h1 className="font-syne text-[42px] font-bold text-[#F5F5F3] leading-none">
        Checkout
      </h1>
    </div>
  );
}