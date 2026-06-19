export interface Product {
    id: number,
    title: string,
    price: number,
    thumbnail: string,
    category: string,
    tags: string[],
    stock: number,
    brand: string,
    rating: number,
    discountPercentage: number,
}

export interface ProductsResponse {
    products: Product[],
    total: number,
    skip: number,
    limit: number
}

export interface categories {
    slug: string,
    name: string,
    url: string
}

 type transactionStatus = "success" | "failed" | "cancelled"

export interface transactionData {
        txnRef: string,
        amount: number,
        status: transactionStatus,
        responseCode: string,
        message: string,
        completedAt: number,
}
export interface getTransactionsResponse {
    transactions: transactionData[]
}