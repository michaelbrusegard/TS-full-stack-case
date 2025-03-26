import { getPortfoliosQueryOptions } from '@/api/portfolios';
import {
  getPropertyByIdQueryOptions,
  useUpdatePropertyMutation,
} from '@/api/properties';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  notFound,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

import { PropertyForm } from '@/components/properties/PropertyForm';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/properties/$propertyId/edit/')({
  loader: ({ context: { queryClient }, params: { propertyId } }) =>
    Promise.all([
      queryClient.ensureQueryData(getPortfoliosQueryOptions()),
      queryClient.ensureQueryData(
        getPropertyByIdQueryOptions(Number(propertyId)),
      ),
    ]),
  component: UpdatePropertyPage,
});

function UpdatePropertyPage() {
  const navigate = useNavigate();
  const portfoliosQuery = useSuspenseQuery(getPortfoliosQueryOptions());
  const { propertyId } = useParams({ from: '/properties/$propertyId/edit/' });
  const propertyQuery = useSuspenseQuery(
    getPropertyByIdQueryOptions(Number(propertyId)),
  );
  const updatePropertyMutation = useUpdatePropertyMutation();

  if (!propertyQuery.data?.properties) return notFound();

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => void navigate({ to: '/' })}
          className='shrink-0'
        >
          <ArrowLeftIcon className='h-4 w-4' />
        </Button>
        <h1 className='text-xl-3xl-clamp font-bold'>Edit Property</h1>
      </div>

      <PropertyForm
        portfolios={portfoliosQuery.data}
        property={propertyQuery.data}
        onSubmit={(values) => {
          const id = propertyQuery.data.id!;

          const mutationData = {
            id,
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [
                values.coordinates.longitude,
                values.coordinates.latitude,
              ],
            },
            properties: {
              name: values.name,
              portfolio: Number(values.portfolioId),
              address: values.address,
              zip_code: values.zipCode,
              city: values.city,
              estimated_value: values.estimatedValue,
              relevant_risks: values.relevantRisks,
              handled_risks: values.handledRisks,
              total_financial_risk: values.financialRisk,
            },
          };

          updatePropertyMutation.mutate(mutationData, {
            onError: (error) => {
              throw error;
            },
            onSuccess: (data) => {
              void navigate({
                to: '/properties/$propertyId',
                params: { propertyId: String(data?.id) },
              });
            },
          });
        }}
      />
    </div>
  );
}
