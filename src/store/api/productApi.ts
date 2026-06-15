import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { Product, ProductsResponse, categories } from "@/types/type";

const CACHE_KEY = "luxe_categories";
const CACHE_EXPIRY_KEY = "luxe_categories_expiry";
const TTL_MS = 24 * 60 * 60 * 1000;

const cachedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args.url;

  // Only cache the categories endpoint
  if (url === "/products/categories") {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (expiry && Date.now() < Number(expiry)) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return { data: JSON.parse(cached) };
      }
    }
  }

  const rawBaseQuery = fetchBaseQuery({ baseUrl: "https://dummyjson.com" });
  const result = await rawBaseQuery(args, api, extraOptions);

  if (url === "/products/categories" && result.data) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
    localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + TTL_MS));
  }

  return result;
};

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: cachedBaseQuery,
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, void>({
      query: () =>
         "/products?limit=30",
    }),

    getProductsCategory: builder.query<categories[], void>({
      query: () => "/products/categories",
    }),

    getProductByCategory: builder.query<ProductsResponse, string>({
      query:(category) => {
        if (category === "all") {
         return "/products?limit=30" 
        } else{
        return `/products/category/${category}?limit=30`
        }
      }
    })
  }),
});

export const { useGetProductsQuery, useGetProductByCategoryQuery, useGetProductsCategoryQuery } = productApi;
