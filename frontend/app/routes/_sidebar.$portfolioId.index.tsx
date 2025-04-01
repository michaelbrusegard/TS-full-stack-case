import { getPortfoliosQueryOptions } from '@/api/portfolios';
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
  loader: async ({ context: { queryClient }, params: { portfolioId } }) => {
    const propertiesPromise = queryClient.ensureQueryData(
      getPropertiesByPortfolioQueryOptions(Number(portfolioId), 1, PAGE_SIZE),
    );
    const portfoliosPromise = queryClient.ensureQueryData(
      getPortfoliosQueryOptions(),
    );

    const [propertiesData, portfoliosData] = await Promise.all([
      propertiesPromise,
      portfoliosPromise,
    ]);

    return { propertiesData, portfoliosData };
  },
  component: PortfolioPage,
});

function PortfolioPage() {
  const { portfolioId } = useParams({ from: '/_sidebar/$portfolioId/' });
  const loaderData = Route.useLoaderData();
  const [currentPage, setCurrentPage] = useState(1);
  const portfolios = loaderData.portfoliosData;

  const { data: propertiesData } = useSuspenseQuery({
    ...getPropertiesByPortfolioQueryOptions(
      Number(portfolioId),
      currentPage,
      PAGE_SIZE,
    ),
    initialData: currentPage === 1 ? loaderData.propertiesData : undefined,
  });

  const totalPages = Math.ceil(propertiesData.count / PAGE_SIZE);
  const properties =
    (propertiesData.features as components['schemas']['Property'][]) || [];

  return (
    <div className='flex h-full w-full flex-col space-y-4 p-4'>
      <div className='flex items-center justify-center'>
        <h1 className='text-2xl font-bold'>
          {portfolios.find((p) => p.id === Number(portfolioId))?.name ??
            'Properties'}
        </h1>
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
