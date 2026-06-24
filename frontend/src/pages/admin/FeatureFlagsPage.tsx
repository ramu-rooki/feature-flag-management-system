import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import apiClient from '../../api/client';
import { type FeatureFlag } from '../../types';
import { Flag, Search, Plus, Trash2, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';

export const FeatureFlagsPage = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentFlag, setCurrentFlag] = useState<FeatureFlag | null>(null);

  // Form States
  const [featureKey, setFeatureKey] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFlags = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/api/feature-flags');
      if (response.data.success) {
        setFlags(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load feature flags.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/feature-flags', { featureKey, enabled });
      setIsCreateOpen(false);
      setFeatureKey('');
      setEnabled(false);
      fetchFlags();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create feature flag.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFlag) return;
    setFormError('');
    setIsSubmitting(true);
    try {
      await apiClient.put(`/api/feature-flags/${currentFlag.id}`, { featureKey, enabled });
      setIsEditOpen(false);
      setCurrentFlag(null);
      fetchFlags();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to update feature flag.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    try {
      // Optimistic update
      setFlags(flags.map(f => f.id === id ? { ...f, enabled: !currentEnabled } : f));
      await apiClient.patch(`/api/feature-flags/${id}/toggle`, { enabled: !currentEnabled });
    } catch (err: any) {
      // Revert on failure
      fetchFlags();
      setError(err.response?.data?.message || 'Failed to toggle flag.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature flag?')) return;
    try {
      await apiClient.delete(`/api/feature-flags/${id}`);
      setFlags(flags.filter(f => f.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete feature flag.');
    }
  };

  const openEditModal = (flag: FeatureFlag) => {
    setCurrentFlag(flag);
    setFeatureKey(flag.featureKey);
    setEnabled(flag.enabled);
    setFormError('');
    setIsEditOpen(true);
  };

  const openCreateModal = () => {
    setFeatureKey('');
    setEnabled(false);
    setFormError('');
    setIsCreateOpen(true);
  };

  const filteredFlags = flags.filter(flag => 
    flag.featureKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feature Flags</h1>
          <p className="text-muted-foreground mt-1">Manage configuration for your organization</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Flag
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search feature keys..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {error && <div className="p-4 pb-0"><ErrorMessage message={error} /></div>}

          {isLoading ? (
            <LoadingSpinner className="py-12" />
          ) : flags.length === 0 ? (
            <EmptyState 
              icon={<Flag className="h-12 w-12" />}
              title="No feature flags found"
              description="Create a feature flag to control functionality in your applications."
              action={<Button onClick={openCreateModal}>Create your first flag</Button>}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlags.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell className="font-medium font-mono text-sm">{flag.featureKey}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        flag.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleToggle(flag.id, flag.enabled)}
                          title="Toggle Status"
                        >
                          {flag.enabled ? <ToggleRight className="h-5 w-5 text-green-600"/> : <ToggleLeft className="h-5 w-5 text-gray-400"/>}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditModal(flag)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete(flag.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Feature Flag">
        <form onSubmit={handleCreate} className="space-y-4">
          <ErrorMessage message={formError} />
          <Input
            label="Feature Key"
            value={featureKey}
            onChange={(e) => setFeatureKey(e.target.value)}
            placeholder="e.g. new_dashboard"
            required
          />
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <input 
              type="checkbox" 
              id="create-enabled" 
              checked={enabled} 
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="create-enabled" className="text-sm font-medium leading-none cursor-pointer">
              Enabled by default
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Feature Flag">
        <form onSubmit={handleEdit} className="space-y-4">
          <ErrorMessage message={formError} />
          <Input
            label="Feature Key"
            value={featureKey}
            onChange={(e) => setFeatureKey(e.target.value)}
            required
          />
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <input 
              type="checkbox" 
              id="edit-enabled" 
              checked={enabled} 
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="edit-enabled" className="text-sm font-medium leading-none cursor-pointer">
              Enabled
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
