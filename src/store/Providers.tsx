'use client';

import { Provider } from "react-redux";
import { store } from "./index";
import { ReactNode } from "react";
import { ToastProvider } from "@/components/shared/toast/ToastProvider";

export const Providers = ({children} : {children: ReactNode}) => {
    return(
        <Provider store={store}>
            <ToastProvider>
                {children}
            </ToastProvider>
        </Provider>
    )
}