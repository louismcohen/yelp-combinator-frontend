import { useCallback, useEffect, useRef } from 'react';
import type { MapRef } from 'react-map-gl';
import type { LocationState } from '../../../hooks/useLocation';

const DEFAULT_ZOOM = 13;

interface UseMapInteractionsParams {
	userLocation: LocationState;
	mapboxMapRef: React.RefObject<MapRef>;
	deselectBusiness: () => void;
	updateSearchInputFocused: (focused: boolean) => void;
}

export const useMapInteractions = ({
	userLocation,
	mapboxMapRef,
	deselectBusiness,
	updateSearchInputFocused,
}: UseMapInteractionsParams) => {
	const userHasInteracted = useRef(false);

	// Initialize map to user location
	useEffect(() => {
		if (
			mapboxMapRef.current &&
			userLocation.latitude &&
			userLocation.longitude
		) {
			const map = mapboxMapRef.current;
			map.flyTo({
				center: [userLocation.longitude, userLocation.latitude],
				zoom: DEFAULT_ZOOM,
				maxDuration: 1000,
			});
		}
	}, [userLocation, mapboxMapRef]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				deselectBusiness();
				updateSearchInputFocused(false);
			} else if (e.metaKey && (e.key === 'k' || e.key === '/')) {
				updateSearchInputFocused(true);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [deselectBusiness, updateSearchInputFocused]);

	const handleMapPress = useCallback(() => {
		deselectBusiness();
		updateSearchInputFocused(false);
	}, [deselectBusiness, updateSearchInputFocused]);

	const handleMapInitialInteraction = useCallback(() => {
		userHasInteracted.current = true;
	}, []);

	return {
		handleMapPress,
		handleMapInitialInteraction,
	};
};
