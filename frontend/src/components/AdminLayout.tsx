// AdminLayout.tsx
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content area – with left margin on desktop to accommodate fixed sidebar */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header with hamburger button */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-3 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="mr-3">
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-slate-800">Admin Portal</h1>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;