import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import GoogleMap from './GoogleMap.tsx';
import { APIProvider } from '@vis.gl/react-google-maps';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchFilterProvider } from './contexts/searchFilterContext.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
				<SearchFilterProvider>
					<GoogleMap />
				</SearchFilterProvider>
			</APIProvider>
		</QueryClientProvider>
	</StrictMode>,
);
