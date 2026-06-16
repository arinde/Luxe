import AdminData from "@/app/admin/component/AdminTable";
import Breadcrumb from "@/components/ui/breadCrumb";
import AnalyticsSection from "./analytics/components/AnalyticsSection";
import Link from "next/link";
import { MoveRightIcon } from "lucide-react";

export default function adminSection() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] px-6 py-10 text-white">
      <Breadcrumb />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-[#F5F5F3] font-['Syne'] text-2xl font-semibold mb-8">
          Admin Product Tracking Board
        </h1>
        <Link href='/admin/analytics' className="flex gap-2 text-sm hover:text-gray-400"><MoveRightIcon /> Go to the analytic section </Link>
        <AdminData />
        
      </div>
    </div>
  );
}
