"use client";

import { Product } from "@/types/type";
import { useGetProductsQuery } from "@/store/api/productApi";
import { useMemo } from "react";
import DataTable from "@/components/ui/data-table";
import getProductsColumn from "@/app/admin/component/productColumn";

export default function AdminData() {
  const { data, isLoading, error } = useGetProductsQuery();

  const handleRestock = (product: Product) => {
    console.log('Restocked clicked for:', product)
  }

  const columns = useMemo(() => getProductsColumn(handleRestock), []);

  if (isLoading) return <div className="text-center py-20"><p className="text-[#888888] text-sm">Loading...</p></div>;
  if (error) return <div className="text-center py-20"><p className="text-[#E05A5A] text-sm">Failed to load products.</p></div>;

  return (
    <DataTable
      columns={columns}
      data={data?.products ?? []}
      emptyMessage="No products found."
    />
  );
}
