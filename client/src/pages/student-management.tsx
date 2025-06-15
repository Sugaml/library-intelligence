import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import StatsCard from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  GraduationCap,
  BookOpen,
  AlertTriangle,
  FileText,
  Search,
  Eye,
  Send,
  CheckCircle,
  Ban,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchStudents} from "@/lib/student";
import { Student } from "@/lib/student";


export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("overdue");
  const { toast } = useToast();

  const { data: stats } = useQuery({ queryKey: ['/api/analytics/stats'] });
  const { data: borrowedBooks } = useQuery({ queryKey: ['/api/borrowed-books'] });
  const { data: fines } = useQuery({ queryKey: ['/api/fines'] });

  const navigationItems = [
    { label: "Analytics", path: "/librarian-dashboard" },
    { label: "Inventory", path: "/inventory-management" },
    { label: "Students", path: "/student-management" },
    { label: "Issues", path: "/issue-management" },
    { label: "Reports", path: "/reports" },
  ];

const token = localStorage.getItem("auth-token") || "";

const { data: students = [], isLoading, error } = useQuery<Student[]>({
  queryKey: ['students', { search: searchQuery, program: programFilter, status: statusFilter }],
  queryFn: () =>
    fetchStudents(
      {
        search: searchQuery,
        program: programFilter,
        category: "all", // if your API accepts this
      },
      token
    ),
  enabled: !!token,
});
console.log("length",students);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="tu-bg-green bg-opacity-10 tu-text-green">Active</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case "high-risk":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
      case "clearance":
        return <Badge className="bg-purple-100 text-purple-800">Pending Clearance</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600">Unknown</Badge>;
    }
  };

  const getProgramBadge = (program: string) => {
    const programColors = {
      MBA: "tu-bg-blue bg-opacity-10 tu-text-blue",
      MBAIT: "tu-bg-green bg-opacity-10 tu-text-green",
      MBAFC: "tu-bg-amber bg-opacity-10 tu-text-amber",
      "MBA GLM": "bg-purple-100 text-purple-600",
    };

    return (
      <Badge className={programColors[program as keyof typeof programColors] || "bg-gray-100 text-gray-600"}>
        {program}
      </Badge>
    );
  };

  const filteredStudents = students.filter(student => {
    if (
      searchQuery &&
      !student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !student.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (programFilter !== "all" && student.program !== programFilter) return false;
    return true;
  });

  const handleSendReminder = (studentName: string) => {
    toast({
      title: "Reminder sent",
      description: `Overdue reminder sent to ${studentName}`,
    });
  };

  const handleClearStudent = (studentName: string) => {
    toast({
      title: "Student cleared",
      description: `${studentName} has been cleared for library access`,
    });
  };

  const handleBlockStudent = (studentName: string) => {
    toast({
      title: "Student blocked",
      description: `${studentName} has been temporarily blocked from library access`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="SOMTU Library - Admin"
        showBackButton
        backPath="/librarian-dashboard"
        navigationItems={navigationItems}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage student library accounts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Students" value={stats?.totalStudents || 0} icon={GraduationCap} color="blue" />
          <StatsCard title="Active Borrowers" value={stats?.activeStudents || 0} icon={BookOpen} color="green" />
          <StatsCard title="Overdue Students" value={students.filter(s => s.overdueCount > 0).length} icon={AlertTriangle} color="amber" />
          <StatsCard title="Pending Clearance" value={0} icon={FileText} color="red" />
        </div>

        <Card className="shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Search Students</Label>
              <div className="relative">
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name, student ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Program</Label>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="MBAIT">MBAIT</SelectItem>
                  <SelectItem value="MBAFC">MBAFC</SelectItem>
                  <SelectItem value="MBA GLM">MBA GLM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Has Overdue</SelectItem>
                  <SelectItem value="fines">Has Fines</SelectItem>
                  <SelectItem value="clearance">Pending Clearance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Student Records</CardTitle>
              <span className="text-sm text-gray-500">
                Showing {filteredStudents.length} students with issues requiring attention
              </span>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No students found matching your criteria</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Books</TableHead>
                    <TableHead>Fines</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <img
                            src={student.profileImage}
                            alt={`${student.name} profile`}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.studentId}</div>
                            <div className="text-xs text-gray-400">{student.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getProgramBadge(student.program)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Borrowed: <span className="font-medium tu-text-amber">{student.borrowedCount}</span></div>
                          <div>Overdue: <span className="font-medium text-red-500">{student.overdueCount}</span></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-red-600">Rs. {student.fines}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="tu-text-blue hover:tu-bg-blue hover:bg-opacity-10">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="tu-text-amber hover:tu-bg-amber hover:bg-opacity-10" onClick={() => handleSendReminder(student.name)}>
                            <Send className="w-4 h-4" />
                          </Button>
                          {(student.status === "warning" || student.status === "overdue") ? (
                            <Button variant="ghost" size="sm" className="tu-text-green hover:tu-bg-green hover:bg-opacity-10" onClick={() => handleClearStudent(student.name)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleBlockStudent(student.name)}>
                              <Ban className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
