import { useState } from "react";
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
import { mockStudents, mockRecords, generateVerificationCode, getGradePoint, AcademicRecord } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

// Extended student type
type ExtendedStudent = typeof mockStudents[0] & {
  program?: string;
  yearOfEntry?: string;
  graduationYear?: string;
};

const documentTypes = [
  { value: "degree", label: "Bachelor's Degree Certificate", icon: GraduationCap },
  { value: "diploma", label: "Diploma Certificate", icon: Award },
  { value: "transcript", label: "Academic Transcript", icon: ScrollText },
  { value: "statement", label: "Statement of Result", icon: FileText },
];

const GenerateDocument = () => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [docType, setDocType] = useState("");
  const [generated, setGenerated] = useState<{
    code: string;
    student: ExtendedStudent;
    records: AcademicRecord[];
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { toast } = useToast();

  const filteredStudents = mockStudents.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudent(studentId);
    setSearchQuery("");
    setIsDropdownOpen(false);
    const student = mockStudents.find((s) => s.id === studentId);
    if (student) {
      setSearchQuery(`${student.firstName} ${student.lastName}`);
    }
  };

  const handleGenerate = () => {
    if (!selectedStudent || !docType) {
      toast({ title: "Missing fields", variant: "destructive" });
      return;
    }
    const student = mockStudents.find((s) => s.id === selectedStudent)!;
    const records = mockRecords[student.id] || [];
    const code = generateVerificationCode();
    setGenerated({ code, student, records });
  };

  const selectedStudentObj = mockStudents.find((s) => s.id === selectedStudent);
  const currentDocType = documentTypes.find(d => d.value === docType);

  // Get document title
  const getDocumentTitle = () => {
    switch(docType) {
      case "degree": return "BACHELOR'S DEGREE CERTIFICATE";
      case "diploma": return "DIPLOMA CERTIFICATE";
      case "transcript": return "ACADEMIC TRANSCRIPT";
      case "statement": return "STATEMENT OF RESULT";
      default: return "OFFICIAL DOCUMENT";
    }
  };

  // Format date for certificate
  const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Document Generator</h1>
          <p className="text-slate-500 mt-1">Create official certificates and academic records</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Configuration Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 order-2 lg:order-1">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Configure Document</h2>
            <div className="space-y-6">
              {/* Searchable Student Dropdown */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Select Student</Label>
                <div className="relative">
                  <div
                    className="flex items-center justify-between h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className={selectedStudent ? "text-slate-700" : "text-slate-400"}>
                      {selectedStudentObj ? `${selectedStudentObj.firstName} ${selectedStudentObj.lastName}` : "Choose a student"}
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
                              key={student.id}
                              className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                              onClick={() => handleSelectStudent(student.id)}
                            >
                              {student.firstName} {student.lastName}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Type Select */}
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
                className="w-full h-12 rounded-lg bg-[#6699FF] hover:bg-[#5588ee] text-white font-bold shadow-md active:scale-[0.98]"
              >
                Generate Document
              </Button>
            </div>
          </div>

          {/* Certificate Preview - Landscape style */}
          <div className="order-1 lg:order-2">
            {generated ? (
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                  <h2 className="text-lg font-semibold text-slate-800">Certificate Preview</h2>
                  <Button variant="outline" className="rounded-lg border-slate-200 shadow-sm hover:bg-slate-50">
                    <Download className="w-4 h-4 mr-2" /> Export PDF
                  </Button>
                </div>

                <div className="p-6 bg-slate-100 overflow-x-auto">
                  {/* Landscape certificate container - wider aspect */}
                  <div className="mx-auto w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden">
                    <div className="relative">
                      {/* Ornate border */}
                      <div className="absolute inset-0 pointer-events-none border-2 border-[#6699FF]/20 rounded-xl" />
                      <div className="absolute inset-1 pointer-events-none border border-[#6699FF]/10 rounded-lg" />
                      
                      {/* Decorative corner elements */}
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#6699FF]/30 rounded-tl-xl" />
                      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#6699FF]/30 rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#6699FF]/30 rounded-bl-xl" />
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#6699FF]/30 rounded-br-xl" />

                      <div className="p-10 md:p-12 relative z-10">
                        {/* Header with logo and institution */}
                        <div className="flex justify-between items-start mb-6 border-b border-slate-200 pb-4">
                          <div>
                            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">NEO CLOUD</h1>
                            <p className="text-sm text-slate-500 uppercase tracking-wider">Academic & Records Office</p>
                          </div>
                          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-2 border-[#6699FF]/20 shadow-md">
                            <img src="/logo-Neo-2.png" alt="NeoCloud Logo" className="w-14 h-14 object-contain" />
                          </div>
                        </div>

                        {/* Document Title with seal effect */}
                        <div className="text-center mb-8">
                          <div className="inline-block relative">
                            <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-wider">
                              {getDocumentTitle()}
                            </h2>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#6699FF]/40 rounded-full" />
                          </div>
                          <p className="text-sm text-slate-500 mt-4">This certifies that</p>
                        </div>

                        {/* Student Name prominently displayed */}
                        <div className="text-center mb-6">
                          <p className="text-4xl font-serif font-bold text-slate-800 border-b-2 border-[#6699FF]/20 inline-block pb-2 px-8">
                            {generated.student.firstName} {generated.student.lastName}
                          </p>
                        </div>

                        {/* Certificate body text (depends on document type) */}
                        <div className="text-center text-slate-600 space-y-2 mb-8">
                          {docType === "degree" && (
                            <>
                              <p>has successfully completed all requirements for the degree of</p>
                              <p className="text-2xl font-serif font-semibold text-[#6699FF]">
                                Bachelor of Science in {generated.student.program || "Computer Science"}
                              </p>
                              <p>with all rights, privileges, and honors thereunto appertaining.</p>
                            </>
                          )}
                          {docType === "diploma" && (
                            <>
                              <p>has successfully completed the program of study and is hereby awarded the</p>
                              <p className="text-2xl font-serif font-semibold text-[#6699FF]">
                                Diploma in {generated.student.program || "Information Technology"}
                              </p>
                              <p>in recognition of academic achievement.</p>
                            </>
                          )}
                          {(docType === "transcript" || docType === "statement") && (
                            <p className="text-lg font-medium">Academic Record</p>
                          )}
                        </div>

                        {/* Academic Record Table (for transcript/statement - shown in a refined way) */}
                        {(docType === "transcript" || docType === "statement") && generated.records.length > 0 && (
                          <div className="mb-8">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Course Performance</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                                    <th className="text-left py-2 px-3 font-semibold text-slate-600">Course Code</th>
                                    <th className="text-left py-2 px-3 font-semibold text-slate-600">Course Title</th>
                                    <th className="text-center py-2 px-3 font-semibold text-slate-600">Credits</th>
                                    <th className="text-center py-2 px-3 font-semibold text-slate-600">Grade</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {generated.records.map((record, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                                      <td className="py-2 px-3 font-mono text-xs">{record.courseCode}</td>
                                      <td className="py-2 px-3">{record.courseTitle}</td>
                                      <td className="text-center py-2 px-3">{record.creditUnits}</td>
                                      <td className="text-center py-2 px-3 font-semibold">{record.grade}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* QR Code and Verification Section */}
                        <div className="flex justify-between items-end border-t-2 border-slate-200 pt-6 mt-4">
                          <div className="text-left">
                            <p className="text-sm text-slate-500">Issued on: {issueDate}</p>
                            <p className="text-sm text-slate-500">Registration Number: {generated.student.id}</p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <div className="bg-white p-2 rounded-md border border-slate-200 shadow-sm">
                              <QRCodeSVG value={generated.code} size={70} />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase text-slate-400 font-bold">Verification Code</p>
                              <p className="text-xs font-mono font-bold text-[#6699FF] tracking-wider">{generated.code}</p>
                            </div>
                          </div>
                        </div>

                        {/* Signatures and Seals */}
                        <div className="mt-8 pt-4 flex justify-between items-end">
                          <div className="text-center w-1/3">
                            <div className="w-full h-px bg-slate-300 mb-1" />
                            <p className="text-xs text-slate-500">Registrar's Signature</p>
                          </div>
                          <div className="text-center w-1/3">
                            <div className="w-full h-px bg-slate-300 mb-1" />
                            <p className="text-xs text-slate-500">Academic Dean</p>
                          </div>
                          <div className="text-center w-1/3">
                            <div className="flex justify-center mb-1">
                              <div className="w-12 h-12 rounded-full border-2 border-[#6699FF]/40 flex items-center justify-center">
                                <Award className="w-6 h-6 text-[#6699FF]/60" />
                              </div>
                            </div>
                            <p className="text-xs text-slate-500">University Seal</p>
                          </div>
                        </div>

                        {/* Footer note */}
                        <div className="text-center mt-6 text-[10px] text-slate-400 uppercase tracking-wider">
                          This document is electronically verified. Always check the QR code.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[500px] bg-white rounded-xl shadow-md flex flex-col items-center justify-center text-center p-12">
                <FileText className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-xl font-semibold text-slate-800">No Preview Available</h3>
                <p className="text-slate-400 max-w-sm mt-2">Select a student and document type to generate an official certificate or academic record.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateDocument;