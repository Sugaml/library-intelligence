import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import StudentDashboard from "@/pages/student-dashboard";
import LibrarianDashboard from "@/pages/librarian-dashboard";
import BookCatalog from "@/pages/book-catalog";
import QRScanner from "@/pages/qr-scanner";
import MyBooks from "@/pages/my-books";
import InventoryManagement from "@/pages/inventory-management";
import StudentManagement from "@/pages/student-management";
import AddBook from "@/pages/add-book";
import IssueManagement from "@/pages/issue-management";
import Reports from './pages/reports';
import AddStudent from "./pages/add-student";
import StudentDetail from "./pages/student";
import IssueBookPage from "./pages/issue-book";
import UpdateBook from "./pages/update-book";
import BookDetail from "./pages/book";

function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: string;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Redirect to={user.role === 'student' ? '/student-dashboard' : '/librarian-dashboard'} />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return <Redirect to={user.role === 'student' ? '/student-dashboard' : '/librarian-dashboard'} />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/">
        <PublicRoute>
          <Login />
        </PublicRoute>
      </Route>

      {/* Student routes */}
      <Route path="/student-dashboard">
        <ProtectedRoute requiredRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/book-catalog">
        <ProtectedRoute requiredRole="student">
          <BookCatalog />
        </ProtectedRoute>
      </Route>

      <Route path="/qr-scanner">
        <ProtectedRoute requiredRole="student">
          <QRScanner />
        </ProtectedRoute>
      </Route>

      <Route path="/my-books">
        <ProtectedRoute requiredRole="student">
          <MyBooks />
        </ProtectedRoute>
      </Route>

      {/* Librarian routes */}
      <Route path="/librarian-dashboard">
        <ProtectedRoute requiredRole="librarian">
          <LibrarianDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/inventory-management">
        <ProtectedRoute requiredRole="librarian">
          <InventoryManagement />
        </ProtectedRoute>
      </Route>

      <Route path="/student-management">
        <ProtectedRoute requiredRole="librarian">
          <StudentManagement />
        </ProtectedRoute>
      </Route>

      <Route path="/add-book">
        <ProtectedRoute requiredRole="librarian">
          <AddBook />
        </ProtectedRoute>
      </Route>
      
      <Route path="/book/:id">
        <ProtectedRoute requiredRole="librarian">
          <BookDetail />
        </ProtectedRoute>
      </Route>

      <Route path="/update-book/:id">
        <ProtectedRoute requiredRole="librarian">
          <UpdateBook />
        </ProtectedRoute>
      </Route>

      <Route path="/add-student">
        <ProtectedRoute requiredRole="librarian">
          <AddStudent />
        </ProtectedRoute>
      </Route>

      <Route path="/issue-book/:id">
        <ProtectedRoute requiredRole="librarian">
          <IssueBookPage />
        </ProtectedRoute>
      </Route>

      <Route path="/student-details/:id">
        <ProtectedRoute requiredRole="librarian">
          <StudentDetail />
        </ProtectedRoute>
      </Route>

      <Route path="/issue-management">
        <ProtectedRoute requiredRole="librarian">
          <IssueManagement />
        </ProtectedRoute>
      </Route>

      <Route path="/reports">
        <ProtectedRoute requiredRole="librarian">
          <Reports />
        </ProtectedRoute>
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
