"use client"
import Breadcrumb from "@/components/ui/breadCrumb";
import { CartHeader } from "@/app/cart/components/CartHeader";
import { CartList } from "./components/CartList";
import { OrderSummary } from "@/app/cart/components/OrderSummary";
import EmptyCart from "@/app/cart/components/EmptyCart";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { incrementQuantity, decrementQuantity, removeItem } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/shared/toast/ToastProvider";

export default function CartPage() {
  const delivery = 3500 * 100;
  const freeDeliveryThreshold = 100000 * 100;
const storeddata = useAppSelector((state) => state.cart.items)
const items = storeddata
const dispatch = useAppDispatch()
const router = useRouter()
const { showToast } = useToast()
const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (productId: number) => {
    const item = items.find(i => i.productId === productId)
    dispatch(removeItem(productId))
    showToast(`${item?.title || 'Item'} removed from cart`, 'remove')
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] px-6 py-10 mx-auto">
      <div className="px-6 py-4">
        <Breadcrumb />
      </div>
      <CartHeader
        itemCount={items.length}
        onContinueShopping={() => {router.push('/home')}}
      />

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          <CartList
            items={items}
            onIncrease={(productId) => {dispatch(incrementQuantity(productId))}}
            onDecrease={(productId) => {dispatch(decrementQuantity(productId))}}
            onRemove={handleRemove}
          />
          <OrderSummary
            subtotal={subtotal}
            delivery={delivery}
            freeDeliveryThreshold={freeDeliveryThreshold}
            onCheckout={() => {router.push('/checkout')}}
          />
        </div>
      )}
    </div>
  );
}