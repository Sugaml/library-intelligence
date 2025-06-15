import { 
  users, books, borrowedBooks, fines, bookRequests, notifications,
  type User, type InsertUser, type Book, type InsertBook, 
  type BorrowedBook, type InsertBorrowedBook, type Fine, type InsertFine,
  type BookRequest, type InsertBookRequest, type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Book operations
  getBooks(filters?: { program?: string; category?: string; search?: string }): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<InsertBook>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  
  // Borrowed books operations
  getBorrowedBooks(userId?: number): Promise<(BorrowedBook & { book: Book; user: User })[]>;
  getBorrowedBook(id: number): Promise<(BorrowedBook & { book: Book; user: User }) | undefined>;
  createBorrowedBook(borrowedBook: InsertBorrowedBook): Promise<BorrowedBook>;
  updateBorrowedBook(id: number, borrowedBook: Partial<BorrowedBook>): Promise<BorrowedBook | undefined>;
  
  // Fine operations
  getFines(userId?: number): Promise<(Fine & { borrowedBook: BorrowedBook & { book: Book } })[]>;
  createFine(fine: InsertFine): Promise<Fine>;
  updateFine(id: number, fine: Partial<Fine>): Promise<Fine | undefined>;
  
  // Book request operations
  getBookRequests(userId?: number): Promise<(BookRequest & { book: Book; user: User })[]>;
  createBookRequest(request: InsertBookRequest): Promise<BookRequest>;
  updateBookRequest(id: number, request: Partial<BookRequest>): Promise<BookRequest | undefined>;
  
  // Notification operations
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  
  // Analytics
  getLibraryStats(): Promise<{
    totalBooks: number;
    availableBooks: number;
    borrowedBooks: number;
    overdueBooks: number;
    totalStudents: number;
    activeStudents: number;
    pendingRequests: number;
    totalFines: number;
  }>;
  
  getBorrowingTrends(): Promise<{ month: string; count: number }[]>;
  getProgramStats(): Promise<{ program: string; count: number }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private books: Map<number, Book> = new Map();
  private borrowedBooks: Map<number, BorrowedBook> = new Map();
  private fines: Map<number, Fine> = new Map();
  private bookRequests: Map<number, BookRequest> = new Map();
  private notifications: Map<number, Notification> = new Map();
  
  private currentUserId: number = 1;
  private currentBookId: number = 1;
  private currentBorrowedBookId: number = 1;
  private currentFineId: number = 1;
  private currentRequestId: number = 1;
  private currentNotificationId: number = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed users
    const sampleUsers: InsertUser[] = [
      {
        username: "admin",
        password: "admin123",
        role: "librarian",
        email: "admin@tu.edu.np",
        fullName: "Ms. Sarah Sharma",
        program: null,
        studentId: null,
      },
      {
        username: "john.doe",
        password: "student123",
        role: "student",
        email: "john.doe@tu.edu.np",
        fullName: "John Doe",
        program: "MBA",
        studentId: "MBA2024001",
      },
      {
        username: "anil.sharma",
        password: "student123",
        role: "student",
        email: "anil.sharma@tu.edu.np",
        fullName: "Anil Kumar Sharma",
        program: "MBA",
        studentId: "MBA2024002",
      },
    ];

    sampleUsers.forEach(user => {
      this.users.set(this.currentUserId, { ...user, id: this.currentUserId, createdAt: new Date() });
      this.currentUserId++;
    });

    // Seed books
    const sampleBooks: InsertBook[] = [
      {
        title: "Financial Management Principles",
        author: "Dr. Rajesh Kumar",
        isbn: "978-9937-11-456-7",
        category: "Finance",
        program: "MBA",
        totalCopies: 5,
        availableCopies: 3,
        description: "Comprehensive guide to financial management",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
      },
      {
        title: "Marketing Research Methods",
        author: "Prof. Sita Devi",
        isbn: "978-9937-11-789-1",
        category: "Marketing",
        program: "MBAIT",
        totalCopies: 3,
        availableCopies: 2,
        description: "Modern approaches to marketing research",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
      },
      {
        title: "Strategic Management",
        author: "Dr. Bharat Singh",
        isbn: "978-9937-11-234-5",
        category: "Management",
        program: "MBAFC",
        totalCopies: 2,
        availableCopies: 0,
        description: "Strategic planning and implementation",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
      },
    ];

    sampleBooks.forEach(book => {
      this.books.set(this.currentBookId, { ...book, id: this.currentBookId, createdAt: new Date() });
      this.currentBookId++;
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = { ...user, id: this.currentUserId++, createdAt: new Date() };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Book operations
  async getBooks(filters?: { program?: string; category?: string; search?: string }): Promise<Book[]> {
    let books = Array.from(this.books.values());
    
    if (filters?.program) {
      books = books.filter(book => book.program === filters.program);
    }
    
    if (filters?.category) {
      books = books.filter(book => book.category === filters.category);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.isbn.includes(search)
      );
    }
    
    return books;
  }

  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async createBook(book: InsertBook): Promise<Book> {
    const newBook: Book = { ...book, id: this.currentBookId++, createdAt: new Date() };
    this.books.set(newBook.id, newBook);
    return newBook;
  }

  async updateBook(id: number, book: Partial<InsertBook>): Promise<Book | undefined> {
    const existingBook = this.books.get(id);
    if (!existingBook) return undefined;
    
    const updatedBook = { ...existingBook, ...book };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  async deleteBook(id: number): Promise<boolean> {
    return this.books.delete(id);
  }

  // Borrowed books operations
  async getBorrowedBooks(userId?: number): Promise<(BorrowedBook & { book: Book; user: User })[]> {
    let borrowed = Array.from(this.borrowedBooks.values());
    
    if (userId) {
      borrowed = borrowed.filter(b => b.userId === userId);
    }
    
    return borrowed.map(b => ({
      ...b,
      book: this.books.get(b.bookId)!,
      user: this.users.get(b.userId)!,
    })).filter(b => b.book && b.user);
  }

  async getBorrowedBook(id: number): Promise<(BorrowedBook & { book: Book; user: User }) | undefined> {
    const borrowed = this.borrowedBooks.get(id);
    if (!borrowed) return undefined;
    
    const book = this.books.get(borrowed.bookId);
    const user = this.users.get(borrowed.userId);
    
    if (!book || !user) return undefined;
    
    return { ...borrowed, book, user };
  }

  async createBorrowedBook(borrowedBook: InsertBorrowedBook): Promise<BorrowedBook> {
    const newBorrowedBook: BorrowedBook = {
      ...borrowedBook,
      id: this.currentBorrowedBookId++,
      borrowedDate: new Date(),
      returnedDate: null,
      renewalCount: 0,
      status: 'borrowed',
    };
    
    this.borrowedBooks.set(newBorrowedBook.id, newBorrowedBook);
    
    // Update book availability
    const book = this.books.get(borrowedBook.bookId);
    if (book && book.availableCopies > 0) {
      book.availableCopies--;
      this.books.set(book.id, book);
    }
    
    return newBorrowedBook;
  }

  async updateBorrowedBook(id: number, borrowedBook: Partial<BorrowedBook>): Promise<BorrowedBook | undefined> {
    const existing = this.borrowedBooks.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...borrowedBook };
    this.borrowedBooks.set(id, updated);
    
    // If returning a book, update availability
    if (borrowedBook.status === 'returned' && existing.status !== 'returned') {
      const book = this.books.get(existing.bookId);
      if (book) {
        book.availableCopies++;
        this.books.set(book.id, book);
      }
    }
    
    return updated;
  }

  // Fine operations
  async getFines(userId?: number): Promise<(Fine & { borrowedBook: BorrowedBook & { book: Book } })[]> {
    let fines = Array.from(this.fines.values());
    
    if (userId) {
      fines = fines.filter(f => f.userId === userId);
    }
    
    return fines.map(f => {
      const borrowedBook = this.borrowedBooks.get(f.borrowedBookId);
      const book = borrowedBook ? this.books.get(borrowedBook.bookId) : undefined;
      
      return {
        ...f,
        borrowedBook: { ...borrowedBook!, book: book! },
      };
    }).filter(f => f.borrowedBook && f.borrowedBook.book);
  }

  async createFine(fine: InsertFine): Promise<Fine> {
    const newFine: Fine = {
      ...fine,
      id: this.currentFineId++,
      status: 'pending',
      createdAt: new Date(),
      paidAt: null,
    };
    
    this.fines.set(newFine.id, newFine);
    return newFine;
  }

  async updateFine(id: number, fine: Partial<Fine>): Promise<Fine | undefined> {
    const existing = this.fines.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...fine };
    if (fine.status === 'paid' && existing.status !== 'paid') {
      updated.paidAt = new Date();
    }
    
    this.fines.set(id, updated);
    return updated;
  }

  // Book request operations
  async getBookRequests(userId?: number): Promise<(BookRequest & { book: Book; user: User })[]> {
    let requests = Array.from(this.bookRequests.values());
    
    if (userId) {
      requests = requests.filter(r => r.userId === userId);
    }
    
    return requests.map(r => ({
      ...r,
      book: this.books.get(r.bookId)!,
      user: this.users.get(r.userId)!,
    })).filter(r => r.book && r.user);
  }

  async createBookRequest(request: InsertBookRequest): Promise<BookRequest> {
    const newRequest: BookRequest = {
      ...request,
      id: this.currentRequestId++,
      status: 'pending',
      requestDate: new Date(),
      approvedDate: null,
      approvedBy: null,
    };
    
    this.bookRequests.set(newRequest.id, newRequest);
    return newRequest;
  }

  async updateBookRequest(id: number, request: Partial<BookRequest>): Promise<BookRequest | undefined> {
    const existing = this.bookRequests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...request };
    if (request.status === 'approved' && existing.status !== 'approved') {
      updated.approvedDate = new Date();
    }
    
    this.bookRequests.set(id, updated);
    return updated;
  }

  // Notification operations
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(n => n.userId === userId);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: this.currentNotificationId++,
      isRead: false,
      createdAt: new Date(),
    };
    
    this.notifications.set(newNotification.id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }

  // Analytics
  async getLibraryStats() {
    const totalBooks = this.books.size;
    const availableBooks = Array.from(this.books.values()).reduce((sum, book) => sum + book.availableCopies, 0);
    const borrowedBooks = Array.from(this.borrowedBooks.values()).filter(b => b.status === 'borrowed').length;
    const overdueBooks = Array.from(this.borrowedBooks.values()).filter(b => 
      b.status === 'borrowed' && new Date() > new Date(b.dueDate)
    ).length;
    const totalStudents = Array.from(this.users.values()).filter(u => u.role === 'student').length;
    const activeStudents = Array.from(this.borrowedBooks.values()).filter(b => b.status === 'borrowed')
      .map(b => b.userId)
      .filter((id, index, array) => array.indexOf(id) === index).length;
    const pendingRequests = Array.from(this.bookRequests.values()).filter(r => r.status === 'pending').length;
    const totalFines = Array.from(this.fines.values()).filter(f => f.status === 'pending')
      .reduce((sum, fine) => sum + fine.amount, 0);

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      overdueBooks,
      totalStudents,
      activeStudents,
      pendingRequests,
      totalFines,
    };
  }

  async getBorrowingTrends(): Promise<{ month: string; count: number }[]> {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      count: Math.floor(Math.random() * 100) + 200, // Mock data
    }));
  }

  async getProgramStats(): Promise<{ program: string; count: number }[]> {
    const programs = ['MBA', 'MBAIT', 'MBAFC', 'MBA GLM'];
    return programs.map(program => ({
      program,
      count: Array.from(this.books.values()).filter(b => b.program === program).length,
    }));
  }
}

export const storage = new MemStorage();
