import { useEffect } from 'react';
import { randomMarkerDelay } from '../utils';
import { MapService } from '../types';
import { Marker } from 'mapbox-gl';

const useRandomMarkerDelay = (
	mapService: MapService,
	marker: Marker | google.maps.marker.AdvancedMarkerElement,
) => {
	useEffect(() => {
		if (!marker) return;

		if (mapService === MapService.GOOGLE) {
			const googleMapMarker =
				marker as google.maps.marker.AdvancedMarkerElement;
			if (googleMapMarker) {
				(googleMapMarker.content as HTMLElement).style.setProperty(
					'--delay-time',
					randomMarkerDelay,
				);
			}
		} else if (mapService === MapService.MAPBOX) {
			const mapboxMapMarker = marker as Marker;
			if (mapboxMapMarker) {
				mapboxMapMarker
					.getElement()
					.style.setProperty('--delay-time', randomMarkerDelay);
			}
		}
	}, [marker]);
};

export default useRandomMarkerDelay;
