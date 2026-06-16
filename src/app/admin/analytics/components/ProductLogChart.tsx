'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function ProductLogChart() {
  const productEvents = useAppSelector((state) => state.analytics?.productEvents ?? [])

  const { transformedData, totalAdds, totalRemoves, topProduct, uniqueProducts } = useMemo(() => {
    // Group events by date (day)
    const eventsByDate = productEvents.reduce((acc, event) => {
      const date = new Date(event.timeStamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
      
      if (!acc[date]) {
        acc[date] = { date, add: 0, remove: 0, total: 0 }
      }
      
      if (event.action === 'add') {
        acc[date].add += 1
      } else {
        acc[date].remove += 1
      }
      acc[date].total += 1
      
      return acc
    }, {} as Record<string, { date: string; add: number; remove: number; total: number }>)

    // Convert to array and sort by date
    const transformedData = Object.values(eventsByDate).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

    // Calculate stats
    const totalAdds = productEvents.filter(e => e.action === 'add').length
    const totalRemoves = productEvents.filter(e => e.action === 'remove').length
    
    const productCounts = productEvents.reduce((acc, event) => {
      const key = event.productName
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topProductEntry = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]
    const topProduct = topProductEntry ? topProductEntry[0] : '—'
    const uniqueProducts = Object.keys(productCounts).length

    return { transformedData, totalAdds, totalRemoves, topProduct, uniqueProducts }
  }, [productEvents])

  if (productEvents.length === 0) {
    return (
      <div className="p-5 bg-gray-900 rounded-lg my-6">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Product analytics</p>
          <h2 className="text-xl font-medium text-white">Product Interactions</h2>
        </div>
        <div className="text-center py-16 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No product interaction data yet.</p>
          <p className="text-sm mt-1">Product adds and removes will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 bg-gray-900 rounded-lg my-6">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Product analytics</p>
        <h2 className="text-xl font-medium text-white">Product Interactions</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-4 h-4 text-[#4CAF82]" />
            <p className="text-xs text-gray-400 uppercase tracking-wide">Added to Cart</p>
          </div>
          <p className="text-2xl font-medium text-white">{totalAdds}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[#E05A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Removed</p>
          </div>
          <p className="text-2xl font-medium text-white">{totalRemoves}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-[#E8C547]" />
            <p className="text-xs text-gray-400 uppercase tracking-wide">Top Product</p>
          </div>
          <p className="text-sm font-medium text-white truncate" title={topProduct}>{topProduct}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-[#3B82F6]" />
            <p className="text-xs text-gray-400 uppercase tracking-wide">Unique Products</p>
          </div>
          <p className="text-2xl font-medium text-white">{uniqueProducts}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            stroke="#4b5563"
          />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            allowDecimals={false}
            stroke="#4b5563"
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151', 
              borderRadius: 8,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
            }}
            labelStyle={{ color: '#f9fafb', fontWeight: 600 }}
            itemStyle={{ color: '#f9fafb' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '16px' }}
            formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
          />
          <Line 
            type="monotone" 
            dataKey="add" 
            name="Added to Cart"
            stroke="#4CAF82" 
            strokeWidth={3}
            dot={{ fill: '#4CAF82', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#4CAF82', stroke: '#fff', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="remove" 
            name="Removed from Cart"
            stroke="#E05A5A" 
            strokeWidth={3}
            dot={{ fill: '#E05A5A', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#E05A5A', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Total Interactions</p>
          <p className="text-lg font-semibold text-white">{productEvents.length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Add Rate</p>
          <p className="text-lg font-semibold text-[#4CAF82]">
            {productEvents.length > 0 ? Math.round((totalAdds / productEvents.length) * 100) : 0}%
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Remove Rate</p>
          <p className="text-lg font-semibold text-[#E05A5A]">
            {productEvents.length > 0 ? Math.round((totalRemoves / productEvents.length) * 100) : 0}%
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Active Days</p>
          <p className="text-lg font-semibold text-[#E8C547]">{transformedData.length}</p>
        </div>
      </div>
    </div>
  )
}
