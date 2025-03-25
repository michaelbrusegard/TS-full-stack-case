import { Link, useParams } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { PlusIcon } from 'lucide-react';

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

import { portfoliosStore } from '@/stores/portfolios';

function PortfolioSidebar() {
  const portfolios = useStore(portfoliosStore, (state) => state.portfolios);
  const looseParams = useParams({ strict: false });

  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <ScrollArea className='pr-1'>
          <SidebarGroup>
            <SidebarGroupLabel>Portfolios</SidebarGroupLabel>
            <SidebarGroupAction
              title='New Portfolio'
              aria-label='New Portfolio'
            >
              <PlusIcon aria-hidden='true' />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {portfolios.length === 0
                  ? Array.from(
                      { length: 8 },
                      (_, __) => `skeleton-item-${crypto.randomUUID()}`,
                    ).map((id) => (
                      <SidebarMenuItem key={id}>
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
                      </SidebarMenuItem>
                    ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export { PortfolioSidebar };
