import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MapProvider } from 'react-map-gl';
import MapCenter from './components/MapCenter/index.tsx';
import { MapService } from './types/index.ts';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			// gcTime: 1000 * 60 * 60 * 24, // 24 hours
		},
	},
});

// const persister = createSyncStoragePersister({
// 	storage: window.localStorage,
// });

// persistQueryClient({
// 	queryClient,
// 	persister,
// 	maxAge: 1000 * 60 * 60 * 24,
// 	buster: 'bust-yelp-cache',
// });

const MAP_SERVICE =
	(import.meta.env.VITE_MAP_SERVICE as MapService) || MapService.MAPBOX;

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
	if (MAP_SERVICE === MapService.GOOGLE) {
		return (
			<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
				{children}
			</APIProvider>
		);
	}

	return <MapProvider>{children}</MapProvider>;
};

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<MapContextProvider>
				<MapCenter mapService={MAP_SERVICE} />
			</MapContextProvider>
		</QueryClientProvider>
	</StrictMode>,
);
