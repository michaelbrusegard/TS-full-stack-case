import { getPropertiesByPortfolioQueryOptions } from '@/api/properties';
import type { components } from '@/api/schema';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { EmptyPropertyGrid } from '@/components/properties/EmptyPropertyGrid';
import { PropertyGrid } from '@/components/properties/PropertyGrid';
import { PropertyPagination } from '@/components/properties/PropertyPagination';

const PAGE_SIZE = 12;

export const Route = createFileRoute('/_sidebar/$portfolioId/')({
  loader: ({ context: { queryClient }, params: { portfolioId } }) => {
    return queryClient.ensureQueryData(
      getPropertiesByPortfolioQueryOptions(Number(portfolioId), 1, PAGE_SIZE),
    );
  },
  component: PropertyPage,
});

function PropertyPage() {
  const { portfolioId } = useParams({ from: '/_sidebar/$portfolioId/' });
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useSuspenseQuery({
    ...getPropertiesByPortfolioQueryOptions(
      Number(portfolioId),
      currentPage,
      PAGE_SIZE,
    ),
  });

  const totalPages = Math.ceil(data.count / PAGE_SIZE);
  const properties =
    (data.features as components['schemas']['Property'][]) || [];

  return (
    <div className='flex h-full w-full flex-col space-y-4 p-4'>
      <div className='flex items-center justify-center'>
        <h1 className='text-2xl font-bold'>Properties</h1>
      </div>

      {properties.length === 0 ? (
        <EmptyPropertyGrid />
      ) : (
        <>
          <PropertyGrid properties={properties} />
          {totalPages > 1 && (
            <div className='flex justify-center'>
              <PropertyPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
