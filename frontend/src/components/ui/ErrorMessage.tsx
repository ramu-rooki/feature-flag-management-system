import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  
  return (
    <div className="rounded-md bg-destructive/10 p-4 mb-4 flex items-start text-destructive">
      <AlertCircle className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
      <div className="text-sm font-medium">{message}</div>
    </div>
  );
};
