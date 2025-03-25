import { portfoliosQueryOptions } from '@/api/portfolios';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import { UtilityHeader } from '@/components/UtilityHeader';
import { PortfolioSidebar } from '@/components/portfolios/PortfolioSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { portfolioActions } from '@/stores/portfolios';

export const Route = createFileRoute('/_sidebar')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(portfoliosQueryOptions),
  component: LayoutComponent,
});

function LayoutComponent() {
  const portfoliosQuery = useSuspenseQuery(portfoliosQueryOptions);

  useEffect(() => {
    portfolioActions.setPortfolios(portfoliosQuery.data);
  }, [portfoliosQuery.data]);

  return (
    <SidebarProvider>
      <UtilityHeader />
      <PortfolioSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
