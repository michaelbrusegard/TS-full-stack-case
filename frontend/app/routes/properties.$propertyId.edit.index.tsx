import { getPortfoliosQueryOptions } from '@/api/portfolios';
import { useCreatePropertyMutation } from '@/api/properties';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

import { PropertyForm } from '@/components/properties/PropertyForm';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/properties/$propertyId/edit/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getPortfoliosQueryOptions()),
  component: NewProperty,
});

function NewProperty() {
  const navigate = useNavigate();
  const portfoliosQuery = useQuery(getPortfoliosQueryOptions());
  const createPropertyMutation = useCreatePropertyMutation();

  function handleBack() {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      void navigate({ to: '/' });
    }
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleBack}
          className='shrink-0'
        >
          <ArrowLeftIcon className='h-4 w-4' />
        </Button>
        <h1 className='text-xl-3xl-clamp font-bold'>Update Property</h1>
      </div>

      <PropertyForm
        portfolios={portfoliosQuery.data ?? []}
        onSubmit={(values) => {
          createPropertyMutation.mutate(values, {
            onSuccess: () => {
              void navigate({ to: '/' });
            },
          });
        }}
      />
    </div>
  );
}
