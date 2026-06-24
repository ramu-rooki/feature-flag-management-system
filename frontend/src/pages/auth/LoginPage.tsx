import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Role } from '../../types';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.END_USER);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = role === Role.SUPER_ADMIN ? '/api/auth/super-admin/login' : '/api/auth/login';
      const response = await apiClient.post(endpoint, { email, password });
      
      if (response.data.success) {
        login(response.data);
        
        // Redirect based on actual user role returned
        const userRole = response.data.user.role;
        if (userRole === Role.SUPER_ADMIN) navigate('/super-admin');
        else if (userRole === Role.ORG_ADMIN) navigate('/admin');
        else navigate('/user');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Byepo Login</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <ErrorMessage message={error} />
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Select Login Type</label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={role !== Role.SUPER_ADMIN ? 'primary' : 'secondary'} 
                  className="w-full"
                  onClick={() => setRole(Role.END_USER)}
                >
                  Standard
                </Button>
                <Button 
                  type="button" 
                  variant={role === Role.SUPER_ADMIN ? 'primary' : 'secondary'} 
                  className="w-full"
                  onClick={() => setRole(Role.SUPER_ADMIN)}
                >
                  Super Admin
                </Button>
              </div>
            </div>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
