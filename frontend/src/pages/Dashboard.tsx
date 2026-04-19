import { Users, FileText, CheckCircle, AlertTriangle } from "lucide-react";
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
    <div className="p-8">
      <div className="mb-2 flex flex-row gap-[20rem]">
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <form className="Search mt-2">
          <input
            className="w-[30rem] bg-gray-200 pl-7 pt-1 pb-1 rounded-full hover:transform hover:scale-105 transition-transform"
            type="text"
            placeholder="Search"
          />
        </form>
      </div>
      <p className="text-muted-foreground mb-5">
        Overview of your document verification system
      </p>
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
                  className=" border-b border-border hover:transform hover:scale-[1.01] transition-transform hover:bg-gray-100"
                >
                  <td className="p-4 text-sm font-medium text-card-foreground ">
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
  );
};

export default Dashboard;
