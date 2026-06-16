"use client";

import { Product } from "@/types/type";
import { useGetProductsQuery } from "@/store/api/productApi";
import { useMemo } from "react";
import DataTable from "@/components/ui/data-table";
import getProductsColumn from "@/app/admin/component/productColumn";
import TableSkeleton from "@/components/shared/skeletons/TableSkeleton";

export default function AdminData() {
  const { data, isLoading, error } = useGetProductsQuery();

  const handleRestock = (product: Product) => {
    console.log('Restocked clicked for:', product)
  }

  const columns = useMemo(() => getProductsColumn(handleRestock), []);

  if (isLoading) return <TableSkeleton rows={8} columns={9} />;
  if (error) return <div className="text-center py-20"><p className="text-[#E05A5A] text-sm">Failed to load products.</p></div>;

  return (
    <DataTable
      columns={columns}
      data={data?.products ?? []}
      emptyMessage="No products found."
    />
  );
}
