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
import { 
  Book, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Plus, 
  Download, 
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Trash2
} from "lucide-react";
import { Book as BookType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ['/api/analytics/stats'],
  });

  const { data: books, isLoading } = useQuery({
    queryKey: ['/api/books', { search: searchQuery, program: programFilter, category: categoryFilter }],
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (bookId: number) => {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
      toast({
        title: "Book deleted",
        description: "Book has been removed from inventory",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    },
  });

  const navigationItems = [
    { label: "Analytics", path: "/librarian-dashboard" },
    { label: "Inventory", path: "/inventory-management" },
    { label: "Students", path: "/student-management" },
    { label: "Reports", path: "/reports" },
  ];

  const getStatusBadge = (book: BookType) => {
    if (book.availableCopies === 0) {
      return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
    } else if (book.availableCopies <= 2) {
      return <Badge className="tu-bg-amber bg-opacity-10 tu-text-amber">Low Stock</Badge>;
    } else {
      return <Badge className="tu-bg-green bg-opacity-10 tu-text-green">Available</Badge>;
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

  const filteredBooks = books?.filter((book: BookType) => {
    if (statusFilter === "available" && book.availableCopies === 0) return false;
    if (statusFilter === "out-of-stock" && book.availableCopies > 0) return false;
    if (statusFilter === "low-stock" && book.availableCopies > 2) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="TU Library - Admin"
        showBackButton
        backPath="/librarian-dashboard"
        navigationItems={navigationItems}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Manage your library's book collection</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => window.location.href = '/add-book'}
              className="tu-bg-blue text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Book
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Books"
            value={stats?.totalBooks || 0}
            icon={Book}
            color="blue"
          />
          <StatsCard
            title="Available"
            value={stats?.availableBooks || 0}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Borrowed"
            value={stats?.borrowedBooks || 0}
            icon={ExternalLink}
            color="amber"
          />
          <StatsCard
            title="Low Stock Alert"
            value={filteredBooks?.filter((b: BookType) => b.availableCopies <= 2 && b.availableCopies > 0).length || 0}
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Filters and Search */}
        <Card className="shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Books
              </Label>
              <div className="relative">
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by title, author, ISBN..."
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
                  <SelectItem value="">All Programs</SelectItem>
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
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="borrowed">Borrowed</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Inventory Table */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Book Inventory</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Showing 1-{Math.min(20, filteredBooks?.length || 0)} of {filteredBooks?.length || 0} books
                </span>
              </div>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading inventory...</p>
              </div>
            ) : filteredBooks?.length === 0 ? (
              <div className="p-8 text-center">
                <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No books found matching your criteria</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Book Details</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks?.slice(0, 20).map((book: BookType) => (
                    <TableRow key={book.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <img
                            src={book.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=60"}
                            alt={`${book.title} cover`}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{book.title}</div>
                            <div className="text-sm text-gray-500">by {book.author}</div>
                            <div className="text-xs text-gray-400">ISBN: {book.isbn}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getProgramBadge(book.program)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Total: <span className="font-medium">{book.totalCopies}</span></div>
                          <div>Available: <span className="font-medium tu-text-green">{book.availableCopies}</span></div>
                          <div>Borrowed: <span className="font-medium tu-text-amber">{book.totalCopies - book.availableCopies}</span></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(book)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="tu-text-blue hover:tu-bg-blue hover:bg-opacity-10">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => deleteBookMutation.mutate(book.id)}
                            disabled={deleteBookMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {filteredBooks && filteredBooks.length > 20 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button variant="outline">Previous</Button>
                <Button variant="outline">Next</Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{Math.min(20, filteredBooks.length)}</span> of{" "}
                    <span className="font-medium">{filteredBooks.length}</span> results
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
