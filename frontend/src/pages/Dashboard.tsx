import { Card, CardContent } from "@/components/ui/card";
import { mockStudents, mockDocuments } from "@/lib/mockData";

const Dashboard = () => {
  const totalStudents = mockStudents.length;
  const totalDocuments = mockDocuments.length;

  const validDocs = mockDocuments.filter(
    (d) => d.status === "valid"
  ).length;

  const revokedDocs = mockDocuments.filter(
    (d) => d.status === "revoked"
  ).length;

  const StatCard = ({ title, value, description }: any) => (
    <Card className="bg-white border-0 rounded-sm shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-sans">
      <CardContent className="p-4 sm:p-5">
        <div className="text-left">
          <p className="text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>

          <p className="text-2xl sm:text-3xl font-bold text-black mt-2">
            {value}
          </p>

          <p className="text-[11px] sm:text-xs text-[#6699ff] mt-1">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#f8faff] p-4 sm:p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="bg-white rounded-sm shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Overview of your document verification system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <StatCard
          title="Total Students"
          value={totalStudents}
          description="Registered students"
        />

        <StatCard
          title="Documents Generated"
          value={totalDocuments}
          description="All time"
        />

        <StatCard
          title="Valid Documents"
          value={validDocs}
          description="Currently active"
        />

        <StatCard
          title="Revoked Documents"
          value={revokedDocs}
          description="Marked invalid"
        />
      </div>

      {/* Recent Documents */}
      <Card className="bg-white border-0 rounded-sm shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden font-sans">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Recent Documents
          </h2>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3 p-4">
          {mockDocuments.slice(0, 10).map((doc, i) => (
            <div
              key={doc.id}
              className={`rounded-sm shadow-sm p-4 transition-all duration-200 hover:bg-[#6699ff]/5 ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <p className="text-sm font-semibold text-black">
                {doc.studentName}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {doc.matricNumber}
              </p>

              <p className="text-sm text-[#6699ff] capitalize font-medium mt-2">
                {doc.type.replace("_", " ")}
              </p>

              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500">
                  {new Date(doc.generatedAt).toLocaleDateString()}
                </p>

                <span
                  className={`text-xs font-semibold ${
                    doc.status === "valid"
                      ? "text-[#6699ff]"
                      : "text-black"
                  }`}
                >
                  {doc.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold text-black uppercase tracking-wide">
                  Student
                </th>

                <th className="text-left p-4 text-xs font-semibold text-black uppercase tracking-wide">
                  Matric No.
                </th>

                <th className="text-left p-4 text-xs font-semibold text-black uppercase tracking-wide">
                  Type
                </th>

                <th className="text-left p-4 text-xs font-semibold text-black uppercase tracking-wide">
                  Date
                </th>

                <th className="text-left p-4 text-xs font-semibold text-black uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {mockDocuments.slice(0, 10).map((doc, i) => (
                <tr
                  key={doc.id}
                  className={`transition-all duration-200 hover:bg-[#6699ff]/5 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-4 text-sm font-medium text-black">
                    {doc.studentName}
                  </td>

                  <td className="p-4 text-sm text-black">
                    {doc.matricNumber}
                  </td>

                  <td className="p-4 text-sm text-[#6699ff] capitalize font-medium">
                    {doc.type.replace("_", " ")}
                  </td>

                  <td className="p-4 text-sm text-gray-500">
                    {new Date(doc.generatedAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-sm font-medium">
                    <span
                      className={
                        doc.status === "valid"
                          ? "text-[#6699ff]"
                          : "text-black"
                      }
                    >
                      {doc.status.toUpperCase()}
                    </span>
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