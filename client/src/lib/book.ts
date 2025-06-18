
export interface BookQueryParams {
  search?: string;
  title?: string;
  program?: string;
  category?: string;
  page?: number;
  size?: number;
}

export interface Book  {
  title: string;
  id: string;
  author: string;
  isbn: string;
  category: string;
  program: string;
  totalCopies: number;
  availableCopies: number;
  description: string | null;
  coverImage: string | null;
  createdAt: Date | null;
}
  
export const fetchBooks = async (
    params: BookQueryParams,
    token: string
  ): Promise<{ books: Book[]; total: number }> => {
    const url = new URL("http://localhost:8080/api/v1/lms/books");
  
  if (params.search) url.searchParams.append("search", params.search);
  if (params.title) url.searchParams.append("title", params.title);
  if (params.program) url.searchParams.append("program", params.program);
  if (params.category) url.searchParams.append("category", params.category);
  if (params.page) url.searchParams.append("page", params.page.toString());
  if (params.size) url.searchParams.append("size", params.size.toString());
  
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch books");

  const json = await response.json();

  return {
    books: json.data.map((item: any): Book => ({
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
    })),
    total: json.count,
  };
};

export const fetchbook = async (
    params: BookQueryParams,
    id: string,
    token: string
  ): Promise<Book> => {
    const url = new URL("http://localhost:8080/api/v1/lms/books/" + id);
  
    if (params.search) url.searchParams.append("search", params.search);
    if (params.program) url.searchParams.append("program", params.program);
  
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch student");
    }
  
    const json = await response.json();
  
    const mappedResponse: Book = {
      id: json.data.id,
      createdAt: json.data.created_at ? new Date(json.data.created_at) : null,
      title: json.data.title,
      author: json.data.author,
      isbn: json.data.isbn,
      category: json.data.category,
      program: json.data.program,
      totalCopies: json.data.total_copies,
      availableCopies: json.data.available_copies,
      description: json.data.description || null,
      coverImage: json.data.cover_image || null,
    };
  
    return mappedResponse;
  };