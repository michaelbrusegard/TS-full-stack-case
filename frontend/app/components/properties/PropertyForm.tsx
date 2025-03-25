import type { components } from '@/api/schema';
import { propertyFormSchema } from '@/validation/propertySchema';
import { useMemo } from 'react';
import type { z } from 'zod';

import { useAppForm } from '@/components/custom-ui/form';

type Portfolio = components['schemas']['Portfolio'];

type PortfolioOption = {
  label: string;
  value: string;
};
type PropertyFormValues = z.infer<typeof propertyFormSchema>;

type PropertyFormProps = {
  portfolios: Portfolio[];
  property?: components['schemas']['Property'];
  onSubmit: (values: PropertyFormValues) => void;
};

function PropertyForm({ portfolios, property, onSubmit }: PropertyFormProps) {
  const portfolioOptions = useMemo<PortfolioOption[]>(() => {
    if (!portfolios) return [];

    return portfolios.map((portfolio: Portfolio) => ({
      label: portfolio.name,
      value: String(portfolio.id),
    }));
  }, [portfolios]);

  const form = useAppForm({
    defaultValues: {
      portfolioId: property?.properties?.portfolio ?? 0,
      name: property?.properties?.name ?? '',
      address: property?.properties?.address ?? '',
      zipCode: property?.properties?.zip_code ?? '',
      city: property?.properties?.city ?? '',
      coordinates: property?.geometry?.coordinates
        ? {
            longitude: property.geometry.coordinates[0] ?? 0,
            latitude: property.geometry.coordinates[1] ?? 0,
          }
        : { longitude: 0, latitude: 0 },
      estimatedValue: property?.properties?.estimated_value ?? 0,
      relevantRisks: property?.properties?.relevant_risks ?? 0,
      handledRisks: property?.properties?.handled_risks ?? 0,
      financialRisk: property?.properties?.total_financial_risk ?? 0,
    },
    validators: {
      onChange: propertyFormSchema,
    },
    onSubmit: ({ value }) => {
      return onSubmit(value);
    },
  });
  return (
    <form
      className='space-y-8'
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppForm>
        <form.AppField
          name='name'
          children={(field) => <field.TextField label='Name' />}
        />
        <form.AppField
          name='portfolioId'
          children={(field) => (
            <field.SelectField label='Portfolio' options={portfolioOptions} />
          )}
        />
        <form.AppField
          name='address'
          children={(field) => <field.TextField label='Address' />}
        />
        <form.AppField
          name='zipCode'
          children={(field) => <field.TextField label='Zip Code' />}
        />
        <form.AppField
          name='city'
          children={(field) => <field.TextField label='City' />}
        />
        <form.AppField
          name='coordinates'
          children={(field) => <field.MapField label='Coordinates' />}
        />
        <form.AppField
          name='estimatedValue'
          children={(field) => <field.NumberField label='Estimated value' />}
        />
        <form.AppField
          name='relevantRisks'
          children={(field) => <field.NumberField label='Relevant risks' />}
        />
        <form.AppField
          name='handledRisks'
          children={(field) => <field.NumberField label='Handled risks' />}
        />
        <form.AppField
          name='financialRisk'
          children={(field) => <field.NumberField label='Financial Risk' />}
        />
        <form.SubmitButton>Submit property</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}

export { PropertyForm };
