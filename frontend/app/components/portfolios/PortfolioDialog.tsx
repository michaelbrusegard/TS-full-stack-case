import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PortfolioDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  defaultValue?: string;
  onSubmit: (name: string) => Promise<void>;
  isLoading?: boolean;
  description: string;
};

function PortfolioDialog({
  open,
  onOpenChange,
  title,
  defaultValue = '',
  onSubmit,
  isLoading,
  description,
}: PortfolioDialogProps) {
  const [name, setName] = useState(defaultValue);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='space-y-2 py-4'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Portfolio name'
          />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(name)}
            disabled={isLoading ?? !name.trim()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { PortfolioDialog };
