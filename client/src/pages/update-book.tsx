import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Book, Save, Upload } from "lucide-react";

const updateBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(10, "Valid ISBN is required"),
  category: z.string().min(1, "Category is required"),
  program: z.string().min(1, "Program is required"),
  total_copies: z.number().min(1, "At least 1 copy is required"),
  available_copies: z.number().min(0, "Available copies cannot be negative"),
  description: z.string().optional(),
  cover_image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type UpdateBookFormData = z.infer<typeof updateBookSchema>;

export default function UpdateBook() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateBookFormData>({
    resolver: zodResolver(updateBookSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      category: "",
      program: "",
      total_copies: 1,
      available_copies: 1,
      description: "",
      cover_image: "",
    },
  });

  const addBookMutation = useMutation({
    mutationFn: async (data: UpdateBookFormData) => {
      const response = await fetch('http://localhost:8080/api/v1/lms/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add book');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
      toast({
        title: "Book added successfully",
        description: `"${data.title}" has been added to the library`,
      });
      setLocation('/inventory-management');
    },
    onError: (error) => {
      toast({
        title: "Error adding book",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: UpdateBookFormData) => {
    setIsSubmitting(true);
    try {
      await addBookMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        backPath="/inventory-management"
        navigationItems={navigationItems}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Book className="tu-text-blue mr-3" />
            Add New Book
          </h1>
          <p className="text-gray-600 mt-1">Add a new book to the library inventory</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Book Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Book Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter book title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter author name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isbn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISBN *</FormLabel>
                        <FormControl>
                          <Input placeholder="978-9937-11-XXX-X" {...field} />
                        </FormControl>
                        <FormDescription>
                          International Standard Book Number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Management">Management</SelectItem>
                            <SelectItem value="Economics">Economics</SelectItem>
                            <SelectItem value="Accounting">Accounting</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="Information Technology">Information Technology</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select program" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MBA">MBA</SelectItem>
                            <SelectItem value="MBAIT">MBAIT</SelectItem>
                            <SelectItem value="MBAFC">MBAFC</SelectItem>
                            <SelectItem value="MBA GLM">MBA GLM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_copies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Copies *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="available_copies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Copies *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Should be ≤ Total Copies
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cover_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/book-cover.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional: URL to book cover image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the book content..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Brief description of the book
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/inventory-management')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="tu-bg-blue text-white hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Adding Book..." : "Add Book"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}