 import {
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { mockStudents, mockDocuments } from "@/lib/mockData";

const Dashboard = () => {
  const totalStudents = mockStudents.length;
  const totalDocuments = mockDocuments.length;
  const validDocs = mockDocuments.filter((d) => d.status === "valid").length;
  const revokedDocs = mockDocuments.filter(
    (d) => d.status === "revoked",
  ).length;

  return (
    <div>
      {/* ── Dark Hero Top Bar ── */}
      <div className="bg-gray-900 px-8 pt-8 pb-3 relative overflow-hidden">
        {/* Nav Row */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 hover:transform hover:scale-105 transition-transform">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-64"
                type="text"
                placeholder="Search students, documents..."
              />
            </div>

            {/* Notification Bell */}
            <button className="relative w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Bell className="w-4 h-5 text-gray-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-[#111]" />
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full pl-1.5 pr-3 py-1.5 hover:bg-white/20 transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                A
              </div>
              <span className="text-sm text-gray-200 font-medium">Admin</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Hero Text + Decorative Shape */}
        <div className="flex items-end justify-between">
          <p className="text-white/50 text-sm max-w-xs leading-relaxed">
            Overview of your document verification system
          </p>
          {/* Decorative hexagon shapes like the reference */}
          <div className="relative w-48 h-32 opacity-30 pointer-events-none">
            <div
              className="absolute w-32 h-32 bg-white/10"
              style={{
                clipPath:
                  "polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)",
                top: 0,
                right: 16,
              }}
            />
            <div className="absolute bottom-0 right-12 w-16 h-20 bg-white/10 rounded-t-full" />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            description="Registered students"
          />
          <StatCard
            title="Documents Generated"
            value={totalDocuments}
            icon={FileText}
            description="All time"
          />
          <StatCard
            title="Valid Documents"
            value={validDocs}
            icon={CheckCircle}
            description="Currently active"
          />
          <StatCard
            title="Revoked Documents"
            value={revokedDocs}
            icon={AlertTriangle}
            description="Marked invalid"
          />
        </div>

        {/* Recent Documents */}
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">
              Recent Documents
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Student
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Matric No.
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-border hover:scale-[1.01] transition-transform hover:bg-gray-100"
                  >
                    <td className="p-4 text-sm font-medium text-card-foreground">
                      {doc.studentName}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {doc.matricNumber}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground capitalize">
                      {doc.type.replace("_", " ")}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(doc.generatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.status === "valid"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
