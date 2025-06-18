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
import { useParams, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BookOpenIcon,
    TagIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon
  } from "@heroicons/react/24/outline";
  
import {
    UserIcon,
    AtSymbolIcon,
    IdentificationIcon,
} from '@heroicons/react/24/outline'
import { 
  BookOpen, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Clock, 
  Search,
  Plus,
  Download,
  Eye,
  Trash2,
  Edit,
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
import { fetchbook ,Book as BookType} from "@/lib/book";
import {fetchBorrowedBooks} from "@/lib/borrow"


export default function BookDetail() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const { toast } = useToast();

  const { id } = useParams();
    const token = localStorage.getItem("auth-token") || "";
  
    const {
      data: book,
      isLoading: studentLoading,
      isError,
    } = useQuery<BookType>({
      queryKey: ["book", id],
      queryFn: () =>
        fetchbook(
          { search: "" },
          id?.toString() || "",
          token
        ),
      enabled: !!token,
    });
  

  const { data: stats, isLoading: statsLoading } = useQuery({
      queryKey: ['borrowedBookStats'],
      queryFn: () => fetchBorrowedBookStats(token),
      enabled: !!token, // Only run if token exists
    });
  
  const { data: borrowedBooks, isLoading } = useQuery({
      queryKey: ["borrowedBooks", id],
      queryFn: () => fetchBorrowedBooks(id ?? "", token),
      enabled: !!token, // only run when token is available
  })
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


  const navigationItems = [
    { label: "Analytics", path: "/librarian-dashboard" },
    { label: "Inventory", path: "/inventory-management" },
    { label: "Students", path: "/student-management" },
    { label: "Issues", path: "/issue-management" },
    { label: "Reports", path: "/reports" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="SOMTU Library - Admin"
        showBackButton
        backPath="/librarian-dashboard"
        navigationItems={navigationItems}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header and Buttons */}
        <div className="flex justify-between items-center mb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Information</h1>
        </div>
        <div className="flex items-center space-x-4">
            <Button
              onClick={() => window.location.href = '/update-book/' + book?.id}
              className="tu-bg-blue text-white hover:bg-blue-700"
            >
            <Edit className="w-4 h-4" />
              Edit Book
            </Button>
            <Button 
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            >
            <Trash2 className="w-4 h-4" />
              Delete Data
            </Button>
          </div>
        </div>
        <div className="mb-8">
        <Card>
      <CardHeader>
        <CardTitle>Book Details</CardTitle>
      </CardHeader>
      <CardContent className="py-6 text-gray-800 bg-white">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 w-2/3 bg-gray-200 rounded-md animate-pulse" />
            ))}
          </div>
        ) : isError || !book ? (
          <p className="text-red-600 font-semibold">Failed to load book details.</p>
        ) : (
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex items-center space-x-3">
              <BookOpenIcon className="h-6 w-6 text-indigo-600" />
              <div>
                <dt className="text-sm font-semibold text-gray-900">Title</dt>
                <dd className="mt-1 text-sm text-gray-600">{book.title}</dd>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <UserIcon className="h-6 w-6 text-indigo-600" />
              <div>
                <dt className="text-sm font-semibold text-gray-900">Author</dt>
                <dd className="mt-1 text-sm text-gray-600">{book.author}</dd>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
              <div>
                <dt className="text-sm font-semibold text-gray-900">ISBN</dt>
                <dd className="mt-1 text-sm text-gray-600">{book.isbn}</dd>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <TagIcon className="h-6 w-6 text-indigo-600" />
              <div>
                <dt className="text-sm font-semibold text-gray-900">Category</dt>
                <dd className="mt-1 text-sm text-gray-600">{book.category}</dd>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
              <div>
                <dt className="text-sm font-semibold text-gray-900">Program</dt>
                <dd className="mt-1 text-sm text-gray-600">{book.program}</dd>
              </div>
            </div>

            <div className="flex items-center space-x-3">
            <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-600" />
              <div>
                <dt className="text-sm font-semibold text-gray-900">Total Copies</dt>
                <dd className="mt-1 text-sm text-gray-600">{book.totalCopies}</dd>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-indigo-600" />
              <div>
                <dt className="text-sm font-semibold text-gray-900">Available Copies</dt>
                <dd className="mt-1 text-sm text-gray-600">{book.availableCopies}</dd>
              </div>
            </div>

            {book.description && (
              <div className="col-span-2">
                <dt className="text-sm font-semibold text-gray-900">Description</dt>
                <dd className="mt-1 text-sm text-gray-600">{book.description}</dd>
              </div>
            )}
          </dl>
        )}
      </CardContent>
    </Card>
        </div>
      </div>
    </div>
  );
}