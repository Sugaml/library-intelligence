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

const addStudentSchema = z.object({
    full_name: z.string().min(1, "full name is required"),
    email: z.string().min(1, "email is required"),
    username: z.string().min(6, "valid username required"),
    password: z.string().min(3, "password is required"),
    program: z.string().min(3, "Program is required"),
    student_id: z.string().min(5, "student ID is required"),
});

type AddStudentFormData = z.infer<typeof addStudentSchema>;

export default function AddStudent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddStudentFormData>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
        full_name: "",
        email: "",
        username: "",
        password: "",
        program: "",
        student_id: "",
    },
  });

  const addStudentMutation = useMutation({
    mutationFn: async (data: AddStudentFormData) => {
      const response = await fetch('http://localhost:8080/api/v1/lms/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add student');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
      toast({
        title: "Student added successfully",
        description: `"${data.full_name}" has been added to the LMS`,
      });
      setLocation('/student-management');
    },
    onError: (error) => {
      toast({
        title: "Error adding student",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: AddStudentFormData) => {
    setIsSubmitting(true);
    try {
      await addStudentMutation.mutateAsync(data);
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
        backPath="/student-management"
        navigationItems={navigationItems}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Book className="tu-text-blue mr-3" />
            Add New Student
          </h1>
          <p className="text-gray-600 mt-1">Add a new student to the library inventory</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter student full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input placeholder="joe.doe@somtu.edu.np" {...field} />
                        </FormControl>
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
                    name="student_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter student ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/student-management')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="tu-bg-blue text-white hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Adding student..." : "Add Student"}
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