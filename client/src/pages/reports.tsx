import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import StatsCard from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  FileBarChart2,
  Clock,
  AlertTriangle,
  Coins,
} from "lucide-react";

const navigationItems = [
  { label: "Analytics", path: "/librarian-dashboard" },
  { label: "Inventory", path: "/inventory-management" },
  { label: "Students", path: "/student-management" },
  { label: "Issues", path: "/issue-management" },
  { label: "Reports", path: "/reports" },
];

// Dummy student report data
const reportData = [
  {
    id: 1,
    name: "Anil Kumar Sharma",
    studentId: "MBA2024001",
    overdueBooks: 1,
    fines: 100,
    program: "MBA",
    dateReported: "2025-06-10",
  },
  {
    id: 2,
    name: "Priya Nepal",
    studentId: "MBAIT2024002",
    overdueBooks: 2,
    fines: 200,
    program: "MBAIT",
    dateReported: "2025-06-13",
  },
  {
    id: 3,
    name: "Rajesh Bhattarai",
    studentId: "MBAFC2024003",
    overdueBooks: 1,
    fines: 50,
    program: "MBAFC",
    dateReported: "2025-06-12",
  },
];

export default function Reports() {
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filteredReports = reportData.filter((r) => {
    if (programFilter !== "all" && r.program !== programFilter) return false;
    if (statusFilter !== "all") {
      if (statusFilter === "overdue" && r.overdueBooks === 0) return false;
      if (statusFilter === "fines" && r.fines === 0) return false;
    }
    if (dateFilter && !r.dateReported.includes(dateFilter)) return false;
    return true;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Student Reports</h1>
          <p className="text-gray-600 mt-1">
            Generate and view student borrowing and fine-related reports
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Reports"
            value={reportData.length}
            icon={FileBarChart2}
            color="blue"
          />
          <StatsCard
            title="Total Overdue"
            value={reportData.reduce((acc, r) => acc + r.overdueBooks, 0)}
            icon={Clock}
            color="amber"
          />
          <StatsCard
            title="Total Fines"
            value={`Rs. ${reportData.reduce((acc, r) => acc + r.fines, 0)}`}
            icon={Coins}
            color="red"
          />
        </div>

        {/* Filters */}
        <Card className="shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="mb-2 block">Program</Label>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="MBAIT">MBAIT</SelectItem>
                  <SelectItem value="MBAFC">MBAFC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="fines">Fines</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Date (YYYY-MM-DD)</Label>
              <Input
                placeholder="2025-06-13"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div className="flex items-end justify-start">
              <Button variant="secondary" className="w-full">
                <Download className="w-4 h-4 mr-2" /> Download CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Report Table */}
        <Card className="shadow-sm">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Flagged Students
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {filteredReports.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <AlertTriangle className="mx-auto w-8 h-8 mb-2 text-amber-500" />
                No matching reports found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Overdue</TableHead>
                    <TableHead>Fines</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="text-sm font-medium">{r.name}</div>
                        <div className="text-xs text-gray-500">{r.studentId}</div>
                      </TableCell>
                      <TableCell>{r.program}</TableCell>
                      <TableCell>{r.overdueBooks}</TableCell>
                      <TableCell>Rs. {r.fines}</TableCell>
                      <TableCell>{r.dateReported}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
