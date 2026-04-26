import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FileText, Download } from "lucide-react";
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

const GenerateDocument = () => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [docType, setDocType] = useState("");
  const [generated, setGenerated] = useState<{
    code: string;
    student: typeof mockStudents[0];
    records: AcademicRecord[];
  } | null>(null);

  const { toast } = useToast();

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

  const calculateGPA = (records: AcademicRecord[]) => {
    if (records.length === 0) return "0.00";
    const totalPoints = records.reduce((sum, r) => sum + getGradePoint(r.grade) * r.creditUnits, 0);
    const totalCredits = records.reduce((sum, r) => sum + r.creditUnits, 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-10 text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Document Generator</h1>
          <p className="text-sm text-slate-500 mt-1">Create secure academic records with instant verification</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 lg:gap-10 items-start">
          <div className="bg-white border-none rounded-md shadow-md p-6 md:p-8 order-2 lg:order-1">
            <h2 className="text-xl font-semibold text-black mb-6 md:mb-8">Configure Document</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Select Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="h-11 rounded-md border-none bg-slate-50 shadow-sm focus:ring-2 focus:ring-[#6699ff]/20">
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent className="border-none shadow-xl rounded-md">
                    {mockStudents.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Document Type</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="h-11 rounded-md border-none bg-slate-50 shadow-sm focus:ring-2 focus:ring-[#6699ff]/20">
                    <SelectValue placeholder="Choose document type" />
                  </SelectTrigger>
                  <SelectContent className="border-none shadow-xl rounded-md">
                    <SelectItem value="transcript">Academic Transcript</SelectItem>
                    <SelectItem value="statement_of_result">Statement of Result</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerate} className="w-full h-12 rounded-md bg-[#6699ff] hover:bg-[#5a8cff] text-white font-bold shadow-md active:scale-[0.98]">
                Generate Document
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            {generated ? (
              <div className="bg-white border-none rounded-md shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h2 className="text-lg font-semibold text-black">Live Preview</h2>
                  <Button variant="outline" className="w-full sm:w-auto rounded-md border-none shadow-sm bg-slate-50 text-slate-700">
                    <Download className="w-4 h-4 mr-2" /> Export PDF
                  </Button>
                </div>

                <div className="p-4 md:p-10 bg-slate-100/50 overflow-x-auto">
                  <div className="mx-auto min-w-[650px] max-w-[750px] bg-white border-none rounded-md shadow-2xl p-6 md:p-12">
                    {/* Transcript content same as before */}
                    <div className="flex justify-between items-start mb-12">
                      <h3 className="text-2xl font-black text-black">UNIVERSITY OF EXCELLENCE</h3>
                      <div className="w-16 h-16 bg-slate-50 rounded-md flex items-center justify-center">
                         <img src="/logo-Neo-2.png" alt="Logo" className="w-12 h-12 object-contain opacity-80" />
                      </div>
                    </div>
                    {/* ... rest of your document table ... */}
                    <div className="mt-8 pt-6 border-t-2 border-slate-50 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold">GPA</p>
                        <p className="text-3xl font-black">{calculateGPA(generated.records)}</p>
                        <p className="text-lg font-mono font-bold text-[#6699ff] mt-2">{generated.code}</p>
                      </div>
                      <QRCodeSVG value={generated.code} size={80} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[400px] md:h-[600px] bg-white rounded-md shadow-md flex flex-col items-center justify-center text-center p-12">
                <FileText className="w-12 h-12 text-slate-200 mb-4" />
                <h3 className="text-lg font-semibold text-black">No Preview Available</h3>
                <p className="text-slate-400 max-w-[280px] mt-2 text-sm">Select a student and type to generate a record.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateDocument;