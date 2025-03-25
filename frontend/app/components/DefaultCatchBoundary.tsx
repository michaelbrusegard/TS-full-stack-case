import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { AlertTriangle, ArrowLeft, Home, RotateCcw } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error(error);

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              An unexpected error occurred while processing your request.
            </AlertDescription>
          </Alert>
        </CardHeader>

        <CardContent>
          <div className='bg-muted max-h-48 overflow-auto rounded-md p-4'>
            <pre className='text-muted-foreground text-sm'>
              <ErrorComponent error={error} />
            </pre>
          </div>
        </CardContent>

        <CardFooter className='flex justify-end gap-2'>
          <Button
            variant='outline'
            onClick={() => router.invalidate()}
            size='sm'
          >
            <RotateCcw className='mr-2 h-4 w-4' />
            Try Again
          </Button>

          {isRoot ? (
            <Button asChild size='sm'>
              <Link to='/'>
                <Home className='mr-2 h-4 w-4' />
                Home
              </Link>
            </Button>
          ) : (
            <Button
              variant='secondary'
              onClick={() => window.history.back()}
              size='sm'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Go Back
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export { DefaultCatchBoundary };
