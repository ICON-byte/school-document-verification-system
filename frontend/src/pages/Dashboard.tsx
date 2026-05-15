import { useState } from "react";
import StatCard from "@/components/StatCard";
import { mockStudents, mockDocuments } from "@/lib/mockData";

const ROWS_PER_PAGE = 5;

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalStudents = mockStudents.length;
  const totalDocuments = mockDocuments.length;
  const validDocs = mockDocuments.filter((d) => d.status === "valid").length;
  const revokedDocs = mockDocuments.filter(
    (d) => d.status === "revoked",
  ).length;
  const totalPages = Math.ceil(mockDocuments.length / ROWS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startItem =
    mockDocuments.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ROWS_PER_PAGE, mockDocuments.length);
  const paginatedDocuments = mockDocuments.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  return (
    <div className="p-8">
      <div className="mb-2 flex flex-row gap-[20rem]">
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <form className="Search relative mt-2">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"></i>
          <input
            className="w-[30rem] bg-gray-200 pl-9 pt-1 pb-1 rounded-full hover:transform hover:scale-105 transition-transform"
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
          icon="fa-solid fa-users"
          description="Registered students"
          tone="primary"
        />
        <StatCard
          title="Documents Generated"
          value={totalDocuments}
          icon="fa-solid fa-file-lines"
          description="All time"
          tone="muted"
        />
        <StatCard
          title="Valid Documents"
          value={validDocs}
          icon="fa-solid fa-circle-check"
          description="Currently active"
          tone="success"
        />
        <StatCard
          title="Revoked Documents"
          value={revokedDocs}
          icon="fa-solid fa-triangle-exclamation"
          description="Marked invalid"
          tone="warning"
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
              {paginatedDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  className="group border border-transparent border-b-border text-sm transition-all duration-300 ease-out hover:bg-blue-50/80 hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5 hover:border-blue-200 hover:rounded-xl cursor-pointer"
                >
                  <td className="p-4 font-medium text-card-foreground">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted ring-2 ring-white flex items-center justify-center text-muted-foreground transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:scale-110">
                        <i className="fa-solid fa-user text-sm"></i>
                      </div>
                      <span className="transition-colors duration-300 group-hover:text-blue-600">
                        {doc.studentName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <i className="fa-solid fa-id-card text-xs text-blue-500"></i>
                      {doc.matricNumber}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground capitalize transition-colors duration-300 group-hover:text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <i className="fa-solid fa-file-signature text-xs text-blue-500"></i>
                      {doc.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <i className="fa-solid fa-calendar-days text-xs text-blue-500"></i>
                      {new Date(doc.generatedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
                        doc.status === "valid"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          doc.status === "valid"
                            ? "fa-circle-check"
                            : "fa-circle-xmark"
                        }`}
                      ></i>
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mockDocuments.length > ROWS_PER_PAGE && (
          <div className="flex flex-col gap-4 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startItem}-{endItem} of {mockDocuments.length} documents
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50"
              >
                <i className="fa-solid fa-chevron-left mr-2 text-xs"></i>
                Previous
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  aria-current={currentPage === page ? "page" : undefined}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                    currentPage === page
                      ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                      : "border-border text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50"
              >
                Next
                <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
