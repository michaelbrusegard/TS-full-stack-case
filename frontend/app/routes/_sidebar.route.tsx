import { getPortfoliosQueryOptions } from '@/api/portfolios';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { Spinner } from '@/components/custom-ui/spinner';
import { UtilityHeader } from '@/components/layout/UtilityHeader';
import { PortfolioSidebar } from '@/components/portfolios/PortfolioSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const Route = createFileRoute('/_sidebar')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getPortfoliosQueryOptions()),
  component: SidebarLayout,
});

function SidebarLayout() {
  return (
    <SidebarProvider>
      <UtilityHeader />
      <PortfolioSidebar />
      <SidebarInset>
        <Suspense
          fallback={
            <div className='flex h-full w-full items-center justify-center'>
              <Spinner />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
