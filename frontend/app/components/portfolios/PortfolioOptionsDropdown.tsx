import { EllipsisIcon, PenIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

import { PortfolioDialog } from '@/components/portfolios/PortfolioDialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuAction } from '@/components/ui/sidebar';

type PortfolioOptionsDropdownProps = {
  portfolio: {
    id: number;
    name: string;
  };
  onRename: (id: number, name: string) => void;
  onDelete: (id: number) => void;
};

function PortfolioOptionsDropdown({
  portfolio,
  onRename,
  onDelete,
}: PortfolioOptionsDropdownProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction title='Portfolio options'>
            <EllipsisIcon className='h-4 w-4' />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setRenameOpen(true)}>
            <PenIcon className='mr-2 h-4 w-4' />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className='text-destructive'
          >
            <TrashIcon className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PortfolioDialog
        open={renameOpen}
        description='Rename portfolio to something more descriptive.'
        onOpenChange={setRenameOpen}
        title='Rename Portfolio'
        defaultValue={portfolio.name}
        onSubmit={async (name: string) => {
          setRenameOpen(false);
          onRename(portfolio.id, name);
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{portfolio.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setDeleteOpen(false);
                onDelete(portfolio.id);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { PortfolioOptionsDropdown };
