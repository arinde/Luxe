import { createColumnHelper } from "@tanstack/react-table";
import { Product } from "@/types/type";
import { formatCurrency } from "@/lib/utils";

const columnHelper = createColumnHelper<Product>();

export default function getProductsColumn (onRestock : (product: Product) => void) {

    return [
        columnHelper.display({
            id: 'index',
            header: '#',
            cell: (info) => info.row.index + 1
        }),
        columnHelper.accessor('title', {
            header: 'Product Name',
            cell: (info) => (
          <span className="font-mono text-xs">{info.getValue()}</span>
        ),
        }),
        columnHelper.accessor("price", {
        header: "Product Price",
        cell: (info) => (
          <span className="font-mono text-xs">{formatCurrency(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor("brand", {
        header: "Product Brand",
        cell: (info) => (
          <span className="font-mono text-xs">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("category", {
        header: "Product Category",
        cell: (info) => (
          <span className="font-mono text-xs">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("stock", {
        id: 'stockStatus',
        header: "Stock Status",
        cell: (info) => {
          const stock = info.getValue();
          return stock > 0 ? (
            <span className="text-[#4CAF82] font-medium">In Stock</span>
          ) : (
            <span className="text-[#E05A5A] font-medium">Out of Stock</span>
          );
        },
      }),
      columnHelper.accessor("stock", {
        id: 'stockCount',
        header: "Stock Count",
        cell: (info) => {
          const stock = info.getValue();
          return stock > 0 ? (
            <span className="text-[#4CAF82] font-medium">{stock}</span>
          ) : (
            <span className="text-[#E05A5A] font-medium">0</span>
          );
        },
      }),
      columnHelper.accessor("rating", {
        header: "Product Rating",
        cell: (info) => (
          <span className="font-mono text-xs">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "restock",
        header: "Restock",
        cell: (info) => (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-[#2A2A2A] text-[#888888] text-xs font-medium rounded-lg hover:border-[#E8C547] hover:text-[#E8C547] transition-colors cursor-pointer"
            onClick={() => onRestock(info.row.original)}
          >
            Restock
          </button>
        ),
      }),
    ]

}