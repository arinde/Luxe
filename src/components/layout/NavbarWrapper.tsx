
"use client";
import { useAppSelector, } from "@/store/hooks";
import { Navbar } from "@/components/layout/Navbar";
import { useRouter } from "next/navigation";

export function NavbarWrapper() {
 
  const router = useRouter();
  const cartCount = useAppSelector((state) => state.cart.items.length);
  return (
    <Navbar
      cartCount={cartCount}
      onCartClick={() => router.push("/cart")}
      onLogoClick={() => router.push("/")}
      onPaymentClick={() => router.push("/payment")}
      onAdminClick={() => router.push("/admin")}
    />
  );
}