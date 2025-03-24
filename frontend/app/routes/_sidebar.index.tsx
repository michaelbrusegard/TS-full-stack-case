import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_sidebar/')({
  component: Home,
});

function Home() {
  return <div>Overview of properties</div>;
}
