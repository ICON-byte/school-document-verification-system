import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockStudents, mockDocuments, Student } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import StatCard from "@/components/StatCard";

const ROWS_PER_PAGE = 5;

const Students = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    matricNumber: "",
    department: "",
    faculty: "",
    email: "",
  });
  const { toast } = useToast();

  const departments = useMemo(
    () => Array.from(new Set(students.map((s) => s.department))).sort(),
    [students],
  );

  const acceptedDocs = mockDocuments.filter((d) => d.status === "valid").length;
  const revokedDocs = mockDocuments.filter(
    (d) => d.status === "revoked",
  ).length;

  const filtered = students.filter((s) => {
    const matchesSearch =
      `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      departmentFilter === "all" || s.department === departmentFilter;
    return matchesSearch && matchesDept;
  });
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginatedStudents = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    setCurrentPage(1);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const student: Student = {
      id: String(students.length + 1),
      ...newStudent,
      level: "100",
      enrollmentYear: new Date().getFullYear(),
      status: "active",
    };
    setStudents([...students, student]);
    setDialogOpen(false);
    setNewStudent({
      firstName: "",
      lastName: "",
      matricNumber: "",
      department: "",
      faculty: "",
      email: "",
    });
    toast({
      title: "Student added",
      description: `${student.firstName} ${student.lastName} has been registered.`,
    });
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setNewStudent({
      firstName: student.firstName,
      lastName: student.lastName,
      matricNumber: student.matricNumber,
      department: student.department,
      faculty: student.faculty,
      email: student.email,
    });
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStudent) {
      setStudents((current) =>
        current.map((student) =>
          student.id === editingStudent.id
            ? {
                ...student,
                ...newStudent,
              }
            : student,
        ),
      );
      setDialogOpen(false);
      setEditingStudent(null);
      setNewStudent({
        firstName: "",
        lastName: "",
        matricNumber: "",
        department: "",
        faculty: "",
        email: "",
      });
      toast({
        title: "Student updated",
        description: `${newStudent.firstName} ${newStudent.lastName}'s record has been updated.`,
      });
      return;
    }

    handleAdd(e);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      setEditingStudent(null);
      setNewStudent({
        firstName: "",
        lastName: "",
        matricNumber: "",
        department: "",
        faculty: "",
        email: "",
      });
    }
  };

  const handleDelete = (student: Student) => {
    setStudents((current) => current.filter((item) => item.id !== student.id));
    setCurrentPage((page) =>
      Math.min(page, Math.max(1, Math.ceil((filtered.length - 1) / ROWS_PER_PAGE))),
    );
    toast({
      title: "Student deleted",
      description: `${student.firstName} ${student.lastName} has been removed.`,
    });
  };

  return (
    <div className="min-h-screen bg-muted/40">
      {/* ── Dark Hero Top Bar ── */}
      <div className="relative bg-[hsl(var(--topbar))] text-[hsl(var(--topbar-foreground))] overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Student Records
            </h1>
            <p className="text-white/70 mt-1">
              Manage student information and records
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <i className="fa-solid fa-plus text-sm"></i> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? "Edit Student" : "Add New Student"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      required
                      value={newStudent.firstName}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      required
                      value={newStudent.lastName}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Matric Number</Label>
                  <Input
                    required
                    value={newStudent.matricNumber}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        matricNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      required
                      value={newStudent.department}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          department: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Faculty</Label>
                    <Input
                      required
                      value={newStudent.faculty}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          faculty: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, email: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingStudent ? "Save Changes" : "Add Student"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Decorative shapes */}
        <div className="absolute -right-10 -top-10 pointer-events-none">
          <div className="h-48 w-48 rounded-3xl rotate-12 bg-white/5"></div>
          <div className="h-32 w-32 rounded-2xl -rotate-6 bg-white/5 -mt-16 ml-16"></div>
        </div>
        <div className="h-12"></div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-8 -mt-12 pb-12 max-w-7xl mx-auto">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Total Students"
            value={students.length}
            icon="fa-solid fa-users"
            description="Registered learners"
            tone="primary"
          />
          <StatCard
            title="Accepted Documents"
            value={acceptedDocs}
            icon="fa-solid fa-circle-check"
            description="Currently valid"
            tone="success"
          />
          <StatCard
            title="Revoked Documents"
            value={revokedDocs}
            icon="fa-solid fa-triangle-exclamation"
            description="No longer valid"
            tone="warning"
          />
        </div>

        {/* Search + Department Filter */}
        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"></i>
            <Input
              placeholder="Search by name, matric or department..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Students Table */}
        <div className="mt-6 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-3 py-2">
            {/* Header */}
            <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Matric No.</div>
              <div className="col-span-3">Department</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {paginatedStudents.map((student) => (
                <div
                  key={student.id}
                  className="
                    group
                    grid grid-cols-12 items-center
                    px-5 py-4 text-sm
                    border border-transparent
                    transition-all duration-300 ease-out
                    hover:bg-blue-50/80
                    hover:shadow-md
                    hover:scale-[1.01]
                    hover:-translate-y-0.5
                    hover:border-blue-200
                    hover:rounded-xl
                    cursor-pointer
                  "
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div
                      className="
                        h-9 w-9 rounded-full
                        bg-muted ring-2 ring-white
                        flex items-center justify-center
                        text-muted-foreground
                        transition-all duration-300
                        group-hover:bg-blue-100
                        group-hover:text-blue-600
                        group-hover:scale-110
                      "
                    >
                      <i className="fa-solid fa-user text-sm"></i>
                    </div>
                    <div>
                      <p className="font-medium transition-colors duration-300 group-hover:text-blue-600">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    {student.matricNumber}
                  </div>
                  <div className="col-span-3 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    {student.department}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all duration-300 group-hover:scale-105 ${
                        student.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          student.status === "active"
                            ? "fa-circle-check"
                            : "fa-circle-xmark"
                        }`}
                      ></i>
                      {student.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 transition-colors duration-300 group-hover:bg-blue-100 group-hover:text-blue-600"
                        >
                          <i className="fa-solid fa-ellipsis text-sm"></i>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => openEditDialog(student)}
                        >
                          <i className="fa-solid fa-pen-to-square text-xs"></i>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-destructive focus:text-destructive"
                          onClick={() => handleDelete(student)}
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-10">
                No students found matching your search.
              </p>
            )}

            {filtered.length > ROWS_PER_PAGE && (
              <div className="mt-3 flex items-center justify-between border-t border-border px-5 py-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;