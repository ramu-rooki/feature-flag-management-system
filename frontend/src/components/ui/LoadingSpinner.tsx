export const LoadingSpinner = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>
  );
};

export const FullPageLoading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <LoadingSpinner className="h-12 w-12" />
  </div>
);
