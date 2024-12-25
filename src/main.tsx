import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { APIProvider } from '@vis.gl/react-google-maps';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchFilterProvider } from './contexts/searchFilterContext.tsx';
import MapCenter from './components/MapCenter.tsx';
import { MapService } from './types/index.ts';
import { MapProvider } from 'react-map-gl';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

const MAP_PROVIDER = MapService.Mapbox as MapService;

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
	if (MAP_PROVIDER === MapService.Google) {
		return (
			<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
				{children}
			</APIProvider>
		);
	} else if (MAP_PROVIDER === MapService.Mapbox) {
		return <MapProvider>{children}</MapProvider>;
	}

	return null;
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<MapContextProvider>
				<SearchFilterProvider>
					<MapCenter mapService={MAP_PROVIDER} />
				</SearchFilterProvider>
			</MapContextProvider>
		</QueryClientProvider>
	</StrictMode>,
);
