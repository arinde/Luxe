
import { ShoppingBag, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
}

export function Navbar({ cartCount, onCartClick, onLogoClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  return (
    <>
      <nav className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 bg-[#0C0C0C]/85 backdrop-blur-xl border-b border-[#2A2A2A]">
        {/* Logo */}
        <button onClick={onLogoClick} className="p-0 bg-transparent border-none cursor-pointer">
          <span className="font-extrabold text-[22px] tracking-[0.08em] text-[#F5F5F3] font-syne">
            LU<span className="text-[#E8C547]">XE</span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {["New In", "Collections", "About"].map((item) => (
            <span
              key={item}
              className="text-[13px] font-normal tracking-[0.03em] text-[#888888] cursor-pointer transition-colors duration-200 hover:text-[#F5F5F3]"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Right side: Cart + Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative flex items-center justify-center p-2 bg-transparent border-none cursor-pointer text-[#F5F5F3]"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {mounted && cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-[17px] h-[17px] rounded-full bg-[#E8C547] text-[#0C0C0C] text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center p-2 bg-transparent border-none cursor-pointer text-[#F5F5F3]"
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full z-40 bg-[#0C0C0C]/95 backdrop-blur-xl border-b border-[#2A2A2A] flex flex-col px-6 py-4 gap-5">
          {["New In", "Collections", "About"].map((item) => (
            <span
              key={item}
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-normal tracking-[0.03em] text-[#888888] cursor-pointer transition-colors duration-200 hover:text-[#F5F5F3]"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </>
  );
}