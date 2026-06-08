import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/type";

interface ProductState {
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  currentProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state, action: PayloadAction<Product>) {
      state.currentProduct = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearProduct(state) {
      state.currentProduct = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setProduct, setLoading, setError, clearProduct } = productSlice.actions;
export default productSlice.reducer;
