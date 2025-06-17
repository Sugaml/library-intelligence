import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import StatsCard from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Clock, 
  Search,
  Eye,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Book
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { fetchBorrows, fetchBorrowedBookStats,BorrowedBookStats} from "@/lib/issue";
import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

export default function IssueManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const { toast } = useToast();

  const token = localStorage.getItem("auth-token") || "";
  console.log(token);

  const { data: stats, isLoading: statsLoading } = useQuery({
      queryKey: ['borrowedBookStats'],
      queryFn: () => fetchBorrowedBookStats(token),
      enabled: !!token, // Only run if token exists
    });
  
  const { data: borrowedBooks, isLoading } = useQuery({
      queryKey: ['books', { search: searchQuery, program: programFilter,status: statusFilter }],
      queryFn: () => fetchBorrows({ search: searchQuery,status: statusFilter }, token),
      enabled: !!token, // only run when token is available
    });

  const renewBookMutation = useMutation({
    mutationFn: async (borrowedBookId: number) => {
      const response = await fetch(`/api/borrowed-books/${borrowedBookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          renewalCount: 1,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to renew book');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/borrowed-books'] });
      toast({
        title: "Book renewed",
        description: "Book has been renewed for 14 days",
      });
    },
  });

  const returnBookMutation = useMutation({
    mutationFn: async (borrowedBookId: number) => {
      const response = await fetch(`http://localhost:8080/api/v1/lms/borrows/${borrowedBookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'returned',
          returnedDate: new Date(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to return book');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/borrowed-books'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
      toast({
        title: "Book returned",
        description: "Book has been returned successfully",
      });
    },
  });

  const approveBookMutation = useMutation({
    mutationFn: async (borrowedBookId: number) => {
      const response = await fetch(`http://localhost:8080/api/v1/lms/borrows/${borrowedBookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'borrowed',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve book');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/borrowed-books'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
      toast({
        title: "Book approved",
        description: "Book has been approved successfully",
      });
    },
  });


  const navigationItems = [
    { label: "Analytics", path: "/librarian-dashboard" },
    { label: "Inventory", path: "/inventory-management" },
    { label: "Students", path: "/student-management" },
    { label: "Issues", path: "/issue-management" },
    { label: "Reports", path: "/reports" },
  ];

  const getStatusBadge = (borrowedBook: any) => {
    const dueDate = new Date(borrowedBook.due_date);
    const today = new Date();
    const isOverdue = dueDate < today;
    const dueSoon = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 3;

    if (borrowedBook.status === 'returned') {
      return <Badge className="tu-bg-green bg-opacity-10 tu-text-green">Returned</Badge>;
    }
    if (borrowedBook.status === 'borrowed') {
      return <Badge className="tu-bg-blue bg-opacity-10 tu-text-green">Borrowed</Badge>;
    }
    if (borrowedBook.status === 'pending') {
      return <Badge className="tu-bg-yellow bg-opacity-10 tu-text-green">Pending</Badge>;
    }
    if (isOverdue) {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    }
    if (dueSoon) {
      return <Badge className="tu-bg-amber bg-opacity-10 tu-text-amber">Due Soon</Badge>;
    }
    return <Badge className="tu-bg-blue bg-opacity-10 tu-text-blue">Active</Badge>;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const getDaysReturnd = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Return today";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const filteredBorrowedBooks = borrowedBooks?.filter((item: any) => {
    if (searchQuery && 
        !item.book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.student.student_id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (statusFilter !== "all") {
      const dueDate = new Date(item.due_date);
      const today = new Date();
      const isOverdue = dueDate < today;
      const dueSoon = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 3;
      
      if (statusFilter === "active" && (item.status !== 'borrowed' || isOverdue)) return false;
      if (statusFilter === "pending" && !isOverdue) return false;
      if (statusFilter === "overdue" && !isOverdue) return false;
      if (statusFilter === "due-soon" && !dueSoon) return false;
      if (statusFilter === "returned" && item.status !== 'returned') return false;
    }
    
    if (programFilter !== "all" && item.student.program !== programFilter) return false;
    
    return true;
  });

const peindingBooks = borrowedBooks?.filter((item: any) => {
    return item.status === 'pending';
  }) || [];

const returnedBooks = borrowedBooks?.filter((item: any) => {
    return item.returned_date!==null && item.status === 'returned';
}) || [];

const overdueBooks = borrowedBooks?.filter((item: any) => {
    const dueDate = new Date(item.due_date);
    return dueDate < new Date() && item.status === 'borrowed';
  }) || [];

const dueSoonBooks = borrowedBooks?.filter((item: any) => {
    const dueDate = new Date(item.due_date);
    const today = new Date();
    const diffDays = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 3 && diffDays > 0 && item.status === 'borrowed';
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="SOMTU Library - Admin"
        showBackButton
        backPath="/librarian-dashboard"
        navigationItems={navigationItems}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Issue Management</h1>
          <p className="text-gray-600 mt-1">Track and manage book borrowing activities</p>
        </div>

        {/* Issue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Issues"
            value={stats?.totalBorrowedBooks || 0}
            icon={BookOpen}
            color="blue"
          />
          <StatsCard
            title="Active Issues"
            value={stats?.pendingRequests || 0}
            icon={ArrowDownCircle}
            color="green"
          />
          <StatsCard
            title="Overdue Books"
            value={stats?.totalOverdueBooks || 0}
            icon={AlertTriangle}
            color="red"
          />
          <StatsCard
            title="Due Soon"
            value={stats?.dueSoon ?? 0}
            icon={Clock}
            color="amber"
          />
        </div>

        <Tabs defaultValue="all-issues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-issues">
              All Issues ({filteredBorrowedBooks?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Issues ({peindingBooks?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="overdue">
              Overdue ({overdueBooks.length})
            </TabsTrigger>
            <TabsTrigger value="returned">
              Recently Returned ({returnedBooks?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <Card className="shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Issues
                </Label>
                <div className="relative">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by book title, student name, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                </div>
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="borrowed">Borrowed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="due-soon">Due Soon</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
          </Card>

          <TabsContent value="all-issues">
            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="px-6 py-4 border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-900">All Book Issues</CardTitle>
              </CardHeader>
              
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading issues...</p>
                  </div>
                ) : filteredBorrowedBooks?.length === 0 ? (
                  <div className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No book issues found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book & Student</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Renewals</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBorrowedBooks?.map((borrowedBook: any) => (
                        <TableRow key={borrowedBook.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-4">
                              <img
                                src={borrowedBook.book.cover_image}
                                alt={`${borrowedBook.book.title} cover`}
                                className="w-10 h-14 object-cover rounded"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{borrowedBook.book.title}</div>
                                <div className="text-sm text-gray-500">by {borrowedBook.book.author}</div>
                                <div className="text-xs text-gray-400 flex items-center mt-1">
                                  <User className="w-3 h-3 mr-1" />
                                  {borrowedBook.student.full_name} ({borrowedBook.student.student_id})
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">
                              {new Date(borrowedBook.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="text-gray-900">{new Date(borrowedBook.due_date).toLocaleDateString()}</div>
                              <div className={`text-xs ${
                                new Date(borrowedBook.due_date) < new Date() ? 'text-red-600' : 'text-gray-500'
                              }`}>
                                {getDaysUntilDue(borrowedBook.due_date)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(borrowedBook)}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-900">{borrowedBook.renewal_count}/3</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm" className="tu-text-blue hover:tu-bg-blue hover:bg-opacity-10">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {borrowedBook.status === 'borrowed' && borrowedBook.renewalCount < 3 && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="tu-text-amber hover:tu-bg-amber hover:bg-opacity-10"
                                  onClick={() => renewBookMutation.mutate(borrowedBook.id)}
                                  disabled={renewBookMutation.isPending}
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                              )}
                              {borrowedBook.status === 'borrowed' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="tu-text-green hover:tu-bg-green hover:bg-opacity-10"
                                  onClick={() => returnBookMutation.mutate(borrowedBook.id)}
                                  disabled={returnBookMutation.isPending}
                                >
                                  <CheckCircle className="w-4 h-4" />
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
          </TabsContent>

          <TabsContent value="overdue">
            <Card className="bg-red-50 border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">Overdue Books ({overdueBooks.length})</h3>
              {overdueBooks.length === 0 ? (
                <p className="text-red-600">No overdue books at the moment.</p>
              ) : (
                <div className="space-y-4">
                  {overdueBooks.slice(0, 5).map((book: any) => (
                    <div key={book.id} className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{book.book.title}</h4>
                          <p className="text-sm text-gray-600">Student: {book.student.full_name} ({book.student.st})</p>
                          <p className="text-sm text-red-600 font-medium">
                            {getDaysUntilDue(book.dueDate)}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          className="tu-bg-red text-white hover:bg-red-700"
                        >
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card className="bg-red-50 border border-yellow-200 p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">Recent Books Request ({peindingBooks.length})</h3>
              {peindingBooks.length === 0 ? (
                <p className="text-red-600">No pending books at the moment.</p>
              ) : (
                <div className="space-y-4">
                  {peindingBooks.slice(0, 5).map((book: any) => (
                    <div key={book.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{book.book.title}</h4>
                          <p className="text-sm text-gray-600">Student: {book.student.full_name} ({book.student.student_id})</p>
                          <p className="text-sm text-yellow-600 font-medium">
                            {getDaysUntilDue(book.due_date)}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          className="tu-bg-red text-white hover:bg-green-700"
                          onClick={() => approveBookMutation.mutate(book.id)}
                          disabled={returnBookMutation.isPending}
                          >
                          Approve Request
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="due-soon">
            <Card className="bg-amber-50 border border-amber-200 p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Books Due Soon ({dueSoonBooks.length})</h3>
              {dueSoonBooks.length === 0 ? (
                <p className="text-amber-600">No books due soon.</p>
              ) : (
                <div className="space-y-4">
                  {dueSoonBooks.slice(0, 5).map((book: any) => (
                    <div key={book.id} className="bg-white rounded-lg p-4 border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{book.book.title}</h4>
                          <p className="text-sm text-gray-600">Student: {book.student.full_name} ({book.student.student_id})</p>
                          <p className="text-sm text-amber-600 font-medium">
                            Due: {new Date(book.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" className="tu-bg-amber text-white hover:bg-yellow-600">
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="returned">
          <Card className="bg-red-50 border border-red-200 p-6">
              <h3 className="text-lg font-semibold gray-400 mb-4">Recent Returned Books ({returnedBooks.length || 0})</h3>
              {returnedBooks.length === 0 ? (
                <p className="text-red-600">No pending books at the moment.</p>
              ) : (
                <div className="space-y-4">
                  {returnedBooks.slice(0, 5).map((book: any) => (
                    <div key={book.id} className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium gray-500">{book.book.title}</h4>
                          <p className="text-sm text-gray-600">Student: {book.student.full_name} ({book.student.student_id})</p>
                          <p className="text-sm text-red-600 font-medium">
                            {getDaysReturnd(book.returned_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}