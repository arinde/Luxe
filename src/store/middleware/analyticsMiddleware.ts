import { Middleware, UnknownAction } from "@reduxjs/toolkit";
import { logAnalytics } from "../slices/analyticsSlice";

export const AnalyticsMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action)
    const typed = action as UnknownAction

    if (typed.type.startsWith("productCategory/setCategory")){
        store.dispatch(logAnalytics(typed.payload as string))
    }

    return result
}