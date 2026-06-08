"use client";
import Image from "next/image";
import { useGetProductsQuery } from "@/store/api/productApi";
import ProductSkeleton from "../shared/skeletons/ProductSkeleton";
import ProductCard from "../ui/productCard";
import { Product } from "@/types/type";
import { BadgeVariant } from "../ui/productCard";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/store/slices/cartSlice";
import type { RootState } from "@/store";

const getBadge = (product: Product): BadgeVariant | undefined => {
  if (product.rating >= 4.8) return "BESTSELLER";
  if (product.stock <= 10) return "NEW";
  if (product.discountPercentage >= 15) return "TRENDING";
  return undefined;
};

export default function ProductsSection() {
  const { data, isLoading, error } = useGetProductsQuery();
  const storeProducts = data?.products ?? [];
  const dispatch = useDispatch()

  const handleAddTocart = (id: number) => {
    const product = storeProducts.find((p) => p.id === id)
    if (!product) return 
    dispatch(addItem({
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        category: product.category
    }))
  }

  const cartItems = useSelector((state: RootState) => state.cart.items)

  return (
    <div className="mx-10">
      <h1>Welcome to the product section</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
            
          storeProducts.map((item) => (
        <ProductCard
            key={item.id}
            id={item.id}
            title={item.title}
            category={item.category}
            brand={item.brand}
            stock={item.stock}
            price={item.price}
            thumbnail={item.thumbnail}
            badge={getBadge(item)}
            isInCart={cartItems.some((ci) => ci.productId === item.id)}
            onAddToCart={handleAddTocart}
            />
          ))
        )}
      </div>
    </div>
  );
}
