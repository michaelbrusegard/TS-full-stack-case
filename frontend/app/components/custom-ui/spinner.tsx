import { type VariantProps, cva } from 'class-variance-authority';
import { Loader2Icon, type LucideProps } from 'lucide-react';

const spinnerVariants = cva('text-muted-foreground animate-spin', {
  variants: {
    size: {
      default: 'h-6 w-6',
      sm: 'h-4 w-4',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10',
      none: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

function Spinner({
  className,
  size,
  ...props
}: LucideProps & VariantProps<typeof spinnerVariants>) {
  return (
    <Loader2Icon className={spinnerVariants({ size, className })} {...props} />
  );
}

export { Spinner };
