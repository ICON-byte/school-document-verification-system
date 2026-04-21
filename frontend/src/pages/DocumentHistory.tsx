import { useState } from "react";
import { Search, FileText, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockDocuments } from "@/lib/mockData";

const DocumentHistory = () => {
  const [search, setSearch] = useState("");

  const filtered = mockDocuments.filter(
    (d) =>
      d.studentName.toLowerCase().includes(search.toLowerCase()) ||
      d.matricNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.verificationCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-screen-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Document History</h1>
          <p className="text-muted-foreground">Complete audit trail of all issued documents</p>
        </div>
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 rounded-2xl"
          />
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-5 px-8 font-medium text-muted-foreground">Student</th>
              <th className="text-left py-5 px-8 font-medium text-muted-foreground">Matric No.</th>
              <th className="text-left py-5 px-8 font-medium text-muted-foreground">Document Type</th>
              <th className="text-center py-5 px-8 font-medium text-muted-foreground">Status</th>
              <th className="text-right py-5 px-8 font-medium text-muted-foreground">Verification Code</th>
              <th className="text-right py-5 px-8 font-medium text-muted-foreground">Issued</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-muted/30 transition-colors group">
                <td className="py-5 px-8 font-medium">{doc.studentName}</td>
                <td className="py-5 px-8 font-mono text-sm text-muted-foreground">{doc.matricNumber}</td>
                <td className="py-5 px-8 capitalize">{doc.type.replace("_", " ")}</td>
                <td className="py-5 px-8 text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-3xl text-xs font-medium ${
                    doc.status === "valid" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {doc.status === "valid" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {doc.status}
                  </div>
                </td>
                <td className="py-5 px-8 text-right font-mono font-semibold text-foreground">{doc.verificationCode}</td>
                <td className="py-5 px-8 text-right text-sm text-muted-foreground">
                  {new Date(doc.generatedAt).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentHistory;