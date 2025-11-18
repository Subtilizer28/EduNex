import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="mt-4 text-4xl font-bold">403 - Unauthorized</h1>
        <p className="mt-2 text-xl text-muted-foreground">
          You don't have permission to access this page
        </p>
        <Button onClick={() => navigate(-1)} className="mt-6">
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
