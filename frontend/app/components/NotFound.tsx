import { Link } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-6'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Page Not Found</AlertTitle>
          <AlertDescription>
            {children ??
              "The page you are looking for doesn't exist or has been moved."}
          </AlertDescription>
        </Alert>
        <div className='flex justify-center gap-4'>
          <Button
            variant='outline'
            onClick={() => window.history.back()}
            type='button'
          >
            Go Back
          </Button>
          <Button asChild>
            <Link to='/'>Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { NotFound };
