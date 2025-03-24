import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_sidebar/$portfolioId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_portfolioLayout/$portfolioId"!</div>
}
