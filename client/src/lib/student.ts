import { Book } from "@shared/schema";

export interface BookQueryParams {
    search?: string;
    program?: string;
    category?: string;
  }

  export interface Student {
    id: number;
    name: string;
    studentId: string;
    email: string;
    program: string;
    borrowedCount: number;
    overdueCount: number;
    fines: number;
    status: 'active' | 'inactive' | 'overdue'; // Adjust values if more exist
    profileImage: string;
  }

export const fetchStudents = async (
    params: BookQueryParams,
    token: string
  ): Promise<Student[]> => {
    const url = new URL("http://localhost:8080/api/v1/lms/students");
  
    if (params.search) url.searchParams.append("search", params.search);
    if (params.program) url.searchParams.append("program", params.program);
  
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
    console.log("student",json.data);
    return json.data.map((item: any): Student => ({
        id: item.id,
        name: item.full_name,
        email: item.email,
        studentId: item.student_id,
        program: item.program,
        borrowedCount: item.borrowed_count,
        overdueCount: item.overdue_count,
        fines: item.fines,
        status: item.status,
        profileImage: item.profile_image
    }));
  };
  