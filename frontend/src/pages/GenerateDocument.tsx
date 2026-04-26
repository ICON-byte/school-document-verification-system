import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FileText, Download, Search, ChevronDown, Award, GraduationCap, ScrollText } from "lucide-react";
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

const GenerateDocument = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [docType, setDocType] = useState("");
  const [generated, setGenerated] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

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
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Not authenticated", variant: "destructive" });
        return;
      }
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

  const handleGenerate = async () => {
    if (!selectedStudent || !docType) {
      toast({ title: "Missing fields", description: "Please select both student and document type", variant: "destructive" });
      return;
    }
    setLoading(true);
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
          content: { program: "Computer Science", records: [] },
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
    const certificateElement = document.getElementById("certificate-preview");
    if (!certificateElement) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`certificate_${generated?.documentType}_${new Date().toISOString().split("T")[0]}.pdf`);
      toast({ title: "Success", description: "PDF downloaded successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const selectedStudentObj = students.find((s) => s._id === selectedStudent);

  const getDocumentTitle = () => {
    switch(docType) {
      case "degree": return "BACHELOR'S DEGREE CERTIFICATE";
      case "diploma": return "DIPLOMA CERTIFICATE";
      case "transcript": return "ACADEMIC TRANSCRIPT";
      case "statement": return "STATEMENT OF RESULT";
      default: return "OFFICIAL DOCUMENT";
    }
  };

  const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-100 p-4 pb-20 md:p-8 md:pb-20 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Document Generator</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Create official certificates and academic records</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 md:gap-8">
          {/* Configuration Panel */}
          <Card className="bg-white border-0 rounded-xl shadow-lg p-6 order-2 lg:order-1">
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

                <div className="p-3 md:p-4 bg-slate-100 overflow-x-auto">
                  <div id="certificate-preview" className="mx-auto w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="relative">
                      <div className="absolute inset-0 pointer-events-none border border-[#6699FF]/20 rounded-lg" />
                      <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-[#6699FF]/30 rounded-tl-md" />
                      <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-[#6699FF]/30 rounded-tr-md" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-[#6699FF]/30 rounded-bl-md" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-[#6699FF]/30 rounded-br-md" />

                      <div className="p-3 md:p-5 relative z-10">
                        <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                          <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800">NEO CLOUD</h1>
                            <p className="text-[8px] md:text-[10px] text-slate-500 uppercase">Academic & Records Office</p>
                          </div>
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-full flex items-center justify-center border border-[#6699FF]/20">
                            <img src="/logo-Neo-2.png" alt="Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
                          </div>
                        </div>

                        <div className="text-center mb-2">
                          <h2 className="text-base md:text-xl font-bold text-slate-800 uppercase tracking-wide">
                            {getDocumentTitle()}
                          </h2>
                          <p className="text-[8px] md:text-[10px] text-slate-500 mt-1">This certifies that</p>
                        </div>

                        <div className="text-center mb-2">
                          <p className="text-xl md:text-2xl font-serif font-bold text-slate-800 border-b border-[#6699FF]/20 inline-block pb-0.5 px-3 md:px-4">
                            {generated.studentId?.fullName || "Student Name"}
                          </p>
                        </div>

                        <div className="text-center text-slate-600 space-y-0.5 mb-3 text-[10px] md:text-xs">
                          {docType === "degree" && (
                            <>
                              <p>has successfully completed all requirements for the degree of</p>
                              <p className="text-sm md:text-base font-serif font-semibold text-[#6699FF]">
                                Bachelor of Science in Computer Science
                              </p>
                              <p>with all rights, privileges, and honors thereunto appertaining.</p>
                            </>
                          )}
                          {docType === "diploma" && (
                            <>
                              <p>has successfully completed the program of study and is hereby awarded the</p>
                              <p className="text-sm md:text-base font-serif font-semibold text-[#6699FF]">
                                Diploma in Information Technology
                              </p>
                              <p>in recognition of academic achievement.</p>
                            </>
                          )}
                          {(docType === "transcript" || docType === "statement") && (
                            <p className="text-xs md:text-sm font-medium">Academic Record</p>
                          )}
                        </div>

                        <div className="flex justify-between items-end border-t border-slate-200 pt-3 mt-2">
                          <div className="text-left text-[8px] md:text-[10px] leading-tight">
                            <p>Issued: {issueDate}</p>
                            <p>Admission: {generated.studentId?.admissionNo || "N/A"}</p>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <div className="bg-white p-1 rounded border border-slate-200">
                              <QRCodeSVG value={generated.verificationCode} size={40} />
                            </div>
                            <p className="text-[7px] md:text-[8px] uppercase text-slate-400 font-bold mt-1">Verification Code</p>
                            <p className="text-[8px] md:text-[9px] font-mono font-bold text-[#6699FF]">{generated.verificationCode}</p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 flex justify-between items-end text-[7px] md:text-[9px]">
                          <div className="text-center w-1/3">
                            <div className="w-full h-px bg-slate-300 mb-0.5" />
                            <p>Registrar's Signature</p>
                          </div>
                          <div className="text-center w-1/3">
                            <div className="w-full h-px bg-slate-300 mb-0.5" />
                            <p>Academic Dean</p>
                          </div>
                          <div className="text-center w-1/3">
                            <div className="flex justify-center mb-0.5">
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-[#6699FF]/40 flex items-center justify-center">
                                <Award className="w-3 h-3 md:w-4 md:h-4 text-[#6699FF]/60" />
                              </div>
                            </div>
                            <p>University Seal</p>
                          </div>
                        </div>

                        <div className="text-center mt-2 text-[6px] md:text-[8px] text-slate-400 uppercase">
                          Electronically verified – check QR code
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