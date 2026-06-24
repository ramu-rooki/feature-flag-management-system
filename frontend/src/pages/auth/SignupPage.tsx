import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { type Organization } from '../../types';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // For a real SaaS, signup might dynamically create the org, but based on Byepo Phase 3/4,
  // we need an organizationId to sign up a user. Since only SUPER_ADMIN can fetch all organizations,
  // we either fetch an unauthenticated list (if backend allows) or user types an ID.
  // Actually, wait: we can't fetch /api/organizations without SUPER_ADMIN token!
  // So we will just provide a text input for Organization ID for now, or assume the backend requires an existing ID.
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/api/auth/signup', { 
        name, 
        email, 
        password,
        organizationId
      });
      
      if (response.data.success) {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4 overflow-y-auto py-10">
      <Card className="w-full max-w-md my-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Sign up for your organization</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <ErrorMessage message={error} />
            
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <Input
              label="Organization ID"
              type="text"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
            />
            
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
