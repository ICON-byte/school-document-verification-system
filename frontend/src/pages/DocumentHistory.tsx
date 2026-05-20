import { useState, useEffect } from "react";
import { Search, Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
      await fetchDocuments();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setRevokingId(null);
    }
  };

  const exportToPDF = async (doc: Document) => {
    setDownloadingId(doc._id);
    let container: HTMLDivElement | null = null;
    try {
      const qrDataUrl = await QRCode.toDataURL(doc.verificationCode, {
        width: 100,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
      });

      container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "-9999px";
      container.style.left = "-9999px";
      container.style.backgroundColor = "#ffffff";
      container.style.width = "800px";
      container.style.padding = "20px";
      document.body.appendChild(container);

      const getDocumentTitle = () => {
        switch (doc.documentType) {
          case "degree": return "BACHELOR'S DEGREE CERTIFICATE";
          case "diploma": return "DIPLOMA CERTIFICATE";
          case "transcript": return "ACADEMIC TRANSCRIPT";
          case "statement": return "STATEMENT OF RESULT";
          default: return "OFFICIAL DOCUMENT";
        }
      };

      const issueDateFormatted = new Date(doc.issueDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      container.innerHTML = `
        <div style="font-family: sans-serif; max-width: 100%; position: relative;">
          <div style="position: absolute; inset: 0; pointer-events: none; border: 1px solid rgba(102,153,255,0.2); border-radius: 8px;"></div>
          <div style="position: absolute; top: 0; left: 0; width: 32px; height: 32px; border-top: 2px solid rgba(102,153,255,0.3); border-left: 2px solid rgba(102,153,255,0.3); border-top-left-radius: 6px;"></div>
          <div style="position: absolute; top: 0; right: 0; width: 32px; height: 32px; border-top: 2px solid rgba(102,153,255,0.3); border-right: 2px solid rgba(102,153,255,0.3); border-top-right-radius: 6px;"></div>
          <div style="position: absolute; bottom: 0; left: 0; width: 32px; height: 32px; border-bottom: 2px solid rgba(102,153,255,0.3); border-left: 2px solid rgba(102,153,255,0.3); border-bottom-left-radius: 6px;"></div>
          <div style="position: absolute; bottom: 0; right: 0; width: 32px; height: 32px; border-bottom: 2px solid rgba(102,153,255,0.3); border-right: 2px solid rgba(102,153,255,0.3); border-bottom-right-radius: 6px;"></div>
          <div style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              <div>
                <h1 style="font-size: 24px; font-weight: bold; color: #1e293b;">NEO CLOUD</h1>
                <p style="font-size: 10px; color: #64748b; text-transform: uppercase;">Academic & Records Office</p>
              </div>
              <div style="width: 40px; height: 40px; background: #f8fafc; border-radius: 9999px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(102,153,255,0.2);">
                <img src="/logo-Neo-2.png" alt="Logo" style="width: 28px; height: 28px; object-fit: contain;" />
              </div>
            </div>
            <div style="text-align: center; margin-bottom: 16px;">
              <h2 style="font-size: 20px; font-weight: bold; color: #1e293b; text-transform: uppercase; letter-spacing: 1px;">${getDocumentTitle()}</h2>
              <p style="font-size: 10px; color: #64748b; margin-top: 4px;">This certifies that</p>
            </div>
            <div style="text-align: center; margin-bottom: 16px;">
              <p style="font-size: 28px; font-family: serif; font-weight: bold; color: #1e293b; border-bottom: 1px solid rgba(102,153,255,0.2); display: inline-block; padding-bottom: 2px; padding-left: 16px; padding-right: 16px;">
                ${doc.studentId?.fullName || "Student Name"}
              </p>
            </div>
            <div style="text-align: center; color: #475569; font-size: 12px; margin-bottom: 24px;">
              ${doc.documentType === "degree" ? `
                <p>has successfully completed all requirements for the degree of</p>
                <p style="font-size: 16px; font-family: serif; font-weight: 600; color: #6699FF;">Bachelor of Science in Computer Science</p>
                <p>with all rights, privileges, and honors thereunto appertaining.</p>
              ` : doc.documentType === "diploma" ? `
                <p>has successfully completed the program of study and is hereby awarded the</p>
                <p style="font-size: 16px; font-family: serif; font-weight: 600; color: #6699FF;">Diploma in Information Technology</p>
                <p>in recognition of academic achievement.</p>
              ` : `
                <p style="font-size: 14px; font-weight: 500;">Academic Record</p>
              `}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 16px;">
              <div style="font-size: 10px; line-height: 1.3;">
                <p>Issued: ${issueDateFormatted}</p>
                <p>Admission: ${doc.studentId?.admissionNo || "N/A"}</p>
              </div>
              <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
                <img src="${qrDataUrl}" style="width: 50px; height: 50px; border: 1px solid #e2e8f0; border-radius: 4px;" />
                <p style="font-size: 8px; text-transform: uppercase; color: #94a3b8; font-weight: bold; margin-top: 4px;">Verification Code</p>
                <p style="font-size: 9px; font-family: monospace; font-weight: bold; color: #6699FF;">${doc.verificationCode}</p>
              </div>
            </div>
            <div style="margin-top: 24px; padding-top: 8px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 9px;">
              <div style="text-align: center; width: 33%;">
                <div style="width: 100%; height: 1px; background: #cbd5e1; margin-bottom: 4px;"></div>
                <p>Registrar's Signature</p>
              </div>
              <div style="text-align: center; width: 33%;">
                <div style="width: 100%; height: 1px; background: #cbd5e1; margin-bottom: 4px;"></div>
                <p>Academic Dean</p>
              </div>
              <div style="text-align: center; width: 33%;">
                <div style="display: flex; justify-content: center; margin-bottom: 4px;">
                  <div style="width: 28px; height: 28px; border-radius: 9999px; border: 1px solid rgba(102,153,255,0.4); display: flex; align-items: center; justify-content: center;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6699FF" stroke-width="1.5"><path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z"/></svg>
                  </div>
                </div>
                <p>University Seal</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 12px; font-size: 8px; color: #94a3b8; text-transform: uppercase;">
              Electronically verified – check QR code
            </div>
          </div>
        </div>
      `;

      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`certificate_${doc.documentType}_${doc.verificationCode}.pdf`);

      toast({ title: "Success", description: "Certificate downloaded successfully!" });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({ title: "Error", description: "Failed to download certificate", variant: "destructive" });
    } finally {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      setDownloadingId(null);
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
        {/* Header - Reverted to your exact layout */}
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
                />
              </div>

              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="h-11 px-3 rounded-md border-none bg-white shadow-sm text-sm cursor-pointer"
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
          </Card>
        ) : (
          <>
            {/* Mobile View (Cards) - Reverted design to use your logic */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {filteredDocuments.map((doc) => (
                <Card key={doc._id} className="bg-white p-5 shadow-md border-none rounded-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-bold text-black">{doc.studentId?.fullName || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{doc.studentId?.admissionNo || "N/A"}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full ${doc.status === "issued" ? "bg-slate-50 text-[#6699ff]" : "bg-slate-50 text-black"
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
                    {doc.status === "issued" && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => exportToPDF(doc)}
                          disabled={downloadingId === doc._id}
                          className="flex-1 text-xs h-8 bg-[#6699ff] hover:bg-[#5588ee]"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          {downloadingId === doc._id ? "..." : "Download"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevoke(doc._id)}
                          disabled={revokingId === doc._id}
                          className="flex-1 text-xs h-8 bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          {revokingId === doc._id ? "..." : "Revoke"}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table - REVERTED TO ORIGINAL BUT FIXED BREAKPOINT */}
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
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${doc.status === "issued" ? "text-[#6699ff]" : "text-black"
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
                            <div className="flex flex-col items-stretch gap-1.5">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => exportToPDF(doc)}
                                disabled={downloadingId === doc._id}
                                className="h-7 px-2 text-[11px] bg-[#6699ff] hover:bg-[#5588ee] whitespace-nowrap"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                {downloadingId === doc._id ? "..." : "Download"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRevoke(doc._id)}
                                disabled={revokingId === doc._id}
                                className="h-7 px-2 text-[11px] bg-red-600 hover:bg-red-700 whitespace-nowrap"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                {revokingId === doc._id ? "..." : "Revoke"}
                              </Button>
                            </div>
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

        {/* Pagination - Original Design */}
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