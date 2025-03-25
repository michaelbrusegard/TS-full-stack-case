import type { components } from '@/api/schema';
import { Link } from '@tanstack/react-router';
import { MapPinIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { cn } from '@/lib/utils';

type PropertyCardProps = {
  property: components['schemas']['Property'];
};

function PropertyCard({ property }: PropertyCardProps) {
  if (!property.properties) return null;
  if (
    typeof property.properties.handled_risks === 'undefined' ||
    typeof property.properties.relevant_risks === 'undefined' ||
    typeof property.properties.total_financial_risk === 'undefined' ||
    !property.properties.name ||
    !property.properties.address ||
    !property.properties.zip_code ||
    !property.properties.city
  ) {
    return null;
  }

  const riskRatio =
    property.properties.handled_risks / property.properties.relevant_risks;
  const riskColor =
    riskRatio === 1
      ? 'bg-primary text-primary-foreground'
      : riskRatio >= 0.5
        ? 'bg-accent text-accent-foreground'
        : 'bg-destructive text-destructive-foreground';

  return (
    <Link
      to='/properties/$propertyId'
      params={{ propertyId: String(property.id) }}
      className='block transition-all hover:scale-[1.02] hover:shadow-lg'
    >
      <Card className='hover:border-primary overflow-hidden border-2 transition-colors'>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle className='truncate'>
                {property.properties.name}
              </CardTitle>
              <CardDescription className='text-muted-foreground flex items-center gap-1'>
                <MapPinIcon className='h-3 w-3' />
                <span className='truncate'>
                  {property.properties.address}, {property.properties.zip_code}{' '}
                  {property.properties.city}
                </span>
              </CardDescription>
            </div>
            <Badge variant='secondary' className={cn('shrink-0', riskColor)}>
              {property.properties.handled_risks}/
              {property.properties.relevant_risks}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-1'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>
                Financial Risk in NOK:
              </span>
              <span className='text-primary font-medium'>
                {new Intl.NumberFormat('no-NO', {
                  style: 'currency',
                  currency: 'NOK',
                  maximumFractionDigits: 0,
                }).format(property.properties.total_financial_risk)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export { PropertyCard };
