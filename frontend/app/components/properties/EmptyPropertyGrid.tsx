import { Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function EmptyPropertyGrid() {
  return (
    <div className='flex h-full w-full items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle>No Properties</CardTitle>
          <CardDescription>
            There are no properties in this portfolio yet.
          </CardDescription>
          <Button variant='secondary' className='mt-4' asChild>
            <Link to='/properties/new'>
              <PlusIcon className='mr-2 h-4 w-4' />
              Create Property
            </Link>
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}

export { EmptyPropertyGrid };
