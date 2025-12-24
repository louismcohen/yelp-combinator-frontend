import { useEffect, useRef, useCallback } from 'react';
import type { Map } from '@vis.gl/react-google-maps';
import type { MapRef } from 'react-map-gl';
import type { LocationState } from '../../../hooks/useLocation';
import { MapService } from '../../../types';

const DEFAULT_ZOOM = 13;

interface UseMapInteractionsParams {
	userLocation: LocationState;
	googleMap: Map | null;
	mapboxMapRef: React.RefObject<MapRef>;
	mapService: MapService;
	deselectBusiness: () => void;
	updateSearchInputFocused: (focused: boolean) => void;
}

export const useMapInteractions = ({
	userLocation,
	googleMap,
	mapboxMapRef,
	mapService,
	deselectBusiness,
	updateSearchInputFocused,
}: UseMapInteractionsParams) => {
	const userHasInteracted = useRef(false);

	// Initialize map to user location
	useEffect(() => {
		if (
			!userLocation.loading &&
			userLocation.latitude &&
			userLocation.longitude &&
			!userHasInteracted.current
		) {
			if (mapService === MapService.GOOGLE) {
				if (googleMap) {
					googleMap.panTo({
						lat: userLocation.latitude,
						lng: userLocation.longitude,
					});
					googleMap.setZoom(DEFAULT_ZOOM);
				}
			} else if (mapService === MapService.MAPBOX) {
				if (mapboxMapRef.current) {
					const map = mapboxMapRef.current;
					map.flyTo({
						center: [userLocation.longitude, userLocation.latitude],
						zoom: DEFAULT_ZOOM,
						maxDuration: 1000,
					});
				}
			}
		}
	}, [userLocation, googleMap, mapService, mapboxMapRef]);

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

