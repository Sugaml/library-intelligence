// Mock data for consistent testing and demonstration
export const mockBooks = [
  {
    id: 1,
    title: "Financial Management Principles",
    author: "Dr. Rajesh Kumar",
    isbn: "978-9937-11-456-7",
    category: "Finance",
    program: "MBA",
    totalCopies: 5,
    availableCopies: 3,
    description: "Comprehensive guide to financial management principles and practices",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    title: "Marketing Research Methods",
    author: "Prof. Sita Devi",
    isbn: "978-9937-11-789-1",
    category: "Marketing",
    program: "MBAIT",
    totalCopies: 3,
    availableCopies: 2,
    description: "Modern approaches to marketing research and data analysis",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: 3,
    title: "Strategic Management",
    author: "Dr. Bharat Singh",
    isbn: "978-9937-11-234-5",
    category: "Management",
    program: "MBAFC",
    totalCopies: 2,
    availableCopies: 0,
    description: "Strategic planning and implementation in modern organizations",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: 4,
    title: "Global Business Environment",
    author: "Dr. Krishna Tamang",
    isbn: "978-9937-11-678-9",
    category: "Management",
    program: "MBA GLM",
    totalCopies: 5,
    availableCopies: 5,
    description: "Understanding global business dynamics and environmental factors",
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
    createdAt: new Date("2024-02-01"),
  },
];

export const mockUsers = [
  {
    id: 1,
    username: "admin",
    role: "librarian",
    email: "admin@tu.edu.np",
    fullName: "Ms. Sarah Sharma",
    program: null,
    studentId: null,
  },
  {
    id: 2,
    username: "john.doe",
    role: "student",
    email: "john.doe@tu.edu.np",
    fullName: "John Doe",
    program: "MBA",
    studentId: "MBA2024001",
  },
  {
    id: 3,
    username: "anil.sharma",
    role: "student",
    email: "anil.sharma@tu.edu.np",
    fullName: "Anil Kumar Sharma",
    program: "MBA",
    studentId: "MBA2024002",
  },
];

export const mockBorrowedBooks = [
  {
    id: 1,
    userId: 2,
    bookId: 1,
    borrowedDate: new Date("2024-11-25"),
    dueDate: new Date("2024-12-15"),
    returnedDate: null,
    renewalCount: 1,
    status: "borrowed",
  },
  {
    id: 2,
    userId: 2,
    bookId: 2,
    borrowedDate: new Date("2024-11-20"),
    dueDate: new Date("2024-12-20"),
    returnedDate: null,
    renewalCount: 0,
    status: "borrowed",
  },
];

export const mockFines = [
  {
    id: 1,
    userId: 2,
    borrowedBookId: 1,
    amount: 100,
    reason: "Late return",
    status: "pending",
    createdAt: new Date("2024-12-01"),
    paidAt: null,
  },
  {
    id: 2,
    userId: 3,
    borrowedBookId: 2,
    amount: 50,
    reason: "Late return",
    status: "pending",
    createdAt: new Date("2024-12-05"),
    paidAt: null,
  },
];

export const mockNotifications = [
  {
    id: 1,
    userId: 2,
    title: "Book Due Soon",
    description: "Your book 'Financial Management' is due in 3 days",
    type: "due_reminder",
    isRead: false,
    createdAt: new Date("2024-12-10"),
  },
  {
    id: 2,
    userId: 2,
    title: "Fine Applied",
    description: "A fine of Rs. 100 has been applied to your account",
    type: "fine",
    isRead: false,
    createdAt: new Date("2024-12-01"),
  },
];

export const mockLibraryStats = {
  totalBooks: 15432,
  availableBooks: 12185,
  borrowedBooks: 3247,
  overdueBooks: 124,
  totalStudents: 2847,
  activeStudents: 1234,
  pendingRequests: 47,
  totalFines: 15000,
};

export const mockBorrowingTrends = [
  { month: "Jan", count: 280 },
  { month: "Feb", count: 320 },
  { month: "Mar", count: 290 },
  { month: "Apr", count: 350 },
  { month: "May", count: 400 },
  { month: "Jun", count: 380 },
  { month: "Jul", count: 420 },
  { month: "Aug", count: 390 },
  { month: "Sep", count: 450 },
  { month: "Oct", count: 480 },
  { month: "Nov", count: 460 },
  { month: "Dec", count: 500 },
];

export const mockProgramStats = [
  { program: "MBA", count: 1247 },
  { program: "MBAIT", count: 897 },
  { program: "MBAFC", count: 623 },
  { program: "MBA GLM", count: 480 },
];

export const programColors = {
  MBA: "tu-bg-blue bg-opacity-10 tu-text-blue",
  MBAIT: "tu-bg-green bg-opacity-10 tu-text-green",
  MBAFC: "tu-bg-amber bg-opacity-10 tu-text-amber",
  "MBA GLM": "bg-purple-100 text-purple-600",
};

export const statusColors = {
  available: "tu-bg-green bg-opacity-10 tu-text-green",
  borrowed: "tu-bg-amber bg-opacity-10 tu-text-amber",
  overdue: "bg-red-100 text-red-800",
  "low-stock": "tu-bg-amber bg-opacity-10 tu-text-amber",
  "out-of-stock": "bg-red-100 text-red-800",
};
