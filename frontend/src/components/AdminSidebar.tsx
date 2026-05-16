import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, History, LogOut, ShieldCheck, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/students", icon: Users, label: "Students" },
  { to: "/admin/generate", icon: FileText, label: "Generate Document" },
  { to: "/admin/history", icon: History, label: "Document History" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar – different behaviour on desktop vs mobile */}
      <aside
        className={`
          fixed top-0 left-0 z-50 w-64 bg-slate-50 shadow-xl flex flex-col
          transition-transform duration-300
          lg:relative lg:translate-x-0 lg:z-auto lg:min-h-screen
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          h-full lg:h-auto overflow-y-auto
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6699FF] to-[#4a7fdb] flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm tracking-tight">DocVerify</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-500"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 pb-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-[#6699FF] text-white shadow-md shadow-blue-400/20" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#6699FF]"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon 
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-[#6699FF]"
                    }`} 
                    strokeWidth={1.75}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" strokeWidth={2} />}
              </Link>
            );
          })}
          {/* Sign Out – directly under Document History */}
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-red-500 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.75} />
            <span>Sign Out</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;