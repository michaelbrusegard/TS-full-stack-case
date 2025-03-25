import { z } from 'zod';

const propertyFormSchema = z.object({
  portfolioId: z.number({
    invalid_type_error: 'Portfolio must be a number',
  }),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(255, 'Address must be less than 255 characters'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{4}$/, 'ZIP code must be 4 digits'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),
  coordinates: z.object(
    {
      longitude: z
        .number({
          required_error: 'Longitude is required',
          invalid_type_error: 'Longitude must be a number',
        })
        .min(-180)
        .max(180),
      latitude: z
        .number({
          required_error: 'Latitude is required',
          invalid_type_error: 'Latitude must be a number',
        })
        .min(-90)
        .max(90),
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
    .min(0, 'Estimated value must be positive'),
  relevantRisks: z
    .number({
      required_error: 'Relevant risks is required',
      invalid_type_error: 'Relevant risks must be a number',
    })
    .min(0, 'Relevant risks must be positive'),
  handledRisks: z
    .number({
      required_error: 'Handled risks is required',
      invalid_type_error: 'Handled risks must be a number',
    })
    .min(0, 'Handled risks must be positive'),
  financialRisk: z
    .number({
      required_error: 'Financial risk is required',
      invalid_type_error: 'Financial risk must be a number',
    })
    .min(0, 'Financial risk must be positive'),
});

export { propertyFormSchema };
