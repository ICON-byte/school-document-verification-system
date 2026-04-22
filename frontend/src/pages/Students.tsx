import { useState } from "react";
import { Search, Plus, MoreHorizontal, Users, UserCheck, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockStudents, Student } from "@/lib/mockData";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Students = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: "", lastName: "", matricNumber: "", department: "", faculty: "", level: "100", email: "",
  });
  const { toast } = useToast();

  const filtered = students.filter(
    (s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === "active").length,
    graduated: students.filter(s => s.status === "graduated").length,
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
    setNewStudent({ firstName: "", lastName: "", matricNumber: "", department: "", faculty: "", level: "100", email: "" });
    toast({ title: "Student added", description: `${student.firstName} ${student.lastName} registered.` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-8">
      {/* Stats Dashboard - Smaller */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium opacity-90 uppercase tracking-wide">Total Students</p>
                <p className="text-2xl font-black">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium opacity-90 uppercase tracking-wide">Active</p>
                <p className="text-2xl font-black">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium opacity-90 uppercase tracking-wide">Graduated</p>
                <p className="text-2xl font-black">{stats.graduated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header - Smaller */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-2xl font-black bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-1">
              Student Records
            </h1>
            <p className="text-lg md:text-base text-slate-600 font-medium">Manage your student database effortlessly</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl h-12 px-6 text-base font-semibold rounded-xl gap-2">
                <Plus className="w-5 h-5" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 backdrop-blur-md bg-white/90 border-white/50 rounded-2xl">
              <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Add New Student
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">First Name</Label>
                    <Input className="h-12 rounded-xl border-2 border-slate-200 focus:border-indigo-500 shadow-sm text-sm" required value={newStudent.firstName} onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Last Name</Label>
                    <Input className="h-12 rounded-xl border-2 border-slate-200 focus:border-indigo-500 shadow-sm text-sm" required value={newStudent.lastName} onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Matric Number</Label>
                  <Input className="h-12 rounded-xl border-2 border-slate-200 focus:border-indigo-500 shadow-sm text-sm" placeholder="e.g. CSC/2024/001" required value={newStudent.matricNumber} onChange={(e) => setNewStudent({ ...newStudent, matricNumber: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Department</Label>
                    <Input className="h-12 rounded-xl border-2 border-slate-200 focus:border-indigo-500 shadow-sm text-sm" required value={newStudent.department} onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Faculty</Label>
                    <Input className="h-12 rounded-xl border-2 border-slate-200 focus:border-indigo-500 shadow-sm text-sm" required value={newStudent.faculty} onChange={(e) => setNewStudent({ ...newStudent, faculty: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Email</Label>
                  <Input className="h-12 rounded-xl border-2 border-slate-200 focus:border-indigo-500 shadow-sm text-sm" type="email" required value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
                </div>
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-base rounded-xl shadow-xl font-semibold">
                  Add Student
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search - Smaller */}
        <div className="relative mt-6 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search by name, matric number, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 pl-12 pr-5 text-base rounded-2xl border-2 border-slate-200 focus:border-indigo-500 shadow-lg bg-white/50 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Table - Smaller & Denser */}
      <Card className="border-0 shadow-2xl backdrop-blur-md bg-white/70 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                {["Name", "Matric No.", "Department", "Level", "Status", ""].map((header) => (
                  <th key={header} className="text-left p-4 text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => (
                <tr 
                  key={student.id} 
                  className={`border-b border-slate-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 ${i % 2 === 0 ? 'bg-slate-50/30' : ''}`}
                >
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-800">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary" className="px-3 py-1 text-xs font-mono bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200 rounded-full shadow-sm">
                      {student.matricNumber}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">{student.department}</td>
                  <td className="p-4">
                    <Badge className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 rounded-full shadow-sm">
                      {student.level} Level
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge 
                      className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-md transform hover:scale-105 transition-all ${
                        student.status === "active" 
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white" 
                          : student.status === "graduated" 
                          ? "bg-gradient-to-r from-purple-400 to-purple-500 text-white" 
                          : "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                      }`}
                    >
                      {student.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 rounded-xl border-white/50 shadow-2xl backdrop-blur-md">
                        <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 rounded-lg">
                          <span>✏️ Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer text-red-600 hover:bg-red-50 rounded-lg">
                          <span>🗑️ Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-16 text-center">
            <Skeleton className="mx-auto h-16 w-16 rounded-full bg-slate-200 mb-3" />
            <h3 className="text-lg font-bold text-slate-600 mb-1">No students found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">Try adjusting your search terms or add a new student.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Students;