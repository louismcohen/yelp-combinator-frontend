import React, { useMemo } from 'react';
import type Supercluster from 'supercluster';
import type { Business } from '../../../types';
import { ClusterMarker } from '../../ClusterMarker';
import { IconMarker } from '../../IconMarker';

interface MapMarkersProps {
	clusters: (
		| Supercluster.ClusterFeature<Supercluster.AnyProps>
		| Supercluster.PointFeature<Supercluster.AnyProps>
	)[];
	selectedBusiness: Business | undefined;
	handleClusterClick: (
		cluster: Supercluster.ClusterFeature<Supercluster.AnyProps>,
	) => void;
	handleMarkerPress: (marker: Business) => void;
}

export const MapMarkers = ({
	clusters,
	selectedBusiness,
	handleClusterClick,
	handleMarkerPress,
}: MapMarkersProps) => {
	const renderMarkers = useMemo(() => {
		return clusters.map((cluster) => {
			const [longitude, latitude] = cluster.geometry.coordinates;
			const { cluster: isCluster, point_count: pointCount } =
				cluster.properties;

			if (isCluster) {
				return (
					<ClusterMarker
						key={cluster.id}
						latitude={latitude}
						longitude={longitude}
						points={pointCount}
						onClick={() =>
							'cluster' in cluster.properties &&
							handleClusterClick(
								cluster as Supercluster.ClusterFeature<Supercluster.AnyProps>,
							)
						}
					/>
				);
			}

			const marker = cluster.properties as Business;
			return (
				<IconMarker
					key={marker.alias}
					business={marker}
					selected={selectedBusiness?.alias === marker.alias}
					onMarkerPress={handleMarkerPress}
				/>
			);
		});
	}, [clusters, selectedBusiness, handleClusterClick, handleMarkerPress]);

	return <>{renderMarkers}</>;
};
