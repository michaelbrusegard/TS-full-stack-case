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
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    const trimmedValue = value.trim();
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setName(capitalizedValue);

    if (trimmedValue.length === 0) {
      setError('Name is required');
    } else if (trimmedValue.length > 100) {
      setError('Name must be less than 100 characters');
    } else {
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Label htmlFor='name'>Name</Label>
          <Input
            className='mt-2'
            id='name'
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder='Portfolio name'
          />
          {error && (
            <p className='text-destructive absolute translate-y-1 text-xs'>
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(name)}
            disabled={(isLoading ?? false) || !name.trim() || !!error}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { PortfolioDialog };
