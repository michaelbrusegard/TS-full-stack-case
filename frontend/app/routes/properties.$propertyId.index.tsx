import {
  getPropertyByIdQueryOptions,
  useDeletePropertyMutation,
} from '@/api/properties';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  MapPinIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';

import { BaseMap } from '@/components/custom-ui/base-map';
import { Spinner } from '@/components/custom-ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/properties/$propertyId/')({
  loader: ({ context: { queryClient }, params: { propertyId } }) => {
    return queryClient.ensureQueryData(
      getPropertyByIdQueryOptions(Number(propertyId)),
    );
  },
  component: PropertyDetailsPage,
});

function PropertyDetailsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { propertyId } = useParams({ from: '/properties/$propertyId/' });
  const { data: property } = useSuspenseQuery(
    getPropertyByIdQueryOptions(Number(propertyId)),
  );
  const deletePropertyMutation = useDeletePropertyMutation();

  if (!property?.properties) return null;

  const {
    name,
    address,
    zip_code,
    city,
    estimated_value = 0,
    relevant_risks = 0,
    handled_risks = 0,
    total_financial_risk = 0,
  } = property.properties;

  const coordinates = property.geometry?.coordinates;
  const riskRatio = handled_risks / relevant_risks;
  const riskColor =
    riskRatio === 1
      ? 'bg-primary text-primary-foreground'
      : riskRatio >= 0.5
        ? 'bg-accent text-accent-foreground'
        : 'bg-destructive text-destructive-foreground';

  function handleDelete() {
    deletePropertyMutation.mutate(Number(propertyId), {
      onSuccess: () => {
        void navigate({ to: '/' });
      },
    });
  }

  function handleBack() {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      void navigate({ to: '/' });
    }
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleBack}
            className='shrink-0'
          >
            <ArrowLeftIcon className='h-4 w-4' />
          </Button>
          <h1 className='text-xl-3xl-clamp truncate font-bold'>{name}</h1>
        </div>
        <div className='flex gap-2'>
          <Button asChild variant='default'>
            <Link
              to='/properties/$propertyId/edit'
              params={{ propertyId }}
              className='w-full sm:w-auto'
            >
              <span className='flex items-center gap-2'>
                <PencilIcon className='h-4 w-4' />
                <span className='sm:hidden lg:block'>Edit Property</span>
              </span>
            </Link>
          </Button>
          <Button
            variant='destructive'
            onClick={() => setDeleteDialogOpen(true)}
          >
            <span className='flex items-center gap-2'>
              <Trash2Icon className='h-4 w-4' />
              <span className='sm:hidden lg:block'>Delete Property</span>
            </span>
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDeleteDialogOpen(false);
                handleDelete();
              }}
            >
              {deletePropertyMutation.isPending ? (
                <Spinner size='sm' />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <h3 className='text-muted-foreground text-sm'>Location</h3>
              <p className='flex items-center gap-2'>
                <MapPinIcon className='h-4 w-4' />
                {address}, {zip_code} {city}
              </p>
            </div>

            <div className='space-y-2'>
              <h3 className='text-muted-foreground text-sm'>Estimated Value</h3>
              <p className='text-xl font-medium'>
                {new Intl.NumberFormat('no-NO', {
                  style: 'currency',
                  currency: 'NOK',
                  maximumFractionDigits: 0,
                }).format(estimated_value)}
              </p>
            </div>

            <div className='space-y-2'>
              <h3 className='text-muted-foreground text-sm'>Risk Assessment</h3>
              <div className='flex items-center gap-4'>
                <Badge className={riskColor}>
                  {handled_risks}/{relevant_risks} Risks Handled
                </Badge>
                <p className='text-xl font-medium'>
                  {new Intl.NumberFormat('no-NO', {
                    style: 'currency',
                    currency: 'NOK',
                    maximumFractionDigits: 0,
                  }).format(total_financial_risk)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='min-h-[400px] py-0'>
          <BaseMap
            style={{
              borderRadius: 'var(--radius-xl)',
            }}
            initialViewState={{
              longitude: coordinates?.[0] ?? 10.75,
              latitude: coordinates?.[1] ?? 59.91,
              zoom: 14,
            }}
          >
            {coordinates && (
              <Marker
                longitude={coordinates[0] ?? 0}
                latitude={coordinates[1] ?? 0}
              >
                <MapPinIcon className='text-primary h-8 w-8 -translate-y-full' />
              </Marker>
            )}
          </BaseMap>
        </Card>
      </div>
    </div>
  );
}
