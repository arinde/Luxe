'use client'
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useMemo } from "react";
import { clearAnalytics } from "@/store/slices/analyticsSlice";
import { useToast } from "@/components/shared/toast/ToastProvider";
import { Trash2 } from "lucide-react";

export default function AnalyticsSection() {

  const analyticsData = useAppSelector((state) => state.analytics?.clickEvents ?? [])
  const dispatch = useAppDispatch()
  const { showToast } = useToast()

  const { transformedData, totalClicks, topCategory, uniqueCategories } = useMemo(() => {
    const clickEvents = analyticsData.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const transformedData = Object.entries(clickEvents).map(([category, clicks]) => ({ category, clicks }))
    const totalClicks = analyticsData.length
    const topCategory = transformedData.reduce((a, b) => a.clicks > b.clicks ? a : b, { category: '—', clicks: 0 })
    const uniqueCategories = transformedData.length

    return { transformedData, totalClicks, topCategory, uniqueCategories }
  }, [analyticsData])

  const handleClear = () => {
    dispatch(clearAnalytics())
    showToast('All analytics data cleared', 'info')
  }

  return (
    <div className="p-5 bg-gray-900 rounded-lg my-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Category analytics</p>
          <h2 className="text-xl font-medium text-white">Browse behaviour</h2>
        </div>
        {analyticsData.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Data
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total switches</p>
          <p className="text-2xl font-medium text-white">{totalClicks}</p>
        </div>
        <div className="flex-1 bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Top category</p>
          <p className="text-base font-medium text-white pt-1">{topCategory.category}</p>
        </div>
        <div className="flex-1 bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Explored</p>
          <p className="text-2xl font-medium text-white">{uniqueCategories}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#f9fafb' }}
            itemStyle={{ color: '#E9A800' }}
          />
          <Bar dataKey="clicks" fill="#E9A800" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-2 mt-4">
        {transformedData.map(({ category, clicks }) => (
          <span key={category} className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-md">
            {category} <strong className="text-white">{Math.round((clicks / totalClicks) * 100)}%</strong>
          </span>
        ))}
      </div>
    </div>
  )
}