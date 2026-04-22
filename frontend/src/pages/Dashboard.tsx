import { Users, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockStudents, mockDocuments } from "@/lib/mockData";

const Dashboard = () => {
  const totalStudents = mockStudents.length;
  const totalDocuments = mockDocuments.length;
  const validDocs = mockDocuments.filter((d) => d.status === "valid").length;
  const revokedDocs = mockDocuments.filter((d) => d.status === "revoked").length;

  // Inline StatCard component (no external dependency issues)
  const StatCard = ({ title, value, icon: Icon, description, gradient }: any) => (
    <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r ${gradient} text-white group-hover:scale-[1.02]`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl group-hover:rotate-3 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium opacity-90 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs opacity-80 mt-0.5">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-8">
      {/* Glassmorphism Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl p-6 mb-8">
        <h1 className="text-3xl md:text-2xl font-black bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-1">
          Dashboard
        </h1>
        <p className="text-lg md:text-base text-slate-600 font-medium">Overview of your document verification system</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Students" 
          value={totalStudents} 
          icon={Users} 
          description="Registered students"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard 
          title="Documents Generated" 
          value={totalDocuments} 
          icon={FileText} 
          description="All time"
          gradient="from-indigo-500 to-purple-600"
        />
        <StatCard 
          title="Valid Documents" 
          value={validDocs} 
          icon={CheckCircle} 
          description="Currently active"
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard 
          title="Revoked Documents" 
          value={revokedDocs} 
          icon={AlertTriangle} 
          description="Marked invalid"
          gradient="from-orange-500 to-red-600"
        />
      </div>

      {/* Recent Documents Table */}
      <Card className="border-0 shadow-2xl backdrop-blur-md bg-white/70 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-2xl">
          <h2 className="text-xl md:text-lg font-bold text-slate-800 flex items-center gap-2">
            📄 Recent Documents
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <th className="text-left p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Student</th>
                <th className="text-left p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Matric No.</th>
                <th className="text-left p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Type</th>
                <th className="text-left p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                <th className="text-left p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockDocuments.slice(0, 10).map((doc, i) => ( // Limit to 10 for better UX
                <tr 
                  key={doc.id} 
                  className={`border-b border-slate-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 ${i % 2 === 0 ? 'bg-slate-50/30' : ''}`}
                >
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-800">{doc.studentName}</p>
                  </td>
                  <td className="p-4">
                    <Badge className="px-3 py-1 text-xs font-mono bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200 rounded-full shadow-sm">
                      {doc.matricNumber}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {doc.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-600 font-mono">
                      {new Date(doc.generatedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge 
                      className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-md transform hover:scale-105 transition-all ${
                        doc.status === "valid" 
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white" 
                          : "bg-gradient-to-r from-orange-400 to-red-500 text-white"
                      }`}
                    >
                      {doc.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;