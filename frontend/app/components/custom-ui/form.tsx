import { Slot } from '@radix-ui/react-slot';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import type { VariantProps } from 'class-variance-authority';
import { MapPinIcon, XIcon } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { MarkerDragEvent } from 'react-map-gl/maplibre';
import { Marker } from 'react-map-gl/maplibre';

import { BaseMap } from '@/components/custom-ui/base-map';
import { Spinner } from '@/components/custom-ui/spinner';
import { Button, type buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const field = useFieldContext();
  const id = useId();

  return (
    <div className={cn('relative space-y-2', className)}>
      <Label
        className={cn(field.state.meta.errors.length > 0 && 'text-destructive')}
        htmlFor={`${id}-form-item`}
      >
        {label}
      </Label>
      <Slot
        id={`${id}-form-item`}
        aria-invalid={!!(field.state.meta.errors.length > 0)}
      >
        {children}
      </Slot>
      <p
        id={`${id}-form-item-message`}
        className={cn(
          'text-destructive absolute -translate-y-2 text-[0.8rem] font-medium',
          className,
        )}
      >
        {field.state.meta.errors.length > 0 &&
          (field.state.meta.errors[0] as { message: string }).message}
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

type Location = {
  longitude: number;
  latitude: number;
};

type MapFieldProps = {
  label: string;
  className?: string;
  zoom?: number;
  coordinates?: Location;
};

const DEFAULT_COORDINATES: Location = {
  longitude: 0,
  latitude: 0,
} as const;

function MapField({
  label,
  className,
  zoom = 4,
  coordinates = DEFAULT_COORDINATES,
}: MapFieldProps) {
  const field = useFieldContext<Location>();

  const onMarkerDrag = useCallback(
    (event: MarkerDragEvent) => {
      field.handleChange({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      });
    },
    [field],
  );

  return (
    <BaseField label={label} className={className}>
      <div className='h-[400px] w-full rounded-md border'>
        <BaseMap
          initialViewState={{
            zoom,
            longitude: coordinates.longitude,
            latitude: coordinates.latitude,
          }}
        >
          <Marker
            longitude={field.state.value?.longitude ?? coordinates.longitude}
            latitude={field.state.value?.latitude ?? coordinates.latitude}
            anchor='bottom'
            draggable
            onDrag={onMarkerDrag}
          >
            <MapPinIcon className='text-primary h-8 w-8 -translate-y-full hover:scale-120' />
          </Marker>
        </BaseMap>
      </div>
    </BaseField>
  );
}

type CurrencyFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'value' | 'onChange' | 'onBlur'
> & {
  label: string;
  currency?: string;
  locale?: string;
};

function CurrencyField({
  className,
  label,
  currency = 'NOK',
  locale = 'nb-NO',
  ...props
}: CurrencyFieldProps) {
  const field = useFieldContext<number | null>();
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { decimalSeparator, groupSeparator } = useMemo(() => {
    const parts = new Intl.NumberFormat(locale).formatToParts(1234.5);
    return {
      decimalSeparator: parts.find((p) => p.type === 'decimal')?.value ?? '.',
      groupSeparator: parts.find((p) => p.type === 'group')?.value ?? ',',
    };
  }, [locale]);

  const formatCurrency = useCallback(
    (value: number | null | undefined): string => {
      if (value === null || value === undefined || isNaN(value)) {
        return '';
      }
      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      } catch (error) {
        console.error('Error formatting currency:', error);
        return `${value.toFixed(2)} (Error)`;
      }
    },
    [locale, currency],
  );

  const parseCurrency = useCallback(
    (value: string): number | null => {
      if (typeof value !== 'string' || value.trim() === '') {
        return null;
      }

      const valueWithoutGroupSeparators = value.replaceAll(groupSeparator, '');

      const normalizedValue = valueWithoutGroupSeparators.replace(
        decimalSeparator,
        '.',
      );

      const cleanedValue = normalizedValue.replace(/[^-0-9.]/g, '');

      if (
        cleanedValue === '' ||
        cleanedValue === '-' ||
        cleanedValue === '.' ||
        cleanedValue.split('.').length > 2 ||
        (cleanedValue.includes('-') && !cleanedValue.startsWith('-'))
      ) {
        if (cleanedValue === '-' || cleanedValue === '.') return null;
        return null;
      }

      const numberValue = parseFloat(cleanedValue);

      return isNaN(numberValue) ? null : numberValue;
    },
    [groupSeparator, decimalSeparator],
  );

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      const newValue = formatCurrency(field.state.value);
      requestAnimationFrame(() => {
        setInputValue(newValue);
      });
    }
  }, [field.state.value, formatCurrency]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value;
    setInputValue(rawValue);

    const numericValue = parseCurrency(rawValue);

    if (numericValue !== null || rawValue === '') {
      field.handleChange(numericValue);
    }
  }

  function handleFocus() {
    const numericValue = field.state.value;
    if (numericValue !== null && numericValue !== undefined) {
      const plainNumberString = numericValue
        .toFixed(2)
        .replace('.', decimalSeparator);
      setInputValue(plainNumberString);
    } else {
      setInputValue('');
    }
    requestAnimationFrame(() => {
      inputRef.current?.select();
    });
  }

  function handleBlur() {
    const numericValue = parseCurrency(inputValue);
    field.handleChange(numericValue);
    const formattedValue = formatCurrency(numericValue);
    setInputValue(formattedValue);
    field.handleBlur();
  }

  return (
    <BaseField label={label} className={className}>
      <Input
        ref={inputRef}
        type='text'
        inputMode='decimal'
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={formatCurrency(0)}
        {...props}
      />
    </BaseField>
  );
}

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  className?: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
};

function SelectField({
  label,
  className,
  placeholder = 'Select an option',
  options,
  required = true,
}: SelectFieldProps) {
  const field = useFieldContext<string>();

  return (
    <BaseField label={label} className={className}>
      <div className='flex gap-2'>
        <Select
          value={field.state.value ?? undefined}
          onValueChange={field.handleChange}
          required={required}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!required && field.state.value && (
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={() => field.handleChange('')}
          >
            <XIcon className='h-4 w-4' />
          </Button>
        )}
      </div>
    </BaseField>
  );
}

type SubmitButtonProps = Omit<React.ComponentProps<typeof Button>, 'type'> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

function SubmitButton({
  children,
  className,
  loading,
  ...props
}: SubmitButtonProps) {
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
          disabled={isSubmitting ?? isPristine ?? isValidating ?? loading}
          {...props}
        >
          {isSubmitting || isValidating || loading ? (
            <Spinner size='sm' />
          ) : (
            children
          )}
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
    MapField,
    CurrencyField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

export { useAppForm };
