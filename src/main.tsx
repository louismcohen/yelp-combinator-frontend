import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { MapProvider } from 'react-map-gl';
import MapCenter from './components/MapCenter/index.tsx';

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

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<MapProvider>
				<MapCenter />
			</MapProvider>
		</QueryClientProvider>
	</StrictMode>,
);
