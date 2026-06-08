import type { Middleware, UnknownAction } from "@reduxjs/toolkit";
import type { CartItem } from "../slices/cartSlice";

export const cartMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);
  const typed = action as UnknownAction;

  if (typed.type.startsWith("cart/")) {
    const state = store.getState() as { cart: { items: CartItem[] } };
    localStorage.setItem("luxe_cart", JSON.stringify(state.cart));
  }

  return result;
}

