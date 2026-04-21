import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockStudents, mockRecords, generateVerificationCode, getGradePoint, AcademicRecord } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const GenerateDocument = () => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [docType, setDocType] = useState("");
  const [generated, setGenerated] = useState<{ code: string; student: typeof mockStudents[0]; records: AcademicRecord[] } | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!selectedStudent || !docType) {
      toast({ title: "Missing fields", description: "Please select a student and document type.", variant: "destructive" });
      return;
    }
    const student = mockStudents.find((s) => s.id === selectedStudent)!;
    const records = mockRecords[student.id] || [];
    const code = generateVerificationCode();
    setGenerated({ code, student, records });
    toast({ title: "Document generated", description: `Verification code: ${code}` });
  };

  const calculateGPA = (records: AcademicRecord[]) => {
    if (records.length === 0) return "0.00";
    const totalPoints = records.reduce((sum, r) => sum + getGradePoint(r.grade) * r.creditUnits, 0);
    const totalCredits = records.reduce((sum, r) => sum + r.creditUnits, 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Document Generator</h1>
            <p className="text-muted-foreground">Create tamper-proof academic records in seconds</p>
          </div>
          <div className="text-xs px-4 py-2 bg-accent/10 text-accent rounded-3xl font-medium flex items-center gap-1.5">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            LIVE SECURE MODE
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
          {/* Form */}
          <div className="bg-card rounded-3xl border border-border p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-8">Configure Document</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Select Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="rounded-2xl h-14">
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStudents.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} — {s.matricNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="rounded-2xl h-14">
                    <SelectValue placeholder="Choose document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transcript">Academic Transcript</SelectItem>
                    <SelectItem value="statement_of_result">Statement of Result</SelectItem>
                    <SelectItem value="letter">Letter of Good Standing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} className="w-full h-14 rounded-3xl text-lg gap-3 bg-gradient-to-r from-accent to-accent/90 hover:brightness-110 transition-all">
                <FileText className="w-5 h-5" /> Generate Now
              </Button>
            </div>
          </div>

          {/* Preview */}
          {generated && (
            <div className="bg-card rounded-3xl border border-border shadow-2xl">
              <div className="px-8 pt-6 pb-4 flex items-center justify-between border-b">
                <h2 className="font-semibold text-2xl">Preview</h2>
                <Button variant="outline" className="rounded-2xl gap-2">
                  <Download className="w-4 h-4" /> Export
                </Button>
              </div>
              <div className="p-8">
                <div className="mx-auto max-w-xl bg-white dark:bg-background border border-border rounded-3xl shadow-inner p-9">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold">UNIVERSITY OF EXCELLENCE</h3>
                      <p className="uppercase text-xs tracking-[2px] text-muted-foreground mt-px">
                        {docType === "transcript" ? "ACADEMIC TRANSCRIPT" :
                         docType === "statement_of_result" ? "STATEMENT OF RESULT" : "LETTER OF GOOD STANDING"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">VERIFIED</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-sm mb-10">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">NAME</p>
                      <p className="font-semibold">{generated.student.firstName} {generated.student.lastName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">MATRIC NO</p>
                      <p className="font-semibold font-mono">{generated.student.matricNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">DEPARTMENT</p>
                      <p className="font-semibold">{generated.student.department}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">FACULTY</p>
                      <p className="font-semibold">{generated.student.faculty}</p>
                    </div>
                  </div>

                  {generated.records.length > 0 && (
                    <>
                      <table className="w-full mb-8 text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left pb-4 text-muted-foreground">CODE</th>
                            <th className="text-left pb-4 text-muted-foreground">COURSE</th>
                            <th className="text-center pb-4 text-muted-foreground">UNITS</th>
                            <th className="text-center pb-4 text-muted-foreground">GRADE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {generated.records.map((r) => (
                            <tr key={r.courseCode}>
                              <td className="py-4 font-mono text-foreground">{r.courseCode}</td>
                              <td className="py-4 text-foreground">{r.courseTitle}</td>
                              <td className="py-4 text-center text-foreground">{r.creditUnits}</td>
                              <td className="py-4 text-center font-bold text-foreground">{r.grade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="flex justify-end mb-8">
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground block">CUMULATIVE GPA</span>
                          <span className="text-4xl font-bold text-foreground">{calculateGPA(generated.records)}</span>
                          <span className="text-sm text-muted-foreground"> / 5.00</span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-8 border-t flex items-end justify-between">
                    <div className="text-xs">
                      <span className="block text-muted-foreground">Verification Code</span>
                      <span className="font-mono text-xl font-semibold">{generated.code}</span>
                      <span className="block text-muted-foreground mt-3">Generated • {new Date().toLocaleDateString()}</span>
                    </div>
                    <QRCodeSVG
                      value={`${window.location.origin}/verify?code=${generated.code}`}
                      size={110}
                      level="M"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateDocument;