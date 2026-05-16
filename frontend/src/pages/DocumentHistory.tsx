import { useState, useEffect } from "react";
import { Search, Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

interface Student {
  _id: string;
  fullName: string;
  admissionNo: string;
  className: string;
  photo?: string;
}

interface Document {
  _id: string;
  studentId: Student;
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
    const originalStyle = document.documentElement.style.overscrollBehavior;
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
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
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
      toast({ title: "Revoked", description: "Document revoked successfully." });
      await fetchDocuments();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setRevokingId(null);
    }
  };

  const getPhotoSrc = (photo?: string): string | null => {
    if (!photo || photo.trim() === "") return null;
    if (photo.startsWith("data:image")) return photo;
    return `data:image/jpeg;base64,${photo}`;
  };

  const formatCertificateNumber = (code: string): string => {
    if (!code) return "No. 0000/0000.0.0/00-0000";
    const clean = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (clean.length >= 12) {
      return `No. ${clean.slice(0, 4)}/${clean.slice(4, 8)}.${clean.slice(8, 10)}/${clean.slice(10, 12)}-${clean.slice(12, 16)}`;
    }
    return `No. ${clean}`;
  };

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case "degree": return "BACHELOR'S DEGREE CERTIFICATE";
      case "diploma": return "DIPLOMA CERTIFICATE";
      case "transcript": return "ACADEMIC TRANSCRIPT";
      case "statement": return "STATEMENT OF RESULT";
      default: return "CERTIFICATE";
    }
  };

  const getAwardText = (type: string, field: string) => {
    switch (type) {
      case "degree":
        return `has been conferred the degree of Bachelor of Science in ${field} with all the rights, privileges, and honors thereunto appertaining.`;
      case "diploma":
        return `has successfully completed the prescribed program of study and is hereby awarded the Diploma in ${field} in recognition of academic achievement and proficiency.`;
      case "transcript":
        return `This official Academic Transcript is issued to certify the academic record and credits earned in ${field}.`;
      case "statement":
        return `This Statement of Result is issued to confirm the examination results and academic performance in ${field}.`;
      default:
        return `has met all requirements and is hereby awarded this certification in ${field}.`;
    }
  };

  // --- UPDATED exportToPDF with fresh student data ---
  const exportToPDF = async (doc: Document) => {
    setDownloadingId(doc._id);
    let container: HTMLDivElement | null = null;
    try {
      // 1. Always fetch the latest student details from the backend
      const token = localStorage.getItem("token");
      let freshStudent: Student | null = null;
      if (token && doc.studentId?._id) {
        try {
          const studentRes = await fetch(`${API_BASE}/students/${doc.studentId._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (studentRes.ok) {
            freshStudent = await studentRes.json();
          } else {
            console.warn("Could not fetch fresh student data, using cached info.");
          }
        } catch (err) {
          console.warn("Error fetching fresh student data:", err);
        }
      }

      // 2. Use fresh student data if available, otherwise fallback to document's cached student
      const studentName = freshStudent?.fullName ?? doc.studentId?.fullName ?? "Student Name";
      const admissionNo = freshStudent?.admissionNo ?? doc.studentId?.admissionNo ?? "N/A";
      const fieldOfStudy = freshStudent?.className ?? doc.studentId?.className ?? "Computer Science";
      const studentPhoto = freshStudent?.photo ?? doc.studentId?.photo;
      const photoSrc = getPhotoSrc(studentPhoto);

      // 3. Generate QR code (based on verification code – no change)
      const qrDataUrl = await QRCode.toDataURL(doc.verificationCode, {
        width: 140,
        margin: 1,
        color: { dark: "#6699FF", light: "#FFFFFF" },
      });

      // 4. Build the certificate HTML using the fresh data
      container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "-9999px";
      container.style.left = "-9999px";
      container.style.backgroundColor = "#ffffff";
      container.style.width = "800px";
      container.style.padding = "20px";
      document.body.appendChild(container);

      const title = getDocumentTitle(doc.documentType);
      const issueDateFormatted = new Date(doc.issueDate).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      });
      const certNumber = formatCertificateNumber(doc.verificationCode);
      const awardText = getAwardText(doc.documentType, fieldOfStudy);

      container.innerHTML = `
        <div class="relative bg-gradient-to-br from-white to-slate-50" style="font-family: sans-serif; max-width: 100%;">
          <!-- Outer borders -->
          <div style="position: absolute; inset: 4px; pointer-events: none; border: 2px solid #6699FF; border-radius: 4px;"></div>
          <div style="position: absolute; inset: 6px; pointer-events: none; border: 1px solid #a0c0ff; border-radius: 4px;"></div>
          
          <!-- Corner decorations -->
          <div style="position: absolute; top: 6px; left: 6px; width: 32px; height: 32px; border-top: 2px solid #6699FF; border-left: 2px solid #6699FF;"></div>
          <div style="position: absolute; top: 6px; right: 6px; width: 32px; height: 32px; border-top: 2px solid #6699FF; border-right: 2px solid #6699FF;"></div>
          <div style="position: absolute; bottom: 6px; left: 6px; width: 32px; height: 32px; border-bottom: 2px solid #6699FF; border-left: 2px solid #6699FF;"></div>
          <div style="position: absolute; bottom: 6px; right: 6px; width: 32px; height: 32px; border-bottom: 2px solid #6699FF; border-right: 2px solid #6699FF;"></div>

          <div style="padding: 20px;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: flex; justify-content: center; align-items: center; gap: 16px; margin-bottom: 8px;">
                <div style="height: 1px; width: 48px; background: #6699FF;"></div>
                <div style="width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">
                  <img src="/logo-Neo.png" alt="Logo" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                </div>
                <div style="height: 1px; width: 48px; background: #6699FF;"></div>
              </div>
              <h1 style="font-size: 28px; font-family: serif; font-weight: bold; color: #2c3e50;">Neo Cloud</h1>
              <p style="font-size: 12px; letter-spacing: 1px; color: #6699FF; font-weight: 500;">ICT SKILLS ANYWHERE</p>
              <div style="width: 96px; height: 1px; background: #6699FF; margin: 12px auto;"></div>
            </div>

            <!-- Certificate Title -->
            <div style="text-align: center; margin-bottom: 16px;">
              <h2 style="font-size: 20px; font-family: serif; font-weight: bold; color: #2c3e50; text-transform: uppercase; border-bottom: 2px solid #6699FF; display: inline-block; padding-bottom: 4px; padding-left: 16px; padding-right: 16px;">
                ${title}
              </h2>
            </div>

            <!-- Certificate Number -->
            <div style="text-align: right; margin-bottom: 20px;">
              <span style="font-size: 12px; font-family: monospace; color: #6699FF; background: #f0f4ff; padding: 4px 12px; border-radius: 4px; border: 1px solid #a0c0ff;">
                ${certNumber}
              </span>
            </div>

            <!-- Main body with photo -->
            <div style="display: flex; flex-direction: row; align-items: center; gap: 24px; margin-bottom: 24px;">
              <div style="flex-shrink: 0;">
                ${photoSrc ? `
                  <img src="${photoSrc}" alt="Student Photo" style="width: 96px; height: 96px; border-radius: 50%; object-fit: cover; border: 2px solid #6699FF; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
                ` : `
                  <div style="width: 96px; height: 96px; border-radius: 50%; background: #f1f5f9; border: 2px solid #6699FF; display: flex; align-items: center; justify-content: center;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6699FF" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                `}
              </div>
              <div style="flex: 1; text-align: left;">
                <p style="font-size: 14px; color: #64748b; font-style: italic; margin-bottom: 4px;">This Certificate is presented to</p>
                <p style="font-size: 24px; font-family: serif; font-weight: bold; color: #2c3e50; border-bottom: 1px dotted #6699FF; display: inline-block; padding: 0 16px 4px; margin-bottom: 12px;">
                  ${studentName}
                </p>
                <p style="font-size: 14px; color: #475569; line-height: 1.5;">
                  ${awardText}
                </p>
              </div>
            </div>

            <!-- Details row -->
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #64748b; border-top: 1px solid #a0c0ff; padding-top: 12px; margin-bottom: 20px;">
              <div><strong>Admission No:</strong> ${admissionNo}</div>
              <div><strong>Field of Study:</strong> ${fieldOfStudy}</div>
              <div><strong>Date of Issue:</strong> ${issueDateFormatted}</div>
            </div>

            <!-- Signatures and Seal -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px;">
              <div style="text-align: center; width: 33%;">
                <div style="width: 100%; height: 1px; background: #2c3e50; margin-bottom: 4px;"></div>
                <p style="font-size: 10px; font-family: serif;">Registrar's Signature</p>
                <p style="font-size: 8px; color: #94a3b8;">(Authority)</p>
              </div>
              <div style="text-align: center;">
                <div style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid #6699FF; display: flex; align-items: center; justify-content: center; background: #f0f4ff; margin: 0 auto;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6699FF" stroke-width="1.5"><path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z"/></svg>
                </div>
                <p style="font-size: 8px; color: #94a3b8; margin-top: 4px;">Official Seal</p>
              </div>
              <div style="text-align: center; width: 33%;">
                <div style="width: 100%; height: 1px; background: #2c3e50; margin-bottom: 4px;"></div>
                <p style="font-size: 10px; font-family: serif;">Director's Signature</p>
                <p style="font-size: 8px; color: #94a3b8;">(Academic Dean)</p>
              </div>
            </div>

            <!-- QR Code -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #a0c0ff; padding-top: 12px; margin-top: 24px;">
              <div style="font-size: 8px; color: #94a3b8;">Electronically Verified Document</div>
              <div style="text-align: center;">
                <img src="${qrDataUrl}" style="width: 55px; height: 55px; border: 1px solid #6699FF; border-radius: 4px; padding: 2px; background: white;" />
                <p style="font-size: 7px; text-transform: uppercase; color: #6699FF; font-weight: bold; margin-top: 4px;">Verification Code</p>
                <p style="font-size: 8px; font-family: monospace; color: #6699FF; word-break: break-all; max-width: 120px;">${doc.verificationCode}</p>
              </div>
              <div style="font-size: 8px; color: #94a3b8;">Issue ID: ${doc._id.slice(-8)}</div>
            </div>
          </div>
        </div>
      `;

      // 5. Convert to PDF
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const finalWidth = imgWidth * scale;
      const finalHeight = imgHeight * scale;
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;
      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
      pdf.save(`certificate_${doc.documentType}_${doc.verificationCode}.pdf`);

      toast({ title: "Success", description: "Certificate downloaded with latest student data!" });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({ title: "Error", description: "Failed to download certificate", variant: "destructive" });
    } finally {
      if (container && container.parentNode) container.parentNode.removeChild(container);
      setDownloadingId(null);
    }
  };
  // --- End of updated exportToPDF ---

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
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header - fully responsive */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                Document History
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Complete audit trail of all issued academic documents
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search student, matric, or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 pl-9 pr-3 w-full text-sm rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#6699ff]/20"
                />
              </div>
              <select
                title="Items per page"
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="h-10 px-3 rounded-lg border-slate-200 bg-white shadow-sm text-sm cursor-pointer"
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
          <Card className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
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
            {/* Mobile & Tablet Card View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {filteredDocuments.map((doc) => (
                <Card key={doc._id} className="bg-white p-4 shadow-sm rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{doc.studentId?.fullName || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{doc.studentId?.admissionNo || "N/A"}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ml-2 whitespace-nowrap ${
                      doc.status === "issued" ? "bg-blue-50 text-[#6699ff]" : "bg-slate-100 text-slate-600"
                    }`}>
                      {doc.status?.toUpperCase() || "UNKNOWN"}
                    </span>
                  </div>
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Type</span>
                      <span className="text-xs text-[#6699ff] font-semibold capitalize">
                        {doc.documentType?.replace(/_/g, " ") || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Code</span>
                      <span className="text-xs font-mono text-slate-600 truncate max-w-[150px]">{doc.verificationCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Issued</span>
                      <span className="text-xs text-slate-500">
                        {new Date(doc.issueDate).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    {doc.status === "issued" && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => exportToPDF(doc)}
                          disabled={downloadingId === doc._id}
                          className="w-full text-xs h-8 bg-[#6699ff] hover:bg-[#5588ee]"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          {downloadingId === doc._id ? "..." : "Download"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevoke(doc._id)}
                          disabled={revokingId === doc._id}
                          className="w-full text-xs h-8 bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          {revokingId === doc._id ? "Revoking..." : "Revoke"}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table */}
            <Card className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Matric No.</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Type</th>
                      <th className="text-center py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Verification Code</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Issued</th>
                      <th className="text-center py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-sm text-slate-800 whitespace-nowrap">
                          {doc.studentId?.fullName || "Unknown"}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600 whitespace-nowrap">
                          {doc.studentId?.admissionNo || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-sm text-[#6699ff] font-semibold capitalize whitespace-nowrap">
                          {doc.documentType?.replace(/_/g, " ") || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            doc.status === "issued" ? "text-[#6699ff] bg-blue-50" : "text-slate-600 bg-slate-100"
                          }`}>
                            {doc.status?.toUpperCase() || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-sm text-slate-600 whitespace-nowrap">
                          {doc.verificationCode}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500 whitespace-nowrap">
                          {new Date(doc.issueDate).toLocaleDateString("en-GB")}
                        </td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          {doc.status === "issued" ? (
                            <div className="flex flex-col items-center gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => exportToPDF(doc)}
                                disabled={downloadingId === doc._id}
                                className="h-7 px-3 text-xs bg-[#6699ff] hover:bg-[#5588ee] w-full"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                {downloadingId === doc._id ? "..." : "Download"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRevoke(doc._id)}
                                disabled={revokingId === doc._id}
                                className="h-7 px-3 text-xs bg-red-500 hover:bg-red-600 w-full"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                {revokingId === doc._id ? "Revoking..." : "Revoke"}
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

        {/* Pagination */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <div className="text-sm text-slate-500">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} documents
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-9 px-3 text-sm"
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
                className="h-9 px-3 text-sm"
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