import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { Book } from "@shared/schema";
import { fetchBooks } from "@/lib/book";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

export default function IssueBookPage() {
  const { id: studentId } = useParams();
  const token = localStorage.getItem("auth-token") || "";
  const userId = localStorage.getItem("user-id") || "";
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["books", { search, page }],
    queryFn: () => fetchBooks({ search, page, size: ITEMS_PER_PAGE }, token),
    enabled: !!token,
  });

  const books = data?.books || [];
  const totalBooks = data?.total || 0;
  const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE);

  const { mutate: issueBook, isLoading: isIssuing } = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:8080/api/v1/lms/borrows", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: selectedBookId,
          librarian_id: userId,
          user_id: studentId,
          due_date: new Date(dueDate).toISOString(),
          status:"borrowed",
          renewal_count: 0,
        }),
      });
      if (!response.ok) throw new Error("Failed to issue book");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });

      toast({
        title: "Book issued successfully",
        description: "Book has been issued to the student.",
      });

      setLocation(`/student-details/${studentId}`);
    },
    onError: (error) => {
      toast({
        title: "Issue failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Issue Book to Student</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {isLoading ? (
            <p>Loading books...</p>
          ) : books.length === 0 ? (
            <p>No books found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className={`border rounded-lg p-3 shadow-sm hover:bg-blue-50 transition cursor-pointer ${
                    selectedBookId === book.id ? "border-blue-500 ring-2 ring-blue-400" : ""
                  }`}
                  onClick={() => setSelectedBookId(book.id)}
                >
                  {book.coverImage && (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-32 w-full object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-semibold text-sm">{book.title}</h4>
                  <p className="text-xs text-gray-600">by {book.author}</p>
                  <p className="text-xs text-gray-500">Available: {book.availableCopies}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </p>
              <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}

          {/* Due date + submit */}
          {selectedBookId && (
            <div className="space-y-2 pt-4">
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Select due date"
              />
              <Button disabled={isIssuing || !dueDate} onClick={() => issueBook()}>
                {isIssuing ? "Issuing..." : "Confirm Issue"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
