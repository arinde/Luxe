import type { Middleware, UnknownAction } from "@reduxjs/toolkit";
import type { CartItem } from "../slices/cartSlice";
import { logProductInteraction } from "../slices/analyticsSlice";

export const cartMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  
  const typed = action as UnknownAction;

  if (typed.type.startsWith("cart/removeItem")){
    const state = store.getState() as { cart: { items: CartItem[] } };
    const item = state.cart.items.find(i => i.productId === (typed.payload as number));
    if (item) {
      store.dispatch(logProductInteraction({
        productId: item.productId,
        productName: item.title,
        action: "remove",
        category: item.category,
        timeStamp: Date.now()
      }))
    }
  }

  const result = next(action);

  if (typed.type.startsWith("cart/")) {
    const state = store.getState() as { cart: { items: CartItem[] } };
    localStorage.setItem("luxe_cart", JSON.stringify(state.cart));
  }

  if (typed.type === "cart/addItem") {
    const payload = typed.payload as Omit<CartItem, "quantity">
    store.dispatch(logProductInteraction({
      productId: payload.productId,
      productName: payload.title,
      action: "add",
      category: payload.category,
      timeStamp: Date.now()
    }))
  }

  return result;

}

