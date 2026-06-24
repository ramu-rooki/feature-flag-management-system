import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import apiClient from '../../api/client';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';

export const SuperAdminDashboard = () => {
  const [orgCount, setOrgCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrgCount = async () => {
      try {
        const response = await apiClient.get('/api/organizations');
        if (response.data.success) {
          setOrgCount(response.data.count || 0);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load organization data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgCount();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <Button onClick={() => navigate('/super-admin/organizations/create')}>
          <Building2 className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
      </div>
      
      <ErrorMessage message={error} />
      
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orgCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Managed tenants</p>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="secondary" className="w-full justify-between" onClick={() => navigate('/super-admin/organizations')}>
                View Organizations <ArrowRight className="h-4 w-4"/>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
