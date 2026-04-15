export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  matricNumber: string;
  department: string;
  faculty: string;
  level: string;
  email: string;
  enrollmentYear: number;
  status: "active" | "graduated" | "suspended";
}

export interface AcademicRecord {
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  grade: string;
  semester: string;
  session: string;
}

export interface GeneratedDocument {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  type: "transcript" | "statement_of_result" | "letter";
  generatedAt: string;
  verificationCode: string;
  status: "valid" | "revoked";
}

export const mockStudents: Student[] = [
  { id: "1", firstName: "Adaeze", lastName: "Okonkwo", matricNumber: "CSC/2020/001", department: "Computer Science", faculty: "Science", level: "400", email: "adaeze.o@school.edu", enrollmentYear: 2020, status: "active" },
  { id: "2", firstName: "Emeka", lastName: "Nnamdi", matricNumber: "ENG/2021/045", department: "Mechanical Engineering", faculty: "Engineering", level: "300", email: "emeka.n@school.edu", enrollmentYear: 2021, status: "active" },
  { id: "3", firstName: "Fatima", lastName: "Abdullahi", matricNumber: "MED/2019/012", department: "Medicine", faculty: "Medical Sciences", level: "500", email: "fatima.a@school.edu", enrollmentYear: 2019, status: "active" },
  { id: "4", firstName: "Chinedu", lastName: "Eze", matricNumber: "LAW/2020/033", department: "Law", faculty: "Law", level: "400", email: "chinedu.e@school.edu", enrollmentYear: 2020, status: "graduated" },
  { id: "5", firstName: "Amina", lastName: "Bello", matricNumber: "BUS/2022/078", department: "Business Administration", faculty: "Management Sciences", level: "200", email: "amina.b@school.edu", enrollmentYear: 2022, status: "active" },
  { id: "6", firstName: "Oluwaseun", lastName: "Adeyemi", matricNumber: "CSC/2021/019", department: "Computer Science", faculty: "Science", level: "300", email: "seun.a@school.edu", enrollmentYear: 2021, status: "suspended" },
];

export const mockRecords: Record<string, AcademicRecord[]> = {
  "1": [
    { courseCode: "CSC301", courseTitle: "Data Structures & Algorithms", creditUnits: 3, grade: "A", semester: "First", session: "2022/2023" },
    { courseCode: "CSC303", courseTitle: "Operating Systems", creditUnits: 3, grade: "B", semester: "First", session: "2022/2023" },
    { courseCode: "CSC305", courseTitle: "Computer Architecture", creditUnits: 3, grade: "A", semester: "First", session: "2022/2023" },
    { courseCode: "CSC302", courseTitle: "Database Systems", creditUnits: 3, grade: "A", semester: "Second", session: "2022/2023" },
    { courseCode: "CSC304", courseTitle: "Software Engineering", creditUnits: 3, grade: "B", semester: "Second", session: "2022/2023" },
    { courseCode: "CSC401", courseTitle: "Artificial Intelligence", creditUnits: 3, grade: "A", semester: "First", session: "2023/2024" },
    { courseCode: "CSC403", courseTitle: "Computer Networks", creditUnits: 3, grade: "B", semester: "First", session: "2023/2024" },
  ],
};

export const mockDocuments: GeneratedDocument[] = [
  { id: "doc1", studentId: "1", studentName: "Adaeze Okonkwo", matricNumber: "CSC/2020/001", type: "transcript", generatedAt: "2024-03-15T10:30:00Z", verificationCode: "VRF-2024-A1B2C3", status: "valid" },
  { id: "doc2", studentId: "2", studentName: "Emeka Nnamdi", matricNumber: "ENG/2021/045", type: "statement_of_result", generatedAt: "2024-03-14T14:20:00Z", verificationCode: "VRF-2024-D4E5F6", status: "valid" },
  { id: "doc3", studentId: "4", studentName: "Chinedu Eze", matricNumber: "LAW/2020/033", type: "transcript", generatedAt: "2024-02-28T09:15:00Z", verificationCode: "VRF-2024-G7H8I9", status: "revoked" },
  { id: "doc4", studentId: "3", studentName: "Fatima Abdullahi", matricNumber: "MED/2019/012", type: "letter", generatedAt: "2024-03-10T16:45:00Z", verificationCode: "VRF-2024-J0K1L2", status: "valid" },
];

export function generateVerificationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "VRF-" + new Date().getFullYear() + "-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getGradePoint(grade: string): number {
  const map: Record<string, number> = { A: 5.0, B: 4.0, C: 3.0, D: 2.0, E: 1.0, F: 0 };
  return map[grade] ?? 0;
}
