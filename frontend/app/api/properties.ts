import { queryOptions, useMutation } from '@tanstack/react-query';

import type { components } from './schema';

type Property = components['schemas']['Property'];
type PaginatedPropertyList = components['schemas']['PaginatedPropertyList'];

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? 'http://localhost:8000';

function getPropertyByIdQueryOptions(id: number) {
  return queryOptions<Property>({
    queryKey: ['properties', id],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_API_URL}/api/properties/${id}/`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<Property>;
    },
  });
}

function getPropertiesByBboxQueryOptions(
  bbox: [number, number, number, number],
) {
  return queryOptions<PaginatedPropertyList>({
    queryKey: ['properties', 'bbox', bbox],
    queryFn: async () => {
      const bboxString = bbox.join(',');
      const response = await fetch(
        `${BACKEND_API_URL}/api/properties/?in_bbox=${bboxString}`,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<PaginatedPropertyList>;
    },
  });
}

function getPropertiesByPortfolioQueryOptions(
  portfolioId: number,
  page?: number,
  pageSize?: number,
) {
  return queryOptions<PaginatedPropertyList>({
    queryKey: ['properties', 'portfolio', portfolioId, { page, pageSize }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('portfolio', portfolioId.toString());
      if (page) params.append('page', page.toString());
      if (pageSize) params.append('page_size', pageSize.toString());

      const response = await fetch(
        `${BACKEND_API_URL}/api/properties/?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<PaginatedPropertyList>;
    },
  });
}

function useCreatePropertyMutation() {
  return useMutation({
    mutationKey: ['createProperty'],
    mutationFn: async (newProperty: Property) => {
      const response = await fetch(`${BACKEND_API_URL}/api/properties/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProperty),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<Property>;
    },
  });
}

function useUpdatePropertyMutation() {
  return useMutation({
    mutationKey: ['updateProperty'],
    mutationFn: async ({ id, ...property }: Property & { id: number }) => {
      const response = await fetch(`${BACKEND_API_URL}/api/properties/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<Property>;
    },
  });
}

function useDeletePropertyMutation() {
  return useMutation({
    mutationKey: ['deleteProperty'],
    mutationFn: async (id: number) => {
      const response = await fetch(`${BACKEND_API_URL}/api/properties/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return true;
    },
  });
}

export {
  getPropertyByIdQueryOptions,
  getPropertiesByBboxQueryOptions,
  getPropertiesByPortfolioQueryOptions,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
};
