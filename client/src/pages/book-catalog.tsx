import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import BookCard from "@/components/book-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Book } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { fetchBooks} from "@/lib/book";


export default function BookCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();
  
  const token = localStorage.getItem("auth-token") || "";
  console.log(token);

  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books', { search: searchQuery, program: programFilter, category: categoryFilter }],
    queryFn: () => fetchBooks({ search: searchQuery, program: programFilter, category: categoryFilter }, token),
    enabled: !!token, // only run when token is available
  });

  const handleBorrowBook = (book: Book) => {
    toast({
      title: "Book borrowed successfully",
      description: `You have borrowed "${book.title}"`,
    });
  };

  const handleViewBook = (book: Book) => {
    toast({
      title: "Book details",
      description: `Viewing details for "${book.title}"`,
    });
  };

  const handleRequestBook = (book: Book) => {
    toast({
      title: "Book requested",
      description: `Your request for "${book.title}" has been submitted`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="Book Catalog"
        showBackButton
        backPath="/student-dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Books
              </Label>
              <div className="relative">
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
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
              <Label className="block text-sm font-medium text-gray-700 mb-2">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {books?.length || 0} results
            </p>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Book Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded"></div>
              </div>
            ))}
          </div>
        ) : books?.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No books found matching your search criteria.</p>
          </Card>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {books?.map((book: Book) => (
              <BookCard
                key={book.id}
                book={book}
                onBorrow={handleBorrowBook}
                onView={handleViewBook}
                onRequest={handleRequestBook}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {books && books.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 rounded-lg mt-8">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{Math.min(12, books.length)}</span> of{" "}
                  <span className="font-medium">{books.length}</span> results
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
      </div>
    </div>
  );
}
