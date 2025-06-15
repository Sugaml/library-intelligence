import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function MyBooks() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: borrowedBooks } = useQuery({
    queryKey: ['/api/borrowed-books', user?.id],
    enabled: !!user?.id,
  });

  const { data: fines } = useQuery({
    queryKey: ['/api/fines', user?.id],
    enabled: !!user?.id,
  });

  const handleRenewBook = (bookTitle: string) => {
    toast({
      title: "Book renewed",
      description: `"${bookTitle}" has been renewed successfully`,
    });
  };

  const handleReturnBook = (bookTitle: string) => {
    toast({
      title: "Book returned",
      description: `"${bookTitle}" has been returned successfully`,
    });
  };

  const totalFines = fines?.filter((f: any) => f.status === 'pending').reduce((sum: number, f: any) => sum + f.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="My Books"
        showBackButton
        backPath="/student-dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="borrowed" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="borrowed">
              Borrowed Books ({borrowedBooks?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="history">
              Reading History (12)
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites (5)
            </TabsTrigger>
            <TabsTrigger value="requests">
              Pending Requests (2)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="borrowed" className="space-y-6">
            {borrowedBooks?.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No books currently borrowed</p>
              </Card>
            ) : (
              borrowedBooks?.map((borrowedBook: any) => (
                <Card key={borrowedBook.id} className="shadow-sm border overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <img
                        src={borrowedBook.book.coverImage}
                        alt={`${borrowedBook.book.title} cover`}
                        className="w-20 h-28 object-cover rounded-lg shadow-sm"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {borrowedBook.book.title}
                            </h3>
                            <p className="text-gray-600 mb-2">by {borrowedBook.book.author}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <span>ISBN: {borrowedBook.book.isbn}</span>
                              <span>•</span>
                              <span>
                                Program: <span className="tu-text-blue font-medium">{borrowedBook.book.program}</span>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={`${
                                new Date(borrowedBook.dueDate) < new Date() 
                                  ? 'bg-red-100 text-red-800' 
                                  : new Date(borrowedBook.dueDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000
                                  ? 'tu-bg-amber bg-opacity-10 tu-text-amber'
                                  : 'tu-bg-green bg-opacity-10 tu-text-green'
                              }`}
                            >
                              {new Date(borrowedBook.dueDate) < new Date() 
                                ? 'Overdue' 
                                : `Due in ${Math.ceil((new Date(borrowedBook.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                              }
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-500">Borrowed Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(borrowedBook.borrowedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Due Date</p>
                            <p className={`text-sm font-medium ${
                              new Date(borrowedBook.dueDate) < new Date() ? 'text-red-600' : 'tu-text-amber'
                            }`}>
                              {new Date(borrowedBook.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Renewal Count</p>
                            <p className="text-sm font-medium text-gray-900">
                              {borrowedBook.renewalCount}/3
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex space-x-3">
                            <Button 
                              onClick={() => handleRenewBook(borrowedBook.book.title)}
                              disabled={borrowedBook.renewalCount >= 3}
                              className="tu-bg-blue text-white hover:bg-blue-700"
                            >
                              Renew Book
                            </Button>
                            <Button 
                              onClick={() => handleReturnBook(borrowedBook.book.title)}
                              className="tu-bg-green text-white hover:bg-green-700"
                            >
                              Return Book
                            </Button>
                            <Button variant="outline">
                              View Details
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">
                            {borrowedBook.renewalCount > 0 
                              ? `Last renewed: ${new Date(borrowedBook.borrowedDate).toLocaleDateString()}`
                              : 'Never renewed'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-8 text-center">
              <p className="text-gray-500">Reading history will be displayed here</p>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="p-8 text-center">
              <p className="text-gray-500">Favorite books will be displayed here</p>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card className="p-8 text-center">
              <p className="text-gray-500">Pending book requests will be displayed here</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Fine Payment Section */}
        {totalFines > 0 && (
          <Card className="bg-red-50 border border-red-200 p-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="tu-text-red text-xl" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Outstanding Fines</h3>
                  <p className="text-sm text-red-600">You have pending fines that need to be paid</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-800">Rs. {totalFines}</p>
                <Button className="tu-bg-red text-white hover:bg-red-700 mt-2">
                  Pay Now
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-red-200">
              <h4 className="font-medium text-red-800 mb-2">Fine Details:</h4>
              <div className="space-y-2 text-sm">
                {fines?.filter((f: any) => f.status === 'pending').map((fine: any) => (
                  <div key={fine.id} className="flex justify-between">
                    <span className="text-red-700">{fine.reason}</span>
                    <span className="font-medium">Rs. {fine.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
