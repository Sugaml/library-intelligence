import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import StatsCard from "@/components/stats-card";
import RecentActivity from "@/components/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, ArrowUp, AlertTriangle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LibrarianDashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['/api/analytics/stats'],
  });

  const { data: programStats } = useQuery({
    queryKey: ['/api/analytics/program-stats'],
  });

  const navigationItems = [
    { label: "Analytics", path: "/librarian-dashboard" },
    { label: "Inventory", path: "/inventory-management" },
    { label: "Students", path: "/student-management" },
    { label: "Reports", path: "/reports" },
  ];

  const recentTransactions = [
    {
      id: "1",
      type: "borrow" as const,
      title: "Anil Sharma (MBA2024001)",
      description: "Borrowed: \"Financial Management\"",
      time: "10 min ago",
    },
    {
      id: "2",
      type: "return" as const,
      title: "Priya Nepal (MBAIT2024002)",
      description: "Returned: \"Marketing Research\"",
      time: "25 min ago",
    },
  ];

  const programColors = {
    MBA: "tu-bg-blue",
    MBAIT: "tu-bg-green",
    MBAFC: "tu-bg-amber",
    "MBA GLM": "bg-purple-500",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="TU Library - Admin"
        navigationItems={navigationItems}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Library Analytics Dashboard</h1>
          <p className="text-gray-600">
            Today is <span className="font-medium">{new Date().toLocaleDateString()}</span> | 
            Total Active Students: <span className="font-medium tu-text-blue">{stats?.activeStudents || 0}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Books"
            value={stats?.totalBooks || 0}
            icon={Book}
            color="blue"
            change="↑ 2.3% from last month"
            changeType="positive"
          />
          <StatsCard
            title="Books Issued"
            value={stats?.borrowedBooks || 0}
            icon={ArrowUp}
            color="green"
            change="↑ 5.7% from last month"
            changeType="positive"
          />
          <StatsCard
            title="Overdue Books"
            value={stats?.overdueBooks || 0}
            icon={AlertTriangle}
            color="amber"
            change="↑ 12% from last week"
            changeType="negative"
          />
          <StatsCard
            title="Pending Requests"
            value={stats?.pendingRequests || 0}
            icon={Clock}
            color="purple"
            change="12 urgent"
            changeType="neutral"
          />
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Mock Chart Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="px-6 py-4 border-b">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Monthly Borrowing Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Borrowing trends chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Program-wise Distribution */}
          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Books by Program
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {programStats?.map((program: any, index: number) => {
                  const colors = Object.keys(programColors);
                  const colorClass = programColors[colors[index % colors.length] as keyof typeof programColors];
                  const percentage = Math.round((program.count / (stats?.totalBooks || 1)) * 100);
                  
                  return (
                    <div key={program.program} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 ${colorClass} rounded-full`}></div>
                        <span className="text-sm text-gray-600">{program.program}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{program.count}</p>
                        <p className="text-xs text-gray-500">{percentage}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <RecentActivity activities={recentTransactions} title="Recent Transactions" />

          {/* System Alerts */}
          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-lg font-semibold text-gray-900">System Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="text-red-500 w-4 h-4" />
                  <p className="text-sm font-medium text-red-800">Low Stock Alert</p>
                </div>
                <p className="text-xs text-red-600 mt-1">15 books below minimum stock level</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="text-amber-500 w-4 h-4" />
                  <p className="text-sm font-medium text-amber-800">Overdue Reminders</p>
                </div>
                <p className="text-xs text-amber-600 mt-1">
                  {stats?.overdueBooks || 0} books are overdue - reminders sent
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Book className="text-blue-500 w-4 h-4" />
                  <p className="text-sm font-medium text-blue-800">System Maintenance</p>
                </div>
                <p className="text-xs text-blue-600 mt-1">Scheduled maintenance on Dec 15, 2AM-4AM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
