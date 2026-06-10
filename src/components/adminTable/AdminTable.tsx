"use client"
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableCell, TableRow, TableBody, TableHead, TableHeader } from "../ui/table"
import { Product } from "@/types/type"
import { useGetProductsQuery } from "@/store/api/productApi";
import { useMemo, useState } from "react";
interface AdminDataProps {
    product: Product,
    total: number,
    restock: () => void;
    inStock?: boolean;
}

export default function AdminData() {

    const { data, isLoading, error} = useGetProductsQuery()
    const [inStock, setInStock] = useState(true)
    // const {} = data()
    const [productData, setProductData] = useState(data)
    const columnHelper = createColumnHelper<AdminDataProps>()

    const column = useMemo(() => [
        columnHelper.display({
            id: 'index',
            header: "#",
            cell: (info) => info.row.index + 1
        }),
        columnHelper.accessor('product.title', {
            header: 'Product Name',
            cell: (info) =>( 
            <span className="font-mono text-xs">{info.getValue()}</span>
        )
        }),
        columnHelper.accessor('product.price', {
            header: 'Product Price',
            cell: (info) =>( 
            <span className="font-mono text-xs">{info.getValue()}</span>
        )
        }),
        columnHelper.accessor('product.brand', {
            header: 'Product Brand',
            cell: (info) =>( 
            <span className="font-mono text-xs">{info.getValue()}</span>
        )
        }),
        columnHelper.accessor('product.category', {
            header: 'Product Category',
            cell: (info) =>( 
            <span className="font-mono text-xs">{info.getValue()}</span>
        )
        }),
        columnHelper.accessor('product.stock', {
            header: 'Product Stock',
            cell: (info) =>( 
            <span className="font-mono text-xs">{info.getValue()}</span>
        )
        }),
        columnHelper.accessor('product.rating', {
            header: 'Product Rating',
            cell: (info) =>( 
            <span className="font-mono text-xs">{info.getValue()}</span>
        )
        }),
        columnHelper.display({
            id: 'stock',
            header: 'Restock',
            cell: (info) =>( 
            <button
            onClick={() => setInStock(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-[#2A2A2A] text-[#888888] text-xs font-medium rounded-lg hover:border-[#E8C547] hover:text-[#E8C547] transition-colors cursor-pointer"
          >
           
            Receipt
          </button>
        ),
        }),
    ], [columnHelper])
    const table = useReactTable({
        data,
        column,
        getCoreRowModel: getCoreRowModel(),
    })
    return(
        <div>
            <h2>Table</h2>
        </div>
    )
}