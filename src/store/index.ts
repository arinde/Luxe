import { configureStore } from "@reduxjs/toolkit";
import  cartReducer  from '@/store/slices/cartSlice'
import {productReducer, categoryReducer} from '@/store/slices/productSlice'
import { productApi } from "./api/productApi";
import { cartMiddleware } from "./middleware/cartMiddleware";
import { paymentApi } from "./api/paymentApi";
import paymentReducer from '@/store/slices/paymentSlice'
import { analyticsReducer } from "./slices/analyticsSlice";
import { AnalyticsMiddleware } from "./middleware/analyticsMiddleware";


export const store = configureStore({
    reducer: {
        product: productReducer,
        category: categoryReducer,
        analytics: analyticsReducer,
        cart: cartReducer,
        payment: paymentReducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productApi.middleware, cartMiddleware, paymentApi.middleware, AnalyticsMiddleware),
});

export type RootState= ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch