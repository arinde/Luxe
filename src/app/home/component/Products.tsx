"use client";
import Image from "next/image";
import { useGetProductsQuery, useGetProductByCategoryQuery } from "@/store/api/productApi";
import ProductSkeleton from "../../../components/shared/skeletons/ProductSkeleton";
import ProductCard from "../../../components/ui/productCard";
import { Product } from "@/types/type";
import { BadgeVariant } from "../../../components/ui/productCard";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/store/slices/cartSlice";
import type { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { useToast } from "@/components/shared/toast/ToastProvider";

const getBadge = (product: Product): BadgeVariant | undefined => {
  if (product.rating >= 4.8) return "BESTSELLER";
  if (product.stock <= 10) return "NEW";
  if (product.discountPercentage >= 15) return "TRENDING";
  return undefined;
};

export default function ProductsSection() {

  const activeCategory = useAppSelector((state) => state.category.selectedCategory)
  const { data, isLoading, error } = useGetProductByCategoryQuery(activeCategory)
  const storeProducts = data?.products ?? [];
  const dispatch = useDispatch()
  const { showToast } = useToast()

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
    showToast(`${product.title} added to cart`, 'cart')
  }

  const cartItems = useSelector((state: RootState) => state.cart.items)

  return (
    <div className="mx-10">
<h1 className="font-syne font-bold text-2xl tracking-wide text-gray-700 my-8">
  Welcome to the product section
</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))
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
