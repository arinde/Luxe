import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { Product, ProductsResponse } from "@/types/type";

const CACHE_KEY = "luxe_products";
const CACHE_EXPIRY_KEY = "luxe_products_expiry";
const TTL_MS = 24 * 60 * 60 * 1000;

const localStorageBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
  const isExpired = expiry ? Date.now() > Number(expiry) : true;

  if (!isExpired) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return { data: JSON.parse(cached) as ProductsResponse };
    }
  }

  const rawBaseQuery = fetchBaseQuery({ baseUrl: "https://dummyjson.com" });
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.data) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
    localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + TTL_MS));
  }

  return result;
};

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: localStorageBaseQuery,
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, void>({
      query: () => "/products?limit=30",
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
