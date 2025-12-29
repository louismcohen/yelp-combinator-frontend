import { useCallback } from 'react';
import type { MapRef } from 'react-map-gl';
import type { ElementBounds } from '../../../types';
import {
	MARKER_BUFFER_PIXELS,
	MARKER_PAN_ANIMATION_DURATION_MS,
} from '../constants';

interface UseMarkerPanningParams {
	mapboxMapRef: React.RefObject<MapRef>;
}

const calculateHorizontalPanOffset = (
	pointX: number,
	viewportWidth: number,
	bufferPixels: number,
	isTooCloseToLeftEdge: boolean,
	isTooCloseToRightEdge: boolean,
): number => {
	if (isTooCloseToLeftEdge) {
		return bufferPixels - pointX;
	}
	if (isTooCloseToRightEdge) {
		return viewportWidth - bufferPixels - pointX;
	}
	return 0;
};

const calculateVerticalPanOffset = (
	pointY: number,
	windowTop: number,
	bufferPixels: number,
	needsVerticalPan: boolean,
): number => {
	if (needsVerticalPan) {
		const targetMarkerY = windowTop - bufferPixels;
		return pointY - targetMarkerY;
	}
	return 0;
};

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
			const viewportWidth = window.innerWidth;

			// Calculate the vertical bounds of the info window
			// The window's top edge is at (bottom - height), and bottom edge is at bottom
			const windowTop = infoWindowBounds.bottom - infoWindowBounds.height;
			const windowBottom = infoWindowBounds.bottom;

			// Calculate the horizontal bounds of the info window
			const windowLeft = infoWindowBounds.left;
			const windowRight = infoWindowBounds.left + infoWindowBounds.width;

			// Buffer values: vertical is 2x horizontal
			const horizontalBufferPixels = MARKER_BUFFER_PIXELS;
			const verticalBufferPixels = MARKER_BUFFER_PIXELS * 2;

			// Check if marker is within the vertical bounds of the info window
			// Add a small buffer to account for marker size and ensure it's clearly obscured
			const isVerticallyWithinBounds =
				point.y >= windowTop - verticalBufferPixels &&
				point.y <= windowBottom + verticalBufferPixels;

			// Check if marker is within the horizontal bounds of the info window
			const isHorizontallyWithinBounds =
				point.x >= windowLeft - horizontalBufferPixels &&
				point.x <= windowRight + horizontalBufferPixels;

			// Check if marker is too close to left/right screen edges
			const isTooCloseToLeftEdge = point.x < horizontalBufferPixels;
			const isTooCloseToRightEdge =
				point.x > viewportWidth - horizontalBufferPixels;

			// Calculate horizontal pan offset if marker is too close to edges
			const panOffsetX = calculateHorizontalPanOffset(
				point.x,
				viewportWidth,
				horizontalBufferPixels,
				isTooCloseToLeftEdge,
				isTooCloseToRightEdge,
			);

			// Pan if marker is obscured by info window OR too close to screen edges
			const needsVerticalPan =
				isVerticallyWithinBounds && isHorizontallyWithinBounds;
			const needsHorizontalPan = isTooCloseToLeftEdge || isTooCloseToRightEdge;

			if (needsVerticalPan || needsHorizontalPan) {
				// Calculate vertical pan offset if marker is obscured by info window
				const panOffsetPixels = calculateVerticalPanOffset(
					point.y,
					windowTop,
					verticalBufferPixels,
					needsVerticalPan,
				);

				// Get current map center
				const currentCenter = map.getCenter();
				const currentCenterPoint = map.project([
					currentCenter.lng,
					currentCenter.lat,
				]);

				// Calculate new center point by panning both vertically and horizontally
				// To move content up by X pixels, we move the center down by X pixels
				// To move content right by X pixels, we move the center left by X pixels (subtract)
				// To move content left by X pixels, we move the center right by X pixels (add)
				const newCenterPoint: [number, number] = [
					currentCenterPoint.x - panOffsetX,
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
