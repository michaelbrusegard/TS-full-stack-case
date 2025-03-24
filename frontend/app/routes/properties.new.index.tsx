import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/properties/new/')({
  component: NewProperty,
});

function NewProperty() {
  return <div>Hello "/properties/new"!</div>;
}
