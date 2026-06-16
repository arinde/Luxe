import Breadcrumb from "@/components/ui/breadCrumb"
import AnalyticsSection from "./components/AnalyticsSection"
import ProductLogChart from "./components/ProductLogChart"
export default function Analytics () {
    return (
    <div className="min-h-screen bg-[#0C0C0C] px-6 py-10 text-white">
            <Breadcrumb />
            <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
            <AnalyticsSection />
            <ProductLogChart />
        </div>
    )
}