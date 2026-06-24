import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import apiClient from '../../api/client';
import { Building2 } from 'lucide-react';

export const CreateOrganizationPage = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/api/organizations', { name });
      if (response.data.success) {
        navigate('/super-admin/organizations');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create organization.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/super-admin/organizations')}>
          ← Back
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Create Organization
          </CardTitle>
          <p className="text-sm text-muted-foreground">Register a new tenant organization in the platform.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorMessage message={error} />
            
            <Input
              label="Organization Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Acme Corp"
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => navigate('/super-admin/organizations')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Create Organization
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
