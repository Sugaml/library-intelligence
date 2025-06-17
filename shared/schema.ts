import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'student' | 'librarian'
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  program: text("program"), // MBA, MBAIT, MBAFC, MBA GLM
  studentId: text("student_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const books = pgTable("books", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: text("isbn").notNull().unique(),
  category: text("category").notNull(),
  program: text("program").notNull(),
  totalCopies: integer("total_copies").notNull(),
  availableCopies: integer("available_copies").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const borrowedBooks = pgTable("borrowed_books", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  borrowedDate: timestamp("borrowed_date").defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  returnedDate: timestamp("returned_date"),
  renewalCount: integer("renewal_count").default(0),
  status: text("status").notNull(), // 'borrowed' | 'returned' | 'overdue'
});

export const fines = pgTable("fines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  borrowedBookId: integer("borrowed_book_id").references(() => borrowedBooks.id).notNull(),
  amount: integer("amount").notNull(), // in paisa
  reason: text("reason").notNull(),
  status: text("status").notNull(), // 'pending' | 'paid'
  createdAt: timestamp("created_at").defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const bookRequests = pgTable("book_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  status: text("status").notNull(), // 'pending' | 'approved' | 'rejected'
  requestDate: timestamp("request_date").defaultNow(),
  approvedDate: timestamp("approved_date"),
  approvedBy: integer("approved_by").references(() => users.id),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'due_reminder' | 'fine' | 'request_approved' | 'general'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  email: true,
  fullName: true,
  program: true,
  studentId: true,
});

export const insertBookSchema = createInsertSchema(books).pick({
  title: true,
  author: true,
  isbn: true,
  category: true,
  program: true,
  totalCopies: true,
  availableCopies: true,
  description: true,
  coverImage: true,
});

export const insertBorrowedBookSchema = createInsertSchema(borrowedBooks).pick({
  userId: true,
  bookId: true,
  dueDate: true,
});

export const insertFineSchema = createInsertSchema(fines).pick({
  userId: true,
  borrowedBookId: true,
  amount: true,
  reason: true,
});

export const insertBookRequestSchema = createInsertSchema(bookRequests).pick({
  userId: true,
  bookId: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  description: true,
  type: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type BorrowedBook = typeof borrowedBooks.$inferSelect;
export type InsertBorrowedBook = z.infer<typeof insertBorrowedBookSchema>;
export type Fine = typeof fines.$inferSelect;
export type InsertFine = z.infer<typeof insertFineSchema>;
export type BookRequest = typeof bookRequests.$inferSelect;
export type InsertBookRequest = z.infer<typeof insertBookRequestSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
