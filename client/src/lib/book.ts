import { Book } from "@shared/schema";

export interface BookQueryParams {
    search?: string;
    program?: string;
    category?: string;
  }
  

export const fetchBooks = async (
    params: BookQueryParams,
    token: string
  ): Promise<Book[]> => {
    const url = new URL("http://localhost:8080/api/v1/lms/users");
  
    if (params.search) url.searchParams.append("search", params.search);
    if (params.program) url.searchParams.append("program", params.program);
    if (params.category) url.searchParams.append("category", params.category);
  
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
  
    const json = await response.json();
  
    return json.data.map((item: any): Book => ({
      id: item.id,
      createdAt: item.created_at ? new Date(item.created_at) : null,
      title: item.title,
      author: item.author,
      isbn: item.isbn,
      category: item.category,
      program: item.program,
      totalCopies: item.total_copies,
      availableCopies: item.available_copies,
      description: item.description || null,
      coverImage: item.cover_image || null,
    }));
  };
  