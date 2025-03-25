import {
  useCreatePortfolioMutation,
  useDeletePortfolioMutation,
  useUpdatePortfolioMutation,
} from '@/api/portfolios';
import { Link, useParams } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { PortfolioDialog } from '@/components/portfolios/PortfolioDialog';
import { PortfolioOptionsDropdown } from '@/components/portfolios/PortfolioOptionsDropdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
} from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';

import { portfolioActions, portfoliosStore } from '@/stores/portfolios';

function PortfolioSidebar() {
  const portfolios = useStore(portfoliosStore, (state) => state.portfolios);
  const looseParams = useParams({ strict: false });
  const [newPortfolioOpen, setNewPortfolioOpen] = useState(false);

  const createPortfolioMutation = useCreatePortfolioMutation();
  const updatePortfolioMutation = useUpdatePortfolioMutation();
  const deletePortfolioMutation = useDeletePortfolioMutation();

  async function handleCreatePortfolio(name: string) {
    setNewPortfolioOpen(false);
    createPortfolioMutation.mutate(
      { name },
      {
        onSuccess: (newPortfolio) => {
          portfolioActions.addPortfolio(newPortfolio);
        },
      },
    );
  }

  function handleRenamePortfolio(id: number, name: string) {
    const originalPortfolio = portfolios.find((p) => p.id === id);
    if (!originalPortfolio) return;

    portfolioActions.updatePortfolio({
      ...originalPortfolio,
      name,
    });

    updatePortfolioMutation.mutate(
      { id, name },
      {
        onSuccess: (updatedPortfolio) => {
          portfolioActions.updatePortfolio(updatedPortfolio);
        },
        onError: () => {
          portfolioActions.updatePortfolio(originalPortfolio);
        },
      },
    );
  }

  function handleDeletePortfolio(id: number) {
    const originalPortfolio = portfolios.find((p) => p.id === id);
    if (!originalPortfolio) return;

    portfolioActions.deletePortfolio(id);

    deletePortfolioMutation.mutate(id, {
      onError: () => {
        portfolioActions.addPortfolio(originalPortfolio);
      },
    });
  }

  return (
    <Sidebar>
      <SidebarHeader className='mt-2 flex flex-row items-center gap-3 px-4 py-2'>
        <img src='/logo.png' alt='Telescope Logo' className='h-8 w-8' />
        <span className='text-xl font-semibold'>Telescope</span>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className='pr-1'>
          <SidebarGroup>
            <SidebarGroupLabel>Portfolios</SidebarGroupLabel>
            <SidebarGroupAction
              title='New Portfolio'
              aria-label='New Portfolio'
              onClick={() => setNewPortfolioOpen(true)}
            >
              <PlusIcon aria-hidden='true' />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {portfolios.length === 0
                  ? Array.from({ length: 8 }, (_, index) => (
                      <SidebarMenuItem key={`skeleton-item-${index + 1}`}>
                        <SidebarMenuSkeleton />
                      </SidebarMenuItem>
                    ))
                  : portfolios.map((portfolio) => (
                      <SidebarMenuItem key={portfolio.id}>
                        <SidebarMenuButton asChild className='cursor-pointer'>
                          <Link
                            to='/$portfolioId'
                            params={{ portfolioId: String(portfolio.id) }}
                            className={cn(
                              'ring-offset-background focus-visible:ring-ring mr-5 w-full truncate rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                              looseParams.portfolioId ===
                                String(portfolio.id) && 'font-bold',
                            )}
                          >
                            {portfolio.name}
                          </Link>
                        </SidebarMenuButton>
                        <PortfolioOptionsDropdown
                          portfolio={portfolio}
                          onRename={handleRenamePortfolio}
                          onDelete={handleDeletePortfolio}
                        />
                      </SidebarMenuItem>
                    ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
      <PortfolioDialog
        open={newPortfolioOpen}
        onOpenChange={setNewPortfolioOpen}
        title='Create Portfolio'
        description='Create a new portfolio to group your properties.'
        isLoading={createPortfolioMutation.isPending}
        onSubmit={handleCreatePortfolio}
      />
    </Sidebar>
  );
}

export { PortfolioSidebar };
