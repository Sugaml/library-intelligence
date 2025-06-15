import { useState, useEffect } from 'react';
import { AuthUser, getAuthUser, clearAuthUser } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUser = getAuthUser();
    setUser(authUser);
    setLoading(false);
  }, []);

  const login = (user: AuthUser) => {
    setUser(user);
  };

  const logout = () => {
    clearAuthUser();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isLibrarian: user?.role === 'librarian',
  };
};
