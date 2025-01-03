import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { APIProvider } from '@vis.gl/react-google-maps';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const MAP_SERVICE =
	(import.meta.env.VITE_MAP_SERVICE as MapService) || MapService.MAPBOX;

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
	if (MAP_SERVICE === MapService.GOOGLE) {
		return (
			<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
				{children}
			</APIProvider>
		);
	} else if (MAP_SERVICE === MapService.MAPBOX) {
		return <MapProvider>{children}</MapProvider>;
	}

	return null;
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<MapContextProvider>
				<MapCenter mapService={MAP_SERVICE} />
			</MapContextProvider>
		</QueryClientProvider>
	</StrictMode>,
);
