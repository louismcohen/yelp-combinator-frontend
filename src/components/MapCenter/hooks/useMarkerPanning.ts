import { useCallback } from 'react';
import type { MapRef } from 'react-map-gl';
import type { ElementBounds } from '../../../types';
import {
	MARKER_PAN_ANIMATION_DURATION_MS,
	MAX_MAP_ANIMATION_DURATION_MS,
} from '../constants';

interface UseMarkerPanningParams {
	mapboxMapRef: React.RefObject<MapRef>;
}

export const useMarkerPanning = ({ mapboxMapRef }: UseMarkerPanningParams) => {
	const panToKeepMarkerVisible = useCallback(
		(
			latitude: number,
			longitude: number,
			infoWindowBounds: ElementBounds | null,
		) => {
			if (
				!mapboxMapRef.current ||
				!infoWindowBounds ||
				infoWindowBounds.height === 0
			) {
				return;
			}

			const map = mapboxMapRef.current.getMap();
			if (!map) return;

			// Convert marker coordinates to pixel coordinates
			const point = map.project([longitude, latitude]);

			// Get viewport dimensions
			const viewportHeight = window.innerHeight;

			// Calculate the vertical bounds of the info window
			// The window's top edge is at (bottom - height), and bottom edge is at bottom
			const windowTop = infoWindowBounds.bottom - infoWindowBounds.height;
			const windowBottom = infoWindowBounds.bottom;

			// Calculate the horizontal bounds of the info window
			const windowLeft = infoWindowBounds.left;
			const windowRight = infoWindowBounds.left + infoWindowBounds.width;

			// Check if marker is within the vertical bounds of the info window
			// Add a small buffer to account for marker size and ensure it's clearly obscured
			const bufferPixels = 50;
			const isVerticallyWithinBounds =
				point.y >= windowTop - bufferPixels &&
				point.y <= windowBottom + bufferPixels;

			// Check if marker is within the horizontal bounds of the info window
			const isHorizontallyWithinBounds =
				point.x >= windowLeft - bufferPixels &&
				point.x <= windowRight + bufferPixels;

			// Only pan if marker is within BOTH vertical AND horizontal bounds of the window
			if (isVerticallyWithinBounds && isHorizontallyWithinBounds) {
				// Calculate target position: move marker above the window with buffer
				const targetMarkerY = windowTop - bufferPixels;
				// Marker would be obscured, calculate how much we need to pan
				// To move marker up on screen, we need to pan the map down (move map content up)
				const panOffsetPixels = point.y - targetMarkerY;

				// Get current map center
				const currentCenter = map.getCenter();
				const currentCenterPoint = map.project([
					currentCenter.lng,
					currentCenter.lat,
				]);

				// Calculate new center point by panning down (moving map up)
				// To move content up by X pixels, we move the center down by X pixels
				const newCenterPoint: [number, number] = [
					currentCenterPoint.x,
					currentCenterPoint.y + panOffsetPixels,
				];

				// Convert the new center point back to lat/lng
				const newCenter = map.unproject(newCenterPoint);

				// Pan the map to keep marker visible
				mapboxMapRef.current.flyTo({
					center: [newCenter.lng, newCenter.lat],
					duration: MARKER_PAN_ANIMATION_DURATION_MS,
				});
			}
		},
		[mapboxMapRef],
	);

	return panToKeepMarkerVisible;
};
