import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import apiClient from '../../api/client';
import { type Organization } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Plus } from 'lucide-react';

export const OrganizationsPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await apiClient.get('/api/organizations');
        if (response.data.success) {
          setOrganizations(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load organizations.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground mt-1">Manage tenant organizations</p>
        </div>
        <Button onClick={() => navigate('/super-admin/organizations/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search organizations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {error && <div className="p-4"><ErrorMessage message={error} /></div>}

          {isLoading ? (
            <LoadingSpinner className="py-12" />
          ) : organizations.length === 0 ? (
            <EmptyState 
              icon={<Building2 className="h-12 w-12" />}
              title="No organizations found"
              description="You have not created any organizations yet."
              action={
                <Button onClick={() => navigate('/super-admin/organizations/create')}>Create your first organization</Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{org.id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrgs.length === 0 && organizations.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No results matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
