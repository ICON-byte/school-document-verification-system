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
    toast({ title: "Student added", description: `${student.firstName} ${student.lastName} has been registered.` });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Records</h1>
          <p className="text-muted-foreground mt-1">Manage student information and records</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="w-4 h-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input required value={newStudent.firstName} onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input required value={newStudent.lastName} onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Matric Number</Label>
                <Input required placeholder="e.g. CSC/2024/001" value={newStudent.matricNumber} onChange={(e) => setNewStudent({ ...newStudent, matricNumber: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input required value={newStudent.department} onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Faculty</Label>
                  <Input required value={newStudent.faculty} onChange={(e) => setNewStudent({ ...newStudent, faculty: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input required type="email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">Add Student</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, matric number, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Matric No.</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Department</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Level</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-mono text-muted-foreground">{student.matricNumber}</td>
                  <td className="p-4 text-sm text-muted-foreground">{student.department}</td>
                  <td className="p-4 text-sm text-muted-foreground">{student.level} Level</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.status === "active" ? "bg-success/10 text-success" :
                      student.status === "graduated" ? "bg-accent/10 text-accent" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">No students found matching your search.</div>
        )}
      </div>
    </div>
  );
};

export default Students;
