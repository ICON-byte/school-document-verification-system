import { useState } from "react";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-8 max-w-screen-2xl mx-auto">
      {/* Glassmorphism Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-2xl font-black bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-1">
              Document History
            </h1>
            <p className="text-lg md:text-base text-slate-600 font-medium">Complete audit trail of all issued documents</p>
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by student, matric, or verification code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-12 pr-5 text-base rounded-2xl border-2 border-slate-200 focus:border-indigo-500 shadow-lg bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Table Card */}
      <Card className="border-0 shadow-2xl backdrop-blur-md bg-white/70 rounded-2xl overflow-hidden">
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Student</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Matric No.</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Document Type</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Verification Code</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Issued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doc, i) => (
                <tr 
                  key={doc.id} 
                  className={`hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 ${i % 2 === 0 ? 'bg-slate-50/30' : ''}`}
                >
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-slate-800 hover:text-indigo-700 transition-colors">{doc.studentName}</p>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className="px-3 py-1 text-xs font-mono bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200 rounded-full shadow-sm">
                      {doc.matricNumber}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-slate-700 bg-slate-100/80 px-3 py-1 rounded-xl backdrop-blur-sm">
                      {doc.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Badge 
                      className={`px-4 py-2 text-xs font-bold rounded-full shadow-md hover:scale-105 transition-all ${
                        doc.status === "valid" 
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white" 
                          : "bg-gradient-to-r from-orange-400 to-red-500 text-white"
                      }`}
                    >
                      {doc.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-2 rounded-xl border border-indigo-200">
                      <code className="text-xs font-mono font-bold text-indigo-800">
                        {doc.verificationCode}
                      </code>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-sm text-slate-600 font-mono bg-slate-100/80 px-3 py-1 rounded-lg backdrop-blur-sm">
                      {new Date(doc.generatedAt).toLocaleDateString("en-GB")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <FileText className="w-16 h-16 mx-auto mb-6 text-slate-300" />
            <h3 className="text-xl md:text-lg font-bold text-slate-600 mb-2">No documents found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms. No documents match your current filter.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DocumentHistory;