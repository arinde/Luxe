import { createApi, fetchBaseQuery,} from "@reduxjs/toolkit/query/react"

type transactionStatus = "success" | "failed" | "cancelled"
 interface postTransactionArgs {
    txnRef: string,
    amount: number,
    status: transactionStatus,
 }

interface transactionData {
        _id: string,
        txnRef: string,
        amount: number,
        status: transactionStatus,
        responseCode: string,
        message: string,
        completedAt: number,
}
interface getTransactionsResponse {
    transactions: transactionData[]
}

interface deleteResponse {
    success: boolean;
    message: string;
}

interface deleteAllResponse {
    success: boolean;
    message: string;
    deletedCount: number;
}

export const transactionApi = createApi({
    reducerPath: 'transactionApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api'}),
    tagTypes: ['Transaction'],
    endpoints: (builder) => ({
        postTransaction: builder.mutation<transactionData, postTransactionArgs>({
            query: (body) => ({
                url: '/transactions',
                 method: 'POST',
                 body,
            }),
            invalidatesTags: ['Transaction'],
        }),

        getTransactions: builder.query<getTransactionsResponse, void>({
            query: () => '/transactions',
            providesTags: ['Transaction'],
        }),

        deleteTransaction: builder.mutation<deleteResponse, string>({
            query: (id) => ({
                url: `/transactions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Transaction'],
        }),

        deleteAllTransactions: builder.mutation<deleteAllResponse, void>({
            query: () => ({
                url: '/transactions',
                method: 'DELETE',
            }),
            invalidatesTags: ['Transaction'],
        }),
    })
})


export const { 
    usePostTransactionMutation, 
    useGetTransactionsQuery, 
    useDeleteTransactionMutation,
    useDeleteAllTransactionsMutation,
} = transactionApi;
