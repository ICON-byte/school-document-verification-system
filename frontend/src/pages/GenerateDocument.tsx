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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Generate Document</h1>
        <p className="text-muted-foreground mt-1">Create verified academic documents with QR codes</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-6">Document Details</h2>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger><SelectValue placeholder="Choose a student" /></SelectTrigger>
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
                <SelectTrigger><SelectValue placeholder="Choose document type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="transcript">Academic Transcript</SelectItem>
                  <SelectItem value="statement_of_result">Statement of Result</SelectItem>
                  <SelectItem value="letter">Letter of Good Standing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <FileText className="w-4 h-4" /> Generate Document
            </Button>
          </div>
        </div>

        {/* Preview */}
        {generated && (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-card-foreground">Document Preview</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Download
              </Button>
            </div>
            <div className="p-6">
              {/* Document content */}
              <div className="border border-border rounded-lg p-8 bg-background">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground">UNIVERSITY OF EXCELLENCE</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {docType === "transcript" ? "ACADEMIC TRANSCRIPT" :
                     docType === "statement_of_result" ? "STATEMENT OF RESULT" : "LETTER OF GOOD STANDING"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div><span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground">{generated.student.firstName} {generated.student.lastName}</span></div>
                  <div><span className="text-muted-foreground">Matric No:</span> <span className="font-medium text-foreground">{generated.student.matricNumber}</span></div>
                  <div><span className="text-muted-foreground">Department:</span> <span className="font-medium text-foreground">{generated.student.department}</span></div>
                  <div><span className="text-muted-foreground">Faculty:</span> <span className="font-medium text-foreground">{generated.student.faculty}</span></div>
                </div>

                {generated.records.length > 0 && (
                  <table className="w-full text-sm mb-6">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-medium">Code</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
                        <th className="text-center py-2 text-muted-foreground font-medium">Units</th>
                        <th className="text-center py-2 text-muted-foreground font-medium">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generated.records.map((r) => (
                        <tr key={r.courseCode} className="border-b border-border/50">
                          <td className="py-2 font-mono text-foreground">{r.courseCode}</td>
                          <td className="py-2 text-foreground">{r.courseTitle}</td>
                          <td className="py-2 text-center text-foreground">{r.creditUnits}</td>
                          <td className="py-2 text-center font-semibold text-foreground">{r.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {generated.records.length > 0 && (
                  <p className="text-sm font-semibold text-foreground mb-6">
                    Cumulative GPA: {calculateGPA(generated.records)} / 5.00
                  </p>
                )}

                <div className="flex items-end justify-between pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    <p>Verification Code: <span className="font-mono font-semibold text-foreground">{generated.code}</span></p>
                    <p className="mt-1">Generated: {new Date().toLocaleDateString()}</p>
                  </div>
                  <QRCodeSVG
                    value={`${window.location.origin}/verify?code=${generated.code}`}
                    size={80}
                    level="M"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateDocument;
