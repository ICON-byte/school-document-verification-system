import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { FileText, Download, Search, ChevronDown, Award, GraduationCap, ScrollText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Student {
  _id: string;
  admissionNo: string;
  fullName: string;
  className: string;
  dateOfBirth?: string;
  parentContact?: string;
  isActive: boolean;
  profileImageUrl?: string;
}

interface Document {
  _id: string;
  studentId: Student;
  documentType: string;
  issueDate: string;
  verificationCode: string;
  content: any;
  status: string;
}

const documentTypes = [
  { value: "degree", label: "Bachelor's Degree Certificate", icon: GraduationCap },
  { value: "diploma", label: "Diploma Certificate", icon: Award },
  { value: "transcript", label: "Academic Transcript", icon: ScrollText },
  { value: "statement", label: "Statement of Result", icon: FileText },
];

const formatCertificateNumber = (code: string): string => {
  if (!code) return "No. 0000/0000.0.0/00-0000";
  const clean = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  if (clean.length >= 12) {
    return `No. ${clean.slice(0, 4)}/${clean.slice(4, 8)}.${clean.slice(8, 10)}/${clean.slice(10, 12)}-${clean.slice(12, 16)}`;
  }
  return `No. ${clean}`;
};

const GenerateDocument = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [docType, setDocType] = useState("");
  const [generated, setGenerated] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const selectedStudentObj = students.find((s) => s._id === selectedStudent);

  useEffect(() => {
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.overscrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_BASE}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudent(studentId);
    setSearchQuery("");
    setIsDropdownOpen(false);
    const student = students.find((s) => s._id === studentId);
    if (student) setSearchQuery(student.fullName);
  };

  useEffect(() => {
    const generateQR = async () => {
      if (!generated?.verificationCode) {
        setQrDataUrl(null);
        return;
      }
      setQrLoading(true);
      setQrError(false);
      try {
        const url = await QRCode.toDataURL(generated.verificationCode, {
          width: 140,
          margin: 1,
          color: { dark: "#6699FF", light: "#FFFFFF" },
        });
        setQrDataUrl(url);
      } catch (err) {
        setQrError(true);
      } finally {
        setQrLoading(false);
      }
    };
    generateQR();
  }, [generated]);

  const handleGenerate = async () => {
    if (!selectedStudent || !docType) {
      toast({ title: "Missing fields", description: "Please select both student and document type", variant: "destructive" });
      return;
    }
    setLoading(true);
    setQrDataUrl(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`${API_BASE}/documents/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          documentType: docType,
          content: { className: selectedStudentObj?.className || "Computer Science", records: [] },
        }),
      });
      if (!res.ok) throw new Error("Failed to generate document");
      const data = await res.json();
      setGenerated(data.document);
      toast({ title: "Success", description: "Document generated successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    setExporting(true);
    try {
      // Step 1: Wait for QR image
      const qrImg = element.querySelector('img[alt="QR Code"]') as HTMLImageElement;
      if (qrImg && !qrImg.complete) {
        await new Promise((resolve) => {
          qrImg.onload = resolve;
          qrImg.onerror = resolve;
        });
      }

      // Step 2: Use html2canvas with specific settings to lock the view
      const canvas = await html2canvas(element, {
        scale: 3, // High quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        // This is key: ensure the capture happens at the current element's width
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById("certificate-preview");
          if (clonedEl) {
            clonedEl.style.overflow = "visible";
            clonedEl.style.height = "auto";
            clonedEl.style.transform = "none"; // Remove any preview scaling
          }
        },
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate height to maintain aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add image centered vertically
      pdf.addImage(imgData, "PNG", 0, (pdfHeight - imgHeight) / 2, pdfWidth, imgHeight);
      pdf.save(`certificate_${generated?.documentType}_${new Date().toISOString().split("T")[0]}.pdf`);
      
      toast({ title: "Success", description: "PDF downloaded successfully!" });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({ title: "Error", description: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const fieldOfStudy = selectedStudentObj?.className || generated?.content?.className || "Computer Science";

  const displayIssueDate = generated?.issueDate
    ? new Date(generated.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const certificateNumber = generated?.verificationCode
    ? formatCertificateNumber(generated.verificationCode)
    : "No. 0000/0000.0.0/00-0000";

  const getDocumentTitle = () => {
    switch (docType) {
      case "degree": return "BACHELOR'S DEGREE CERTIFICATE";
      case "diploma": return "DIPLOMA CERTIFICATE";
      case "transcript": return "ACADEMIC TRANSCRIPT";
      case "statement": return "STATEMENT OF RESULT";
      default: return "CERTIFICATE";
    }
  };

  const getAwardText = () => {
    switch (docType) {
      case "degree":
        return `has been conferred the degree of Bachelor of Science in ${fieldOfStudy} with all the rights, privileges, and honors thereunto appertaining.`;
      case "diploma":
        return `has successfully completed the prescribed program of study and is hereby awarded the Diploma in ${fieldOfStudy} in recognition of academic achievement and proficiency.`;
      case "transcript":
        return `This official Academic Transcript is issued to certify the academic record and credits earned in ${fieldOfStudy}.`;
      case "statement":
        return `This Statement of Result is issued to confirm the examination results and academic performance in ${fieldOfStudy}.`;
      default:
        return `has met all requirements and is hereby awarded this certification in ${fieldOfStudy}.`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 pb-20 md:p-8 md:pb-20 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Document Generator</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Create official certificates and academic records</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 md:gap-8">
          {/* Configuration Panel */}
          <Card className="bg-white border-0 rounded-xl shadow-lg p-6 order-2 lg:order-1 h-fit">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Configure Document</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Select Student</Label>
                <div className="relative">
                  <div
                    className="flex items-center justify-between h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className={selectedStudent ? "text-slate-700" : "text-slate-400"}>
                      {selectedStudentObj ? selectedStudentObj.fullName : "Choose a student"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                      <div className="p-2 border-b border-slate-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6699FF]"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {filteredStudents.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-slate-400">No students found</div>
                        ) : (
                          filteredStudents.map((student) => (
                            <div
                              key={student._id}
                              className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                              onClick={() => handleSelectStudent(student._id)}
                            >
                              {student.fullName} ({student.admissionNo})
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Document Type</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="h-12 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#6699FF]/20">
                    <SelectValue placeholder="Choose document type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-xl">
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4 text-slate-500" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full h-12 rounded-lg bg-[#6699FF] hover:bg-[#5588ee] text-white font-bold shadow-md active:scale-[0.98]"
              >
                {loading ? "Generating..." : "Generate Document"}
              </Button>
            </div>
          </Card>

          {/* Certificate Preview */}
          <div className="order-1 lg:order-2">
            {generated ? (
              <Card className="bg-white border-0 rounded-xl shadow-xl overflow-hidden">
                <div className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white">
                  <h2 className="text-base md:text-lg font-semibold text-slate-800">Certificate Preview</h2>
                  <Button
                    variant="outline"
                    onClick={exportToPDF}
                    disabled={exporting}
                    size="sm"
                    className="rounded-lg border-slate-200 shadow-sm hover:bg-slate-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {exporting ? "Exporting..." : "Export PDF"}
                  </Button>
                </div>

                <div className="p-3 md:p-4 bg-slate-100 overflow-x-auto flex justify-center">
                  <div
                    ref={certificateRef}
                    id="certificate-preview"
                    className="w-full max-w-[800px] bg-white shadow-2xl rounded-lg"
                  >
                    <div className="relative bg-gradient-to-br from-white to-slate-50">
                      {/* Original Border lines */}
                      <div className="absolute inset-4 pointer-events-none border-2 border-[#6699FF] rounded-sm" />
                      <div className="absolute inset-6 pointer-events-none border border-[#a0c0ff] rounded-sm" />

                      {/* Original Corner decorations */}
                      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#6699FF]" />
                      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#6699FF]" />
                      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#6699FF]" />
                      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#6699FF]" />

                      <div className="p-8 md:p-12 relative z-10">
                        {/* Header with Logo */}
                        <div className="text-center mb-6">
                          <div className="flex justify-center items-center gap-4 mb-2">
                            <div className="h-px w-12 bg-[#6699FF]" />
                            <div className="w-16 h-16 flex items-center justify-center">
                              <img
                                src="/logo-Neo.png"
                                alt="Neo Cloud Logo"
                                className="max-w-full max-h-full object-contain"
                                crossOrigin="anonymous"
                              />
                            </div>
                            <div className="h-px w-12 bg-[#6699FF]" />
                          </div>
                          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide text-[#2c3e50]">Neo Cloud</h1>
                          <p className="text-sm md:text-base tracking-wider text-[#6699FF] font-medium">ICT SKILLS ANYWHERE</p>
                          <div className="w-24 h-px bg-[#6699FF] mx-auto my-3" />
                        </div>

                        {/* Certificate Title */}
                        <div className="text-center mb-4">
                          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2c3e50] uppercase tracking-wider border-b-2 border-[#6699FF] inline-block pb-1 px-4">
                            {getDocumentTitle()}
                          </h2>
                        </div>

                        {/* Certificate Number */}
                        <div className="text-right mb-5">
                          <p className="text-sm font-mono text-[#6699FF] bg-[#f0f4ff] inline-block px-3 py-1 rounded border border-[#a0c0ff]">
                            {certificateNumber}
                          </p>
                        </div>

                        {/* Main Body with Profile Picture */}
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                          <div className="flex-shrink-0">
                            {selectedStudentObj?.profileImageUrl ? (
                              <img
                                src={selectedStudentObj.profileImageUrl}
                                alt="Profile"
                                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-[#6699FF] shadow-md"
                                crossOrigin="anonymous"
                              />
                            ) : (
                              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-slate-100 border-2 border-[#6699FF] flex items-center justify-center shadow-md">
                                <User className="w-12 h-12 text-[#6699FF]" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 text-center md:text-left">
                            <p className="text-base md:text-lg text-slate-600 italic mb-1">This Certificate is presented to</p>
                            <p className="text-2xl md:text-3xl font-serif font-bold text-[#2c3e50] border-b-2 border-dotted border-[#6699FF] inline-block px-4 pb-1 mb-3">
                              {selectedStudentObj?.fullName || "Student Name"}
                            </p>
                            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                              {getAwardText()}
                            </p>
                          </div>
                        </div>

                        {/* Additional details row */}
                        <div className="flex justify-between items-center text-xs md:text-sm text-slate-500 mb-5 border-t border-[#a0c0ff] pt-3">
                          <div>
                            <span className="font-bold">Admission No:</span> {selectedStudentObj?.admissionNo || "N/A"}
                          </div>
                          <div>
                            <span className="font-bold">Field of Study:</span> {fieldOfStudy}
                          </div>
                          <div>
                            <span className="font-bold">Date of Issue:</span> {displayIssueDate}
                          </div>
                        </div>

                        {/* Signatures and Seal Section */}
                        <div className="flex justify-between items-end mt-6">
                          <div className="text-center w-1/3">
                            <div className="w-32 h-px bg-[#2c3e50] mx-auto mb-1" />
                            <p className="text-xs font-serif text-[#2c3e50]">Registrar's Signature</p>
                            <p className="text-[10px] text-slate-400">(Authority)</p>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full border-2 border-[#6699FF] flex items-center justify-center bg-[#f0f4ff] mx-auto">
                              <Award className="w-8 h-8 text-[#6699FF]" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">Official Seal</p>
                          </div>
                          <div className="text-center w-1/3">
                            <div className="w-32 h-px bg-[#2c3e50] mx-auto mb-1" />
                            <p className="text-xs font-serif text-[#2c3e50]">Director's Signature</p>
                            <p className="text-[10px] text-slate-400">(Academic Dean)</p>
                          </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="mt-6 flex justify-between items-end border-t border-[#a0c0ff] pt-3">
                          <div className="text-left">
                            <p className="text-[10px] text-slate-400">Electronically Verified Document</p>
                          </div>
                          <div className="text-center">
                            <div className="bg-white p-1 rounded border border-[#6699FF] inline-block min-w-[65px] min-h-[65px] flex items-center justify-center">
                              {qrLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#6699FF]"></div>
                              ) : qrError ? (
                                <div className="text-[10px] text-red-500">QR Error</div>
                              ) : qrDataUrl ? (
                                <img
                                  src={qrDataUrl}
                                  alt="QR Code"
                                  width={55}
                                  height={55}
                                  crossOrigin="anonymous"
                                />
                              ) : (
                                <div className="text-[10px] text-slate-400">No QR</div>
                              )}
                            </div>
                            <p className="text-[8px] uppercase text-slate-400 font-bold mt-1">Verification Code</p>
                            <p className="text-[9px] font-mono text-[#6699FF] break-all max-w-[120px] mx-auto">
                              {generated.verificationCode || "MISSING"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-slate-400">Issue ID: {generated._id?.slice(-8)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-[400px] md:h-[500px] bg-white rounded-xl shadow-md flex flex-col items-center justify-center text-center p-8 md:p-12">
                <FileText className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-slate-800">No Preview Available</h3>
                <p className="text-slate-400 max-w-sm mt-2 text-sm md:text-base">Select a student and document type to generate an official certificate or academic record.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateDocument;