export interface LibraryDashboardStats {
    activeStudents: number;
    availableBooks: number;
    borrowedBooks: number;
    overdueBooks: number;
    pendingRequests: number;
    totalBooks: number;
    totalFines: number;
    totalStudents: number;
  }

export const fetchLibraryDashboardStats = async function fetchBorrowedBookStats(token: string): Promise<LibraryDashboardStats | null> {
    try {
      const response = await fetch('http://localhost:8080/api/v1/lms/reports/dashboard-stats', {
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
        return json.data as LibraryDashboardStats;
      } else {
        console.error('API error or no data:', json.message);
        return null;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  }
  