import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-none rounded-md shadow-md p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5">
            <div className="w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
                Document History
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Complete audit trail of all issued academic documents
              </p>
            </div>

            <div className="w-full xl:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <Input
                placeholder="Search student, matric, or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10 pr-4 w-full text-sm rounded-md border-none bg-slate-50 shadow-sm focus-visible:ring-2 focus-visible:ring-[#6699ff]/20"
              />
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {filtered.map((doc) => (
            <Card
              key={doc.id}
              className="bg-white p-4 sm:p-5 shadow-md border-none rounded-md"
            >
              <div className="flex justify-between items-start gap-3 mb-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-black break-words">
                    {doc.studentName}
                  </p>

                  <p className="text-xs text-slate-500 break-all">
                    {doc.matricNumber}
                  </p>
                </div>

                <span
                  className={`text-[10px] whitespace-nowrap font-black px-2 py-1 rounded-full ${
                    doc.status === "valid"
                      ? "bg-slate-50 text-[#6699ff]"
                      : "bg-slate-50 text-black"
                  }`}
                >
                  {doc.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 border-t border-slate-50 pt-3">
                <div className="flex justify-between gap-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    Type
                  </span>

                  <span className="text-xs text-[#6699ff] font-bold text-right">
                    {doc.type.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    Code
                  </span>

                  <span className="text-xs font-mono font-medium text-right break-all">
                    {doc.verificationCode}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    Date
                  </span>

                  <span className="text-xs text-slate-500 text-right">
                    {new Date(doc.generatedAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tablet Table */}
        <Card className="hidden lg:block xl:hidden bg-white border-none rounded-md shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Student
                  </th>

                  <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Matric No.
                  </th>

                  <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Type
                  </th>

                  <th className="text-center py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>

                  <th className="text-right py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Code
                  </th>

                  <th className="text-right py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-sm text-black">
                      {doc.studentName}
                    </td>

                    <td className="py-4 px-6 text-sm text-slate-600">
                      {doc.matricNumber}
                    </td>

                    <td className="py-4 px-6 text-sm text-[#6699ff] font-bold">
                      {doc.type.replace(/_/g, " ")}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span
                        className={`text-[10px] font-black px-2 py-1 rounded-full ${
                          doc.status === "valid"
                            ? "text-[#6699ff]"
                            : "text-black"
                        }`}
                      >
                        {doc.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-mono text-sm">
                      {doc.verificationCode}
                    </td>

                    <td className="py-4 px-6 text-right text-sm text-slate-500">
                      {new Date(doc.generatedAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Desktop Table */}
        <Card className="hidden xl:block bg-white border-none rounded-md shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-left py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Student Information
                  </th>

                  <th className="text-left py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Matric No.
                  </th>

                  <th className="text-left py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Document Type
                  </th>

                  <th className="text-center py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>

                  <th className="text-right py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Verification Code
                  </th>

                  <th className="text-right py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Date Issued
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-5 px-8 font-bold text-sm text-black">
                      {doc.studentName}
                    </td>

                    <td className="py-5 px-8 text-sm text-slate-600">
                      {doc.matricNumber}
                    </td>

                    <td className="py-5 px-8 text-sm text-[#6699ff] font-bold">
                      {doc.type.replace(/_/g, " ")}
                    </td>

                    <td className="py-5 px-8 text-center">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          doc.status === "valid"
                            ? "text-[#6699ff]"
                            : "text-black"
                        }`}
                      >
                        {doc.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-5 px-8 text-right font-mono text-sm">
                      {doc.verificationCode}
                    </td>

                    <td className="py-5 px-8 text-right text-sm text-slate-500">
                      {new Date(doc.generatedAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-md shadow-md p-10 text-center mt-6">
            <h3 className="text-lg font-semibold text-black">
              No documents found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try another search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentHistory;