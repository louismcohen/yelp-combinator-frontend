import type { Marker } from 'mapbox-gl';
import { useEffect } from 'react';
import { getRandomMarkerDelay } from '../utils';

const useRandomMarkerDelay = (
	marker: Marker | google.maps.marker.AdvancedMarkerElement,
) => {
	useEffect(() => {
		if (!marker) return;

		const mapboxMapMarker = marker as Marker;
		if (mapboxMapMarker) {
			mapboxMapMarker
				.getElement()
				.style.setProperty('--delay-time', getRandomMarkerDelay());
		}
	}, [marker]);
};

export default useRandomMarkerDelay;
