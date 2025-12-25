import { useCallback } from 'react';
import type { MapRef } from 'react-map-gl';
import type Supercluster from 'supercluster';
import { MAX_ZOOM } from '../constants';

interface UseClusterClickParams {
	mapboxMapRef: React.RefObject<MapRef>;
	supercluster: Supercluster<Supercluster.AnyProps, Supercluster.AnyProps>;
}

export const useClusterClick = ({
	mapboxMapRef,
	supercluster,
}: UseClusterClickParams) => {
	const handleClusterClick = useCallback(
		(cluster: Supercluster.ClusterFeature<Supercluster.AnyProps>) => {
			const [longitude, latitude] = cluster.geometry.coordinates;

			// Get the base cluster expansion zoom
			const baseExpansionZoom = supercluster.getClusterExpansionZoom(
				cluster.properties.cluster_id,
			);

			// Get cluster point count to determine zoom aggressiveness
			const pointCount = cluster.properties.point_count || 0;

			// Add zoom offset based on cluster size:
			// - Small clusters (< 10 points): +1 zoom level
			// - Medium clusters (10-50 points): +2 zoom levels
			// - Large clusters (> 50 points): +3 zoom levels
			const zoomOffset = pointCount > 10 ? 3 : pointCount > 5 ? 2 : 1;

			// Calculate final zoom level, ensuring it doesn't exceed maxZoom
			const maxZoom = MAX_ZOOM + 0.5;
			const expansionZoom = Math.min(baseExpansionZoom + zoomOffset, maxZoom);

			if (mapboxMapRef.current) {
				const map = mapboxMapRef.current;
				map.flyTo({
					center: [longitude, latitude],
					zoom: expansionZoom,
				});
			}
		},
		[supercluster, mapboxMapRef],
	);

	return handleClusterClick;
};
