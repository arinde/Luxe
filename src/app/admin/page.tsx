import AdminData from "@/app/admin/component/AdminTable";
import Breadcrumb from "@/components/ui/breadCrumb";

export default function adminSection() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] px-6 py-10 text-white">
      <Breadcrumb />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-[#F5F5F3] font-['Syne'] text-2xl font-semibold mb-8">
          Admin Product Tracking Board
        </h1>
        <AdminData />
      </div>
    </div>
  );
}
