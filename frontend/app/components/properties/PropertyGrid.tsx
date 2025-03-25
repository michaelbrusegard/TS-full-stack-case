import type { components } from '@/api/schema';

import { PropertyCard } from '@/components/properties/PropertyCard';

type PropertyListProps = {
  properties: components['schemas']['Property'][];
};

function PropertyGrid({ properties }: PropertyListProps) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 min-[72rem]:grid-cols-3'>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

export { PropertyGrid };
