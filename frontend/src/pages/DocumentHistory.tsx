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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Document History</h1>
        <p className="text-muted-foreground mt-1">View all generated documents and their verification status</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by student name, matric number, or verification code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((doc) => (
          <div key={doc.id} className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              doc.status === "valid" ? "bg-success/10" : "bg-destructive/10"
            }`}>
              {doc.status === "valid" ? (
                <CheckCircle className="w-6 h-6 text-success" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-card-foreground">{doc.studentName}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  doc.status === "valid" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}>
                  {doc.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {doc.matricNumber} · {doc.type.replace("_", " ")} · {new Date(doc.generatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono text-muted-foreground">{doc.verificationCode}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <FileText className="w-3 h-3" />
                <span className="capitalize">{doc.type.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
            No documents found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentHistory;
