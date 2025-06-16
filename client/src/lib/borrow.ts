type BorrowedBook = {
    id: string;
    borrowed_date: string;
    due_date: string;
    returned_date: string | null;
    status: string;
    remarks: string;
    book: {
      title: string;
      author: string;
      cover_image?: string;
    };
  };
  
  export const fetchBorrowedBooks = async function fetchBorrowedBooks(studentId: string, token: string): Promise<BorrowedBook[]> {
    const res = await fetch(
      `http://localhost:8080/api/v1/lms/students/${studentId}/borrows`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch borrowed books");
    const json = await res.json();
    return json.data;
  }