import AdminData from "@/components/adminTable/AdminTable"
import Breadcrumb from "@/components/ui/breadCrumb"

export default function adminSection() {
    return(
        <div className="min-h-screen bg-[#0C0C0C] px-6 py-10 text-white">
            <Breadcrumb />
            <h1>Admin Goods and transactions Monotring table</h1>
            <div>
                <AdminData />
            </div>
        </div> 
    )
}