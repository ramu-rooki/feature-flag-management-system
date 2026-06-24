import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import apiClient from '../../api/client';
import { CheckCircle2, XCircle } from 'lucide-react';

export const FeatureCheckPage = () => {
  const [featureKey, setFeatureKey] = useState('');
  const [result, setResult] = useState<{ key: string; enabled: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureKey.trim()) return;
    
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await apiClient.post('/api/feature-check', { featureKey });
      if (response.data.success) {
        setResult({
          key: response.data.featureKey,
          enabled: response.data.enabled
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check feature flag.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight text-center sm:text-left">Feature Flag Check</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Verify Feature State</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter a feature key to see if it is enabled for your organization.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <Input
                label="Feature Key"
                value={featureKey}
                onChange={(e) => setFeatureKey(e.target.value)}
                placeholder="e.g. new_dashboard"
                required
              />
            </div>
            <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
              Check Feature
            </Button>
          </form>

          {error && <div className="mt-6"><ErrorMessage message={error} /></div>}

          {result && (
            <div className={`mt-8 p-6 rounded-xl border ${result.enabled ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900' : 'bg-gray-50/50 border-gray-200 dark:bg-gray-900/10 dark:border-gray-800'}`}>
              <div className="flex items-center justify-center flex-col text-center space-y-4">
                {result.enabled ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-gray-400" />
                )}
                
                <div>
                  <h3 className="text-lg font-semibold">
                    Feature <code className="bg-background px-1.5 py-0.5 rounded border">{result.key}</code> is
                  </h3>
                  <div className={`text-3xl font-bold mt-2 ${result.enabled ? 'text-green-600 dark:text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
                    {result.enabled ? 'ENABLED' : 'DISABLED'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
