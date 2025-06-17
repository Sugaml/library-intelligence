import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { login, saveAuthUser, saveAuthToken,saveStudentID } from "@/lib/auth";
import { useLocation } from "wouter";
import { Building2 } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login: setAuthUser } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({ username, password });
      saveAuthUser(response.user);
      saveAuthToken(response.accessToken);
      setAuthUser(response.user);
      saveStudentID(response.user?.id);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.fullName}!`,
      });

      // Redirect based on role
      if (response.user.role === 'student') {
        setLocation('/student-dashboard');
      } else if (response.user.role === 'librarian') {
        setLocation('/librarian-dashboard');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'student' | 'librarian') => {
    const demoCredentials = {
      student: { username: 'john.doe', password: 'student123' },
      librarian: { username: 'admin', password: 'admin123' }
    };

    setUsername(demoCredentials[role].username);
    setPassword(demoCredentials[role].password);
    
    // Auto-submit after a brief delay
    setTimeout(() => {
      handleLogin({ preventDefault: () => {} } as React.FormEvent);
    }, 100);
  };

  return (
    <div className="min-h-screen tu-gradient flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="tu-bg-blue text-white p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <Building2 className="tu-text-blue text-3xl" />
          </div>
          <h1 className="text-2xl font-bold mb-2">SOMTU Library System</h1>
          <p className="text-blue-100">Tribhuvan University</p>
        </div>
        
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </Label>
              <Input 
                id="username"
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Enter your student/staff ID"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <Button variant="link" className="text-sm tu-text-blue hover:underline p-0">
                Forgot password?
              </Button>
            </div>
            
            <div className="space-y-3">
              <Button 
                type="submit"
                disabled={loading}
                className="w-full tu-bg-blue text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
