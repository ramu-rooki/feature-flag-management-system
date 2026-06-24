import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import apiClient from '../../api/client';
import { useNavigate } from 'react-router-dom';
import { Flag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { type FeatureFlag } from '../../types';

export const AdminDashboard = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await apiClient.get('/api/feature-flags');
        if (response.data.success) {
          setFlags(response.data.data || []);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load feature flags.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlags();
  }, []);

  const enabledCount = flags.filter(f => f.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Organization Dashboard</h1>
        <Button onClick={() => navigate('/admin/flags')}>
          Manage Flags
        </Button>
      </div>
      
      <ErrorMessage message={error} />
      
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feature Flags</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flags.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Configured for your organization</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enabled Flags</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enabledCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="secondary" className="w-full justify-between" onClick={() => navigate('/admin/check')}>
                Test Feature Flags <ArrowRight className="h-4 w-4"/>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
