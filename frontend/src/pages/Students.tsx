import { useState } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockStudents, Student } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Students = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    matricNumber: "",
    department: "",
    faculty: "",
    level: "100",
    email: "",
  });

  const { toast } = useToast();

  const filtered = students.filter(
    (s) =>
      `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === "active").length,
    graduated: students.filter((s) => s.status === "graduated").length,
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    const student: Student = {
      id: String(students.length + 1),
      ...newStudent,
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
      level: "100",
      email: "",
    });

    toast({
      title: "Student added",
      description: `${student.firstName} ${student.lastName} registered.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 font-sans">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[
          { label: "Total Students", value: stats.total },
          { label: "Active", value: stats.active },
          { label: "Graduated", value: stats.graduated },
        ].map((item) => (
          <Card
            key={item.label}
            className="border-none rounded-md shadow-sm bg-white"
          >
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-black mt-3">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white border-none rounded-md shadow-md p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Student Records
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Manage your student database effortlessly
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-[#6699ff] hover:bg-[#5588ee] text-white h-11 px-6 rounded-md font-medium gap-2 shadow-sm">
                <Plus className="w-4 h-4" />
                Add Student
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[95%] sm:max-w-md rounded-md border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Add New Student
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAdd} className="space-y-5 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <Button className="w-full h-11 rounded-md bg-[#6699ff] hover:bg-[#5588ee]">
                  Add Student
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mt-6 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, matric number, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10 rounded-md border-none shadow-sm bg-slate-50 focus-visible:ring-[#6699ff]"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block border-none rounded-md shadow-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/50">
                {["Name", "Matric No.", "Department", "Level", "Status", ""].map(
                  (header) => (
                    <th
                      key={header}
                      className="text-left p-5 text-sm font-semibold text-slate-600"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filtered.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-5">
                    <p className="font-medium text-black">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {student.email}
                    </p>
                  </td>

                  <td className="p-5">{student.matricNumber}</td>
                  <td className="p-5">{student.department}</td>
                  <td className="p-5">{student.level} Level</td>

                  <td className="p-5">
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-[#6699ff]">
                      {student.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.map((student) => (
          <Card
            key={student.id}
            className="border-none shadow-md rounded-md bg-white"
          >
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-black">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-sm text-slate-500">
                  {student.email}
                </p>
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Matric:</span>{" "}
                  {student.matricNumber}
                </p>
                <p>
                  <span className="font-medium">Department:</span>{" "}
                  {student.department}
                </p>
                <p>
                  <span className="font-medium">Level:</span>{" "}
                  {student.level}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-[#6699ff]">
                  {student.status.toUpperCase()}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-10 text-center">
          <h3 className="text-lg font-medium text-black mb-1">
            No students found
          </h3>
          <p className="text-slate-500">
            Try adjusting your search or add a new student.
          </p>
        </div>
      )}
    </div>
  );
};

export default Students;