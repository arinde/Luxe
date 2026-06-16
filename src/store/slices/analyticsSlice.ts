import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface clickEvents {
    category: string,
    timeStamp: number,
}
interface  productEvent {
     productId: number,
    productName: string,
    action: "add" | "remove",
    category: string,
    timeStamp: number,
}
interface AnalyticsState {
    clickEvents:  clickEvents[],
    productEvents: productEvent[],
}

const STORAGE_KEY = 'luxe_analytics';

// Load initial state from localStorage
const loadFromStorage = (): AnalyticsState => {
    if (typeof window === 'undefined') {
        return { clickEvents: [], productEvents: [] };
    }
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                clickEvents: parsed.clickEvents ?? [],
                productEvents: parsed.productEvents ?? [],
            };
        }
    } catch (error) {
        console.error('Error loading analytics from localStorage:', error);
    }
    return { clickEvents: [], productEvents: [] };
};

// Save state to localStorage
const saveToStorage = (state: AnalyticsState) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving analytics to localStorage:', error);
    }
};

const initialState : AnalyticsState = loadFromStorage();

const AnalyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        logAnalytics(state, action: PayloadAction<string>){
            const category = action.payload
            state.clickEvents.push({
                category: category,
                timeStamp: Date.now()
            })
            saveToStorage(state);
        },
        clearAnalytics(state) {
            state.clickEvents = [];
            state.productEvents = [];
            saveToStorage(state);
        },
        logProductInteraction(state, action: PayloadAction<productEvent>){
           
            state.productEvents.push({
                ...action.payload,
                timeStamp: Date.now()

            })
            saveToStorage(state)
        }
    }
})

export const { logAnalytics, clearAnalytics, logProductInteraction } = AnalyticsSlice.actions
export const analyticsReducer = AnalyticsSlice.reducer
