import { useState, useEffect } from "react";
import { Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Document {
  _id: string;
  studentId: {
    _id: string;
    fullName: string;
    admissionNo: string;
    className: string;
  };
  documentType: string;
  issueDate: string;
  verificationCode: string;
  status: string;
  createdAt: string;
}

const DocumentHistory = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const { toast } = useToast();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Prevent overscroll beyond top or bottom
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
    fetchDocuments();
  }, [page, limit]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Not authenticated", variant: "destructive" });
        setLoading(false);
        return;
      }

      const url = `${API_BASE}/documents?page=${page}&limit=${limit}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch documents");

      const data = await res.json();
      setDocuments(data.documents);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this document? It will no longer be verifiable.")) return;

    setRevokingId(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/documents/${id}/revoke`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to revoke document");

      toast({ title: "Revoked", description: "Document has been revoked successfully." });
      await fetchDocuments(); // refresh current page
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setRevokingId(null);
    }
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.studentId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      doc.studentId?.admissionNo?.toLowerCase().includes(search.toLowerCase()) ||
      doc.verificationCode?.toLowerCase().includes(search.toLowerCase()) ||
      doc.documentType?.toLowerCase().includes(search.toLowerCase())
  );

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6699ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 pb-16 md:p-8 md:pb-20 font-sans">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-none rounded-md shadow-md p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
                Document History
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Complete audit trail of all issued academic documents
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search student, matric, or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 pl-10 pr-4 w-full text-sm rounded-md border-none bg-slate-50 shadow-sm focus-visible:ring-2 focus-visible:ring-[#6699ff]/20"
                  aria-label="Search documents"
                />
              </div>
              
              {/* Items per page selector */}
              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="h-11 px-3 rounded-md border-none bg-white shadow-sm text-sm cursor-pointer"
                aria-label="Items per page"
                title="Items per page"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <Card className="bg-white border-none rounded-md shadow-lg p-12 text-center">
            <p className="text-slate-500">
              {search ? "No matching documents found on this page." : "No documents have been generated yet."}
            </p>
            {!search && (
              <p className="text-sm text-slate-400 mt-2">
                Generate your first document from the "Generate Document" page.
              </p>
            )}
          </Card>
        ) : (
          <>
            {/* Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {filteredDocuments.map((doc) => (
                <Card key={doc._id} className="bg-white p-5 shadow-md border-none rounded-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-bold text-black">{doc.studentId?.fullName || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{doc.studentId?.admissionNo || "N/A"}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                      doc.status === "issued" ? "bg-slate-50 text-[#6699ff]" : "bg-slate-50 text-black"
                    }`}>
                      {doc.status?.toUpperCase() || "UNKNOWN"}
                    </span>
                  </div>
                  <div className="space-y-2 border-t border-slate-50 pt-3">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Type</span>
                      <span className="text-xs text-[#6699ff] font-bold capitalize">
                        {doc.documentType?.replace(/_/g, " ") || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Code</span>
                      <span className="text-xs font-mono font-medium">{doc.verificationCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Issued</span>
                      <span className="text-xs text-slate-500">
                        {new Date(doc.issueDate).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    {doc.status === "issued" && (
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevoke(doc._id)}
                          disabled={revokingId === doc._id}
                          className="w-full text-xs h-8 bg-red-600 hover:bg-red-700"
                        >
                          {revokingId === doc._id ? "Revoking..." : "Revoke Document"}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table */}
            <Card className="hidden lg:block bg-white border-none rounded-md shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="text-left py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Information</th>
                      <th className="text-left py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matric No.</th>
                      <th className="text-left py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Type</th>
                      <th className="text-center py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="text-right py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Code</th>
                      <th className="text-right py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Issued</th>
                      <th className="text-center py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-5 px-8 font-bold text-sm text-black">
                          {doc.studentId?.fullName || "Unknown"}
                        </td>
                        <td className="py-5 px-8 text-sm text-slate-600">
                          {doc.studentId?.admissionNo || "N/A"}
                        </td>
                        <td className="py-5 px-8 text-sm text-[#6699ff] font-bold capitalize">
                          {doc.documentType?.replace(/_/g, " ") || "N/A"}
                        </td>
                        <td className="py-5 px-8 text-center">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                            doc.status === "issued" ? "text-[#6699ff]" : "text-black"
                          }`}>
                            {doc.status?.toUpperCase() || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-right font-mono text-sm">
                          {doc.verificationCode}
                        </td>
                        <td className="py-5 px-8 text-right text-sm text-slate-500">
                          {new Date(doc.issueDate).toLocaleDateString("en-GB")}
                        </td>
                        <td className="py-5 px-8 text-center">
                          {doc.status === "issued" ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRevoke(doc._id)}
                              disabled={revokingId === doc._id}
                              className="h-8 px-3 text-xs bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              {revokingId === doc._id ? "Revoking..." : "Revoke"}
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* Pagination Controls */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-4">
            <div className="text-sm text-slate-500">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} documents
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-9 px-3"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="px-3 py-1.5 text-sm bg-white rounded-md shadow-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="h-9 px-3"
                aria-label="Next page"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentHistory;