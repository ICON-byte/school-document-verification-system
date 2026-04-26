import { useEffect, useState } from "react";
import { RefreshCw, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface StatData {
  totalStudents: number;
  totalDocuments: number;
  validDocuments: number;
  revokedDocuments: number;
}

interface RecentDocument {
  _id: string;
  studentId?: {
    fullName: string;
    admissionNo: string;
  };
  documentType: string;
  issueDate: string;
  status: string;
  verificationCode: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatData>({
    totalStudents: 0,
    totalDocuments: 0,
    validDocuments: 0,
    revokedDocuments: 0,
  });
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.documentElement).overscrollBehavior;
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.documentElement.style.overscrollBehavior = originalStyle;
      document.body.style.overscrollBehavior = originalStyle;
    };
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Please login.");
        setLoading(false);
        return;
      }

      // 1. Fetch stats
      try {
        const statsRes = await fetch(`${API_BASE}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsRes.ok) {
          const rawStats = await statsRes.json();
          setStats({
            totalStudents: rawStats.totalStudents ?? 0,
            totalDocuments: rawStats.totalDocuments ?? 0,
            validDocuments: rawStats.validDocuments ?? rawStats.totalDocuments ?? 0,
            revokedDocuments: rawStats.revokedDocuments ?? 0,
          });
        } else if (statsRes.status === 401) {
          throw new Error("Session expired");
        } else {
          console.warn("Stats endpoint returned", statsRes.status);
        }
      } catch (err) {
        console.warn("Stats fetch failed", err);
      }

      // 2. Fetch recent documents (latest 10)
      let docsData: RecentDocument[] = [];
      let docsSuccess = false;

      try {
        const docsRes = await fetch(`${API_BASE}/dashboard/recent?limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (docsRes.ok) {
          const data = await docsRes.json();
          docsData = Array.isArray(data) ? data : (data.documents || []);
          docsSuccess = true;
        }
      } catch (err) {
        console.warn("Primary recent endpoint failed", err);
      }

      if (!docsSuccess) {
        try {
          const fallbackRes = await fetch(`${API_BASE}/documents/recent?limit=10`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            docsData = Array.isArray(data) ? data : (data.documents || []);
            docsSuccess = true;
          }
        } catch (err) {
          console.warn("Fallback recent endpoint failed", err);
        }
      }

      if (docsSuccess && docsData.length > 10) docsData = docsData.slice(0, 10);
      setRecentDocs(docsSuccess ? docsData : []);

      if (!docsSuccess) {
        toast({
          title: "Info",
          description: "Recent documents could not be loaded, but other data is shown.",
          variant: "default",
        });
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err.message);
      if (err.message === "Session expired") {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to connect to server. Make sure backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, description }: any) => (
    <Card className="bg-white border-0 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="text-left">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-black mt-2">{value}</p>
          <p className="text-xs text-[#6699ff] mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6699ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-[#6699ff] text-white rounded-md hover:bg-[#5588ee]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] p-4 md:p-8 font-sans">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header with refresh button - responsive */}
        <div className="bg-white border-none rounded-md shadow-md p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">Overview of your document verification system</p>
            </div>
            <Button
              onClick={fetchDashboardData}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid - fully responsive stack on mobile, grid on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
          <StatCard title="Total Students" value={stats.totalStudents} description="Registered students" />
          <StatCard title="Documents Generated" value={stats.totalDocuments} description="All time" />
          <StatCard title="Valid Documents" value={stats.validDocuments} description="Currently active" />
          <StatCard title="Revoked Documents" value={stats.revokedDocuments} description="Marked invalid" />
        </div>

        {/* Recent Documents Section - mimics DocumentHistory layout */}
        <Card className="bg-white border-none rounded-md shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-black">Recent Documents</h2>
              <p className="text-sm text-slate-500">Latest 10 issued documents</p>
            </div>
            <Link to="/admin/history">
              <Button variant="outline" size="sm" className="gap-1">
                <FileText className="w-4 h-4" />
                View All
              </Button>
            </Link>
          </div>

          {recentDocs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500">No documents found. Generate your first document.</p>
            </div>
          ) : (
            <>
              {/* Mobile view (cards) */}
              <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
                {recentDocs.map((doc) => (
                  <Card key={doc._id} className="bg-white p-4 shadow-sm border border-slate-100 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-bold text-black">{doc.studentId?.fullName || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{doc.studentId?.admissionNo || "N/A"}</p>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-1 rounded-full ${
                          doc.status === "issued" ? "bg-slate-50 text-[#6699ff]" : "bg-slate-50 text-black"
                        }`}
                      >
                        {doc.status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </div>
                    <div className="space-y-2 border-t border-slate-50 pt-2">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Type</span>
                        <span className="text-xs text-[#6699ff] font-bold capitalize">
                          {doc.documentType?.replace(/_/g, " ") || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Issued</span>
                        <span className="text-xs text-slate-500">
                          {doc.issueDate ? new Date(doc.issueDate).toLocaleDateString() : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop view (table) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="text-left py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Student
                      </th>
                      <th className="text-left py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Matric No.
                      </th>
                      <th className="text-left py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Document Type
                      </th>
                      <th className="text-left py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Date Issued
                      </th>
                      <th className="text-left py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentDocs.map((doc, idx) => (
                      <tr
                        key={doc._id}
                        className={`transition-all duration-200 hover:bg-[#6699ff]/5 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="py-4 px-6 font-medium text-sm text-black">
                          {doc.studentId?.fullName || "Unknown"}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          {doc.studentId?.admissionNo || "-"}
                        </td>
                        <td className="py-4 px-6 text-sm text-[#6699ff] font-medium capitalize">
                          {doc.documentType?.replace(/_/g, " ") || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500">
                          {doc.issueDate ? new Date(doc.issueDate).toLocaleDateString() : "Unknown"}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                              doc.status === "issued"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {doc.status?.toUpperCase() || "UNKNOWN"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;