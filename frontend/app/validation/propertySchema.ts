import { z } from 'zod';

const propertyFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .transform((str) => str.charAt(0).toUpperCase() + str.slice(1)),
  portfolioId: z.string({
    invalid_type_error: 'Portfolio must be a string',
  }),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(255, 'Address must be less than 255 characters')
    .trim()
    .transform((str) => str.charAt(0).toUpperCase() + str.slice(1)),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{4}$/, 'ZIP code must be 4 digits'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters')
    .trim(),
  coordinates: z.object(
    {
      longitude: z
        .number({
          required_error: 'Longitude is required',
          invalid_type_error: 'Longitude must be a number',
        })
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .finite('Longitude must be a finite number'),
      latitude: z
        .number({
          required_error: 'Latitude is required',
          invalid_type_error: 'Latitude must be a number',
        })
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .finite('Latitude must be a finite number'),
    },
    {
      required_error: 'Coordinates are required',
    },
  ),
  estimatedValue: z
    .number({
      required_error: 'Estimated value is required',
      invalid_type_error: 'Estimated value must be a number',
    })
    .min(0, 'Estimated value must be positive')
    .max(1000000000, 'Estimated value seems unreasonably high')
    .finite('Estimated value must be a finite number'),
  relevantRisks: z
    .number({
      required_error: 'Relevant risks is required',
      invalid_type_error: 'Relevant risks must be a number',
    })
    .min(0, 'Relevant risks must be positive')
    .max(1000, 'Number of relevant risks seems unreasonably high')
    .int('Relevant risks must be a whole number'),
  handledRisks: z
    .number({
      required_error: 'Handled risks is required',
      invalid_type_error: 'Handled risks must be a number',
    })
    .min(0, 'Handled risks must be positive')
    .max(1000, 'Number of handled risks seems unreasonably high')
    .int('Handled risks must be a whole number'),
  financialRisk: z
    .number({
      required_error: 'Financial risk is required',
      invalid_type_error: 'Financial risk must be a number',
    })
    .min(0, 'Financial risk must be positive')
    .max(1000000000, 'Financial risk must be between 0 and 1000000000')
    .finite('Financial risk must be a finite number'),
});

export { propertyFormSchema };
