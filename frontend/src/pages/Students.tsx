import { useState, useEffect, useRef } from "react";
import { Search, Plus, MoreHorizontal, Filter, X, Upload, User, Users, Building2, ListFilter } from "lucide-react";
// Removed ImageIcon, added User
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";

interface Student {
  _id: string;
  admissionNo: string;
  fullName: string;
  department: string;
  createdAt: string;
  photo?: string; // Base64 image string
}

const departmentOptions = [
  "All Departments",
  "Software Engineering",
  "Machine Learning",
  "Artificial Intelligence",
  "Mobile Development",
  "Cyber Security",
  "Data Science",
  "Data Analytics",
  "Cloud Computing",
  "Project Management",
  "Digital Marketing",
  "Product Design (UI/UX)",
  "DevOps",
  "Data Engineering",
];

type SortField = "fullName" | "admissionNo" | "department";
type SortOrder = "asc" | "desc";

const MAX_IMAGE_SIZE_KB = 15; // 15KB limit
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

const Students = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Filters & sorting
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [sortField, setSortField] = useState<SortField>("fullName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [formData, setFormData] = useState({
    admissionNo: "",
    fullName: "",
    department: "",
    photo: "", // Base64 string
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Prevent overscroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.documentElement).overscrollBehavior;
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.documentElement.style.overscrollBehavior = originalStyle;
      document.body.style.overscrollBehavior = originalStyle;
    };
  }, []);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      const mapped = data.map((s: any) => ({
        ...s,
        department: s.className || "",
        photo: s.photo || "",
      }));
      setStudents(mapped);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateFullName = (name: string): boolean => {
    const trimmed = name.trim();
    const words = trimmed.split(/\s+/);
    return words.length >= 2;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPEG, PNG, GIF, or WebP images are allowed.");
      setImagePreview(null);
      setFormData({ ...formData, photo: "" });
      return;
    }

    // Validate size (in KB)
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > MAX_IMAGE_SIZE_KB) {
      setImageError(`Image size must be less than ${MAX_IMAGE_SIZE_KB}KB.`);
      setImagePreview(null);
      setFormData({ ...formData, photo: "" });
      return;
    }

    setImageError(null);

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData({ ...formData, photo: base64String });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, photo: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImageError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFullName(formData.fullName)) {
      toast({
        title: "Invalid Name",
        description: "Please enter at least first name and last name (e.g., John Doe).",
        variant: "destructive",
      });
      return;
    }

    if (!formData.department) {
      toast({
        title: "Missing Department",
        description: "Please select a department.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const payload = {
        admissionNo: formData.admissionNo,
        fullName: formData.fullName.trim(),
        className: formData.department,
        photo: formData.photo, // send Base64 string
      };

      const url = editingStudent
        ? `${API_BASE}/students/${editingStudent._id}`
        : `${API_BASE}/students`;
      const method = editingStudent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save student");
      }

      const savedStudent = await res.json();
      const studentWithDept = {
        ...savedStudent,
        department: savedStudent.className || savedStudent.department,
        photo: savedStudent.photo || formData.photo,
      };

      if (editingStudent) {
        setStudents(students.map((s) => (s._id === savedStudent._id ? studentWithDept : s)));
        toast({ title: "Updated", description: "Student updated successfully." });
      } else {
        setStudents([...students, studentWithDept]);
        toast({ title: "Added", description: "Student added successfully." });
      }

      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");

      setStudents(students.filter((s) => s._id !== id));
      toast({ title: "Deleted", description: "Student removed." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      admissionNo: "",
      fullName: "",
      department: "",
      photo: "",
    });
    setImagePreview(null);
    setImageError(null);
    setEditingStudent(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      admissionNo: student.admissionNo,
      fullName: student.fullName,
      department: student.department,
      photo: student.photo || "",
    });
    setImagePreview(student.photo || null);
    setImageError(null);
    setDialogOpen(true);
  };

  // Filtering
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All Departments" || s.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Sorting
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortField === "fullName") {
      aVal = a.fullName.toLowerCase();
      bVal = b.fullName.toLowerCase();
    } else if (sortField === "admissionNo") {
      aVal = a.admissionNo.toLowerCase();
      bVal = b.admissionNo.toLowerCase();
    } else {
      aVal = a.department.toLowerCase();
      bVal = b.department.toLowerCase();
    }
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalFiltered = sortedStudents.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("All Departments");
    setSortField("fullName");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6699ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="border-none rounded-md shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="text-left">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Students</p>
                <p className="text-3xl md:text-4xl font-bold text-black mt-2 md:mt-3">{students.length}</p>
              </div>
              <div className="rounded-full p-2 text-blue-600 bg-opacity-10">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none rounded-md shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="text-left">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Departments</p>
                <p className="text-3xl md:text-4xl font-bold text-black mt-2 md:mt-3">{departmentOptions.length - 1}</p>
              </div>
              <div className="rounded-full p-2 text-blue-600 bg-opacity-10">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none rounded-md shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="text-left">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filtered Results</p>
                <p className="text-3xl md:text-4xl font-bold text-black mt-2 md:mt-3">{totalFiltered}</p>
              </div>
              <div className="rounded-full p-2 text-blue-600 bg-opacity-10">
                <ListFilter className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header & Filters */}
      <div className="bg-white border-none rounded-md shadow-md p-4 md:p-8 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black">Student Records</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your student database</p>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              if (!open) resetForm();
              setDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-[#6699ff] hover:bg-[#5588ee] text-white h-11 px-6 rounded-md font-medium gap-2 shadow-sm">
                <Plus className="w-4 h-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-md border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {editingStudent ? "Edit Student" : "Add New Student"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name (First and Last)</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g., John Doe"
                  />
                  <p className="text-xs text-slate-400">At least first and last name required</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admissionNo">Registration Number</Label>
                  <Input
                    id="admissionNo"
                    required
                    value={formData.admissionNo}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    placeholder="e.g., NCT/SP-NT/00/0001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger id="department" className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {departmentOptions.slice(1).map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload Section - Updated for 15KB limit */}
                <div className="space-y-2">
                  <Label>Student Photo (optional)</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </Button>
                    {imagePreview && (
                      <Button type="button" variant="ghost" onClick={removeImage} className="text-red-500">
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    title="Image"
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imageError && <p className="text-xs text-red-500">{imageError}</p>}
                  <p className="text-xs text-slate-400">
                    Max size {MAX_IMAGE_SIZE_KB}KB. Supported: JPEG, PNG, GIF, WebP
                  </p>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-20 w-20 rounded-full object-cover border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full h-11 rounded-md bg-[#6699ff] hover:bg-[#5588ee] shadow-sm">
                  {editingStudent ? "Update Student" : "Add Student"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Bar (unchanged) */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, registration number, or department..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 pl-10 rounded-md border-none shadow-sm bg-slate-50 focus-visible:ring-[#6699ff]"
              aria-label="Search students"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-56">
              <Select
                value={departmentFilter}
                onValueChange={(val) => {
                  setDepartmentFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-11 bg-slate-50 border-none shadow-sm">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Department" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={`${sortField}-${sortOrder}`}
                onValueChange={(val) => {
                  const [field, order] = val.split("-");
                  setSortField(field as SortField);
                  setSortOrder(order as SortOrder);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-11 bg-slate-50 border-none shadow-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullName-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="fullName-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="admissionNo-asc">Reg. No. (Asc)</SelectItem>
                  <SelectItem value="admissionNo-desc">Reg. No. (Desc)</SelectItem>
                  <SelectItem value="department-asc">Department (A-Z)</SelectItem>
                  <SelectItem value="department-desc">Department (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(search ||
              departmentFilter !== "All Departments" ||
              sortField !== "fullName" ||
              sortOrder !== "asc") && (
              <Button variant="ghost" onClick={clearFilters} className="h-11 gap-1 text-slate-500">
                <X className="w-4 h-4" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Pagination & page size controls */}
        {totalFiltered > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-3">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 bg-slate-50"
                aria-label="Items per page"
                title="Items per page"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>per page</span>
            </div>
            <div>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalFiltered)} of {totalFiltered}
            </div>
          </div>
        )}
      </div>

      {/* Student list – mobile cards, desktop table */}
      {paginatedStudents.length === 0 ? (
        <Card className="bg-white border-none rounded-md shadow-md p-12 text-center">
          <p className="text-slate-500">
            {search || departmentFilter !== "All Departments"
              ? "No matching students found."
              : "No students have been added yet."}
          </p>
          {(search || departmentFilter !== "All Departments") && (
            <Button variant="ghost" onClick={clearFilters} className="mt-3">
              Clear filters
            </Button>
          )}
        </Card>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {paginatedStudents.map((student) => (
              <Card key={student._id} className="bg-white p-4 shadow-md border-none rounded-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {student.photo ? (
                      <img
                        src={student.photo}
                        alt={student.fullName}
                        className="h-10 w-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-black">{student.fullName}</p>
                      <p className="text-xs text-slate-500">{student.admissionNo}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-md border-none shadow-xl">
                      <DropdownMenuItem onClick={() => startEdit(student)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(student._id)} className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2 border-t border-slate-50 pt-3">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Department</span>
                    <span className="text-xs text-slate-700">{student.department}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop table view */}
          <Card className="hidden lg:block bg-white border-none rounded-md shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] font-sans">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="text-left p-4 md:p-5 text-sm font-semibold text-slate-600">Photo</th>
                    <th className="text-left p-4 md:p-5 text-sm font-semibold text-slate-600">Name</th>
                    <th className="text-left p-4 md:p-5 text-sm font-semibold text-slate-600">Reg. No.</th>
                    <th className="text-left p-4 md:p-5 text-sm font-semibold text-slate-600">Department</th>
                    <th className="text-left p-4 md:p-5 text-sm font-semibold text-slate-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 md:p-5">
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt={student.fullName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-slate-400" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 md:p-5 font-medium text-black">{student.fullName}</td>
                      <td className="p-4 md:p-5 text-black">{student.admissionNo}</td>
                      <td className="p-4 md:p-5 text-slate-700">{student.department}</td>
                      <td className="p-4 md:p-5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md hover:bg-slate-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-md border-none shadow-xl">
                            <DropdownMenuItem onClick={() => startEdit(student)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(student._id)} className="text-red-600">
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
        </>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Students;
