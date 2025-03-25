import Map, { type MapProps, NavigationControl } from 'react-map-gl/maplibre';

import { useTheme } from '@/components/layout/ThemeProvider';

interface BaseMapProps extends Omit<MapProps, 'mapStyle'> {
  children?: React.ReactNode;
}

function BaseMap({ children, ...props }: BaseMapProps) {
  const { resolvedTheme } = useTheme();

  const mapStyle =
    resolvedTheme === 'dark'
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

  return (
    <Map mapStyle={mapStyle} {...props}>
      <NavigationControl position='bottom-right' />
      {children}
    </Map>
  );
}

export { BaseMap };
