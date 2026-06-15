import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/type";

interface ProductState {
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}
interface categoryState {
   
  selectedCategory: string,
}

const initialState: ProductState = {
  currentProduct: null,
  loading: false,
  error: null,
};
const selectedCategory: categoryState ={
 
  selectedCategory: 'all'
}
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

const categorySlice = createSlice({
  name: 'productCategory',
  initialState: selectedCategory,
  reducers:{
    setCategory(state, action: PayloadAction<string>) {
    
      state.selectedCategory = action.payload
    }
  }
})

export const { setProduct, setLoading, setError, clearProduct } = productSlice.actions;
export const { setCategory } = categorySlice.actions
export const productReducer = productSlice.reducer;
export const categoryReducer = categorySlice.reducer;
