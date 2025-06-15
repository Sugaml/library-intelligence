
export interface BorrowedBook {
    id: string;
    created_at: string;
    user_id: string;
    book_id: string;
    librarian_id: string;
    borrowed_date: string;
    due_date: string;
    returned_date: string | null;
    renewal_count: number;
    status: 'pending' | 'borrowed' | 'returned' | 'overdue' | string;
    remarks: string;
    student: {
      full_name: string;
      program: string;
      student_id: string;
    };
    book: {
      title: string;
      author: string;
      cover_image: string;
    };
  }

  export interface BorrowedBookQueryParams {
    search?: string;
    program?: string;
    status?: string;
  }

  export const fetchBorrows = async (
      params: BorrowedBookQueryParams,
      token: string
    ): Promise<BorrowedBook[]> => {
      const url = new URL("http://localhost:8080/api/v1/lms/borrows");
    
      if (params.search) url.searchParams.append("search", params.search);
      if (params.program) url.searchParams.append("program", params.program);
      if (params.status) url.searchParams.append("status", params.status);
    
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    
      if (!response.ok) {
        throw new Error("Failed to fetch borrows");
      }
    
      const json = await response.json();
    
      return json.data.map((item: any): BorrowedBook => ({
        id: item.id,
        created_at: item.created_at,
        user_id: item.user_id,
        book_id: item.book_id,
        librarian_id: item.librarian_id,
        borrowed_date: item.borrowed_date,
        due_date: item.due_date,
        returned_date: item.returned_date,
        renewal_count: item.renewal_count,
        status: item.status,
        remarks: item.remarks,
        student: {
          full_name: item.student.full_name,
          program: item.student.program,
          student_id: item.student.student_id,
        },
        book: {
          title: item.book.title,
          author: item.book.author,
          cover_image: item.book.cover_image,
        },
      }));
    };
    

    export interface BorrowedBookStats{
        totalBorrowedBooks: number,
        totalOverdueBooks: number,
        pendingRequests: number,
        dueSoon: number
    }

    export const fetchBorrowedBookStats = async function fetchBorrowedBookStats(token: string): Promise<BorrowedBookStats | null> {
        try {
          const response = await fetch('http://localhost:8080/api/v1/lms/reports/borrowedbookstats', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const json = await response.json();
      
          if (json.error === 0 && json.data) {
            return json.data as BorrowedBookStats;
          } else {
            console.error('API error or no data:', json.message);
            return null;
          }
        } catch (error) {
          console.error('Fetch error:', error);
          return null;
        }
      }
      