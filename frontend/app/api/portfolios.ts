import { queryOptions, useMutation } from '@tanstack/react-query';

import { BACKEND_API_URL, getApiUrl } from './getUrl';
import type { components } from './schema';

type Portfolio = components['schemas']['Portfolio'];
type NewPortfolio = Pick<Portfolio, 'name'>;
type UpdatePortfolio = Pick<Portfolio, 'name'>;

function getPortfoliosQueryOptions() {
  return queryOptions<Portfolio[]>({
    queryKey: ['portfolios'],
    queryFn: async () => {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/portfolios/`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<Portfolio[]>;
    },
  });
}

function useCreatePortfolioMutation() {
  return useMutation({
    mutationKey: ['createPortfolio'],
    mutationFn: async (newPortfolio: NewPortfolio) => {
      const response = await fetch(`${BACKEND_API_URL}/api/portfolios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPortfolio),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<Portfolio>;
    },
  });
}

function useUpdatePortfolioMutation() {
  return useMutation({
    mutationKey: ['updatePortfolio'],
    mutationFn: async ({ id, name }: UpdatePortfolio & { id: number }) => {
      const response = await fetch(`${BACKEND_API_URL}/api/portfolios/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<Portfolio>;
    },
  });
}

function useDeletePortfolioMutation() {
  return useMutation({
    mutationKey: ['deletePortfolio'],
    mutationFn: async (id: number) => {
      const response = await fetch(`${BACKEND_API_URL}/api/portfolios/${id}/`, {
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
  getPortfoliosQueryOptions,
  useDeletePortfolioMutation,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
};
