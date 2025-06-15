import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import StatsCard from "@/components/stats-card";
import RecentActivity from "@/components/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Clock, CreditCard, FileText, Search, QrCode, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: borrowedBooks } = useQuery({
    queryKey: ['/api/borrowed-books', user?.id],
    enabled: !!user?.id,
  });

  const { data: fines } = useQuery({
    queryKey: ['/api/fines', user?.id],
    enabled: !!user?.id,
  });

  const { data: requests } = useQuery({
    queryKey: ['/api/book-requests', user?.id],
    enabled: !!user?.id,
  });

  const navigationItems = [
    { label: "Dashboard", path: "/student-dashboard" },
    { label: "Browse Books", path: "/book-catalog" },
    { label: "My Books", path: "/my-books" },
    { label: "QR Scanner", path: "/qr-scanner" },
  ];

  const activities = [
    {
      id: "1",
      type: "borrow" as const,
      title: "Borrowed \"Marketing Research\"",
      description: "",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "return" as const,
      title: "Returned \"Corporate Finance\"",
      description: "",
      time: "1 day ago",
    },
    {
      id: "3",
      type: "fine" as const,
      title: "Fine payment of Rs. 50",
      description: "",
      time: "3 days ago",
    },
    {
      id: "4",
      type: "request" as const,
      title: "Requested \"Advanced Accounting\"",
      description: "",
      time: "5 days ago",
    },
  ];

  const stats = {
    borrowedBooks: borrowedBooks?.length || 0,
    dueSoon: borrowedBooks?.filter(b => {
      const dueDate = new Date(b.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays > 0;
    }).length || 0,
    pendingFines: fines?.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0) || 0,
    pendingRequests: requests?.filter(r => r.status === 'pending').length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="TU Library"
        navigationItems={navigationItems}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            Program: <span className="font-medium tu-text-blue">{user?.program}</span> | 
            Student ID: <span className="font-medium">{user?.studentId}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Books Borrowed"
            value={stats.borrowedBooks}
            icon={Book}
            color="blue"
          />
          <StatsCard
            title="Due Soon"
            value={stats.dueSoon}
            icon={Clock}
            color="green"
          />
          <StatsCard
            title="Pending Fines"
            value={`Rs. ${stats.pendingFines}`}
            icon={CreditCard}
            color="amber"
          />
          <StatsCard
            title="Requests"
            value={stats.pendingRequests}
            icon={FileText}
            color="purple"
          />
        </div>

        {/* Current Books & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Currently Borrowed Books */}
          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Currently Borrowed Books
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {borrowedBooks?.length > 0 ? (
                <div className="space-y-4">
                  {borrowedBooks.slice(0, 3).map((borrowedBook: any) => (
                    <div key={borrowedBook.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={borrowedBook.book.coverImage}
                        alt={`${borrowedBook.book.title} cover`}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{borrowedBook.book.title}</h4>
                        <p className="text-sm text-gray-500">by {borrowedBook.book.author}</p>
                        <p className="text-xs tu-text-amber font-medium">
                          Due: {new Date(borrowedBook.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" className="tu-bg-blue text-white hover:bg-blue-700">
                        Renew
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full tu-text-blue hover:bg-blue-50"
                    onClick={() => setLocation('/my-books')}
                  >
                    View All Borrowed Books →
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No books currently borrowed</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <RecentActivity activities={activities} />
        </div>

        {/* Fines Alert */}
        {stats.pendingFines > 0 && (
          <Card className="bg-red-50 border border-red-200 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="tu-text-red text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Outstanding Fines</h3>
                    <p className="text-sm text-red-600">You have pending fines that need to be paid</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-800">Rs. {stats.pendingFines}</p>
                  <Button className="tu-bg-red text-white hover:bg-red-700 mt-2">
                    Pay Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="p-6 h-auto flex flex-col items-center hover:shadow-md transition-shadow"
              onClick={() => setLocation('/book-catalog')}
            >
              <Search className="tu-text-blue text-2xl mb-3" />
              <p className="font-medium text-gray-900">Search Books</p>
            </Button>

            <Button
              variant="outline"
              className="p-6 h-auto flex flex-col items-center hover:shadow-md transition-shadow"
              onClick={() => setLocation('/qr-scanner')}
            >
              <QrCode className="tu-text-green text-2xl mb-3" />
              <p className="font-medium text-gray-900">Scan QR Code</p>
            </Button>

            <Button
              variant="outline"
              className="p-6 h-auto flex flex-col items-center hover:shadow-md transition-shadow"
            >
              <CreditCard className="tu-text-amber text-2xl mb-3" />
              <p className="font-medium text-gray-900">Pay Fines</p>
            </Button>

            <Button
              variant="outline"
              className="p-6 h-auto flex flex-col items-center hover:shadow-md transition-shadow"
            >
              <FileText className="text-purple-500 text-2xl mb-3" />
              <p className="font-medium text-gray-900">Request Book</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
