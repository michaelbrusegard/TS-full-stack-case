import { ThemeToggle } from '@/components/ThemeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

function UtilityHeader() {
  return (
    <header className='fixed top-0 right-0 left-0 z-20 flex justify-between p-2'>
      <div className='hover:bg-accent/50 flex items-center rounded-lg p-2 transition-colors'>
        <SidebarTrigger className='text-foreground/60 hover:text-foreground transition-colors' />
      </div>
      <div className='hover:bg-accent/50 flex items-center rounded-lg p-2 transition-colors'>
        <ThemeToggle className='text-foreground/60 hover:text-foreground transition-colors' />
      </div>
    </header>
  );
}

export { UtilityHeader };
