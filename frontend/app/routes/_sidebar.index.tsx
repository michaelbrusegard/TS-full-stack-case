import { getPropertiesByBboxQueryOptions } from '@/api/properties';
import type { components } from '@/api/schema';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { MapPinIcon, PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Marker, type ViewStateChangeEvent } from 'react-map-gl/maplibre';

import { BaseMap } from '@/components/custom-ui/base-map';
import { Button } from '@/components/ui/button';

import { useDebounce } from '@/hooks/use-debounce';

type Property = components['schemas']['Property'];

const OSLO_BBOX: [number, number, number, number] = [
  10.65, 59.85, 10.85, 59.95,
];

export const Route = createFileRoute('/_sidebar/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(
      getPropertiesByBboxQueryOptions(OSLO_BBOX),
    );
  },
  component: HomePage,
});

function HomePage() {
  const [bbox, setBbox] = useState<[number, number, number, number]>(OSLO_BBOX);
  const debouncedBbox = useDebounce(bbox, 500);

  const { data } = useQuery({
    ...getPropertiesByBboxQueryOptions(debouncedBbox),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  const properties =
    (data?.features as components['schemas']['Property'][]) || [];

  const onMoveEnd = useCallback((evt: ViewStateChangeEvent) => {
    const bounds = evt.target.getBounds();
    const newBbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];
    setBbox(newBbox);
  }, []);

  return (
    <BaseMap
      initialViewState={{
        longitude: 10.75,
        latitude: 59.91,
        zoom: 8,
      }}
      onMoveEnd={onMoveEnd}
    >
      {properties.map((feature: Property) => (
        <Marker
          key={feature.id}
          longitude={feature.geometry?.coordinates?.[0] ?? 0}
          latitude={feature.geometry?.coordinates?.[1] ?? 0}
        >
          <Link
            to='/properties/$propertyId'
            params={{ propertyId: String(feature.id) }}
            className='block'
          >
            <MapPinIcon
              className='text-primary hover:text-primary/80 h-6 w-6 -translate-y-full cursor-pointer transition-colors'
              strokeWidth={2.5}
            />
          </Link>
        </Marker>
      ))}
      <div className='absolute bottom-4 left-4 z-10'>
        <Button size='icon' asChild>
          <Link to='/properties/new' className='block'>
            <PlusIcon className='h-6 w-6' />
            <span className='sr-only'>Add new property</span>
          </Link>
        </Button>
      </div>
    </BaseMap>
  );
}
