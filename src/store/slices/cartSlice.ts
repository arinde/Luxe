import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { USD_TO_KOBO } from "@/lib/utils";

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  category: string;
}

interface CartState {
  items: CartItem[];
}
function loadCartState() : CartState{
  if(typeof window === "undefined") return { items: [] };
  try{
    const stored = localStorage.getItem("luxe_cart");
    return stored? JSON.parse(stored) : { items: [] };
  } catch {
    return { items : []}
  }
}
const initialState: CartState = loadCartState ();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          price: action.payload.price * USD_TO_KOBO,
          quantity: 1,
        });
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },
    incrementQuantity(state, action: PayloadAction<number>) {
  const item = state.items.find((i) => i.productId === action.payload);
  if (item) item.quantity += 1;
},

decrementQuantity(state, action: PayloadAction<number>) {
  const item = state.items.find((i) => i.productId === action.payload);
  if (!item) return;
  if (item.quantity <= 1) {
    state.items = state.items.filter((i) => i.productId !== action.payload);
  } else {
    item.quantity -= 1;
  }
},
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, incrementQuantity, decrementQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
