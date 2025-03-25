import { Slot } from '@radix-ui/react-slot';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import type { VariantProps } from 'class-variance-authority';
import { useId } from 'react';

import { Spinner } from '@/components/custom-ui/spinner';
import { Button, type buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { cn } from '@/lib/utils';

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

type BaseFieldProps = {
  className?: string;
  label: string;
  children: React.ReactNode;
};

function BaseField({ className, label, children }: BaseFieldProps) {
  const form = useFormContext();
  const field = useFieldContext();
  const id = useId();

  return (
    <div className={cn('realtive space-y-2', className)}>
      <Label
        className={cn(
          form.state.isSubmitted &&
            field.state.meta.errors.length > 0 &&
            'text-destructive',
        )}
        htmlFor={`${id}-form-item`}
      >
        {label}
      </Label>
      <Slot
        id={`${id}-form-item`}
        aria-describedby={
          !(field.state.meta.errors.length > 0)
            ? `${id}-form-item-description`
            : `${id}-form-item-description ${id}-form-item-message`
        }
        aria-invalid={
          !!(form.state.isSubmitted && field.state.meta.errors.length > 0)
        }
      >
        {children}
      </Slot>
      <p
        id={`${id}-form-item-description`}
        className={cn('text-muted-foreground text-sm', className)}
      />
      <p
        id={`${id}-form-item-message`}
        className={cn(
          'text-destructive absolute -translate-y-2 text-[0.8rem] font-medium',
          className,
        )}
      >
        {form.state.isSubmitted &&
          field.state.meta.errors.length > 0 &&
          String(field.state.meta.errors[0]).split(', ')[0]}
      </p>
    </div>
  );
}

type TextFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'value' | 'onChange' | 'onBlur'
> & {
  label: string;
};

function TextField({ className, label, ...props }: TextFieldProps) {
  const field = useFieldContext<string>();

  return (
    <BaseField label={label} className={className}>
      <Input
        type='text'
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      />
    </BaseField>
  );
}

type NumberFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'value' | 'onChange' | 'onBlur'
> & {
  label: string;
};

function NumberField({ className, label, ...props }: NumberFieldProps) {
  const field = useFieldContext<number>();

  return (
    <BaseField label={label} className={className}>
      <Input
        type='number'
        value={field.state.value}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        onBlur={field.handleBlur}
        {...props}
      />
    </BaseField>
  );
}

type TextAreaFieldProps = Omit<
  React.ComponentProps<typeof Textarea>,
  'value' | 'onChange' | 'onBlur'
> & {
  label: string;
};

function TextAreaField({ className, label, ...props }: TextAreaFieldProps) {
  const field = useFieldContext<string>();

  return (
    <BaseField label={label} className={className}>
      <Textarea
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      />
    </BaseField>
  );
}

type SubmitButtonProps = Omit<React.ComponentProps<typeof Button>, 'type'> &
  VariantProps<typeof buttonVariants>;

function SubmitButton({ children, className, ...props }: SubmitButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => [
        state.isSubmitting,
        state.isPristine,
        state.isValidating,
      ]}
    >
      {([isSubmitting, isPristine, isValidating]) => (
        <Button
          className={cn('min-w-28', className)}
          type='submit'
          disabled={isSubmitting ?? isPristine ?? isValidating}
          {...props}
        >
          {(isSubmitting ?? isValidating) ? <Spinner size='sm' /> : children}
        </Button>
      )}
    </form.Subscribe>
  );
}

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    TextAreaField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

export { useAppForm };
