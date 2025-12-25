import type { BBox } from 'geojson';
import { useMemo } from 'react';
import Supercluster from 'supercluster';
import type { Business } from '../../../types';
import { MAX_ZOOM } from '../constants';

interface UseSuperclusterParams {
	filteredMarkers: Business[];
	debouncedBounds: BBox | undefined;
	debouncedZoom: number | undefined;
}

export const useSupercluster = ({
	filteredMarkers,
	debouncedBounds,
	debouncedZoom,
}: UseSuperclusterParams) => {
	const supercluster = useMemo(() => {
		const instance = new Supercluster({
			extent: 512,
			radius: import.meta.env.VITE_SUPERCLUSTER_RADIUS ?? 50,
			maxZoom: MAX_ZOOM - 1,
			minPoints: 2, // Minimum points to form a cluster
		});

		const points = filteredMarkers.map((business) => ({
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [
					business.yelpData?.coordinates.longitude,
					business.yelpData?.coordinates.latitude,
				],
			},
			properties: business,
		})) as Supercluster.PointFeature<Supercluster.AnyProps>[];

		// Load your points into the index
		instance.load(points);

		return instance;
	}, [filteredMarkers]);

	const clusters = useMemo(() => {
		if (!debouncedBounds || !supercluster || !debouncedZoom) return [];

		const clusters = supercluster.getClusters(
			debouncedBounds as BBox,
			Math.floor(debouncedZoom),
		);

		return clusters;
	}, [debouncedBounds, debouncedZoom, supercluster]);

	return { supercluster, clusters };
};
