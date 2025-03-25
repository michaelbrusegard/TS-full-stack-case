import { getPortfoliosQueryOptions } from '@/api/portfolios';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/properties/new/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getPortfoliosQueryOptions()),
  component: NewProperty,
});

function NewProperty() {
  return <div>Hello "/properties/new"!</div>;
}
