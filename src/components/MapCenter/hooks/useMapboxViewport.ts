import { useCallback } from 'react';
import type { MapRef } from 'react-map-gl';
import { useMapStore } from '../../../store/mapStore';

export const useMapboxViewport = () => {
	const { updateViewport } = useMapStore();

	const checkAndUpdateViewport = useCallback(
		(mapRef: MapRef) => {
			if (mapRef) {
				const southwest = mapRef.getBounds()?.getSouthWest().toArray();
				const northeast = mapRef.getBounds()?.getNorthEast().toArray();
				if (southwest && northeast) {
					updateViewport({ southwest, northeast });
				}
			}
		},
		[updateViewport],
	);

	return checkAndUpdateViewport;
};

