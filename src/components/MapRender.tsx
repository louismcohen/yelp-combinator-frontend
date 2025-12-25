import type { BBox } from 'geojson';
import type { MapEvent } from 'mapbox-gl';
import { forwardRef } from 'react';
import {
	type MapRef,
	Map as MapboxMap,
	type ViewStateChangeEvent,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapClassName = 'w-screen h-svh outline-hidden focus:outline-hidden';

export const getBbox = (map: MapRef): BBox => {
	const bounds = map.getBounds()?.toArray();
	if (bounds) {
		const bbox = bounds[0].concat(bounds[1]);
		return bbox as BBox;
	}
	return [0, 0, 0, 0];
};

interface SharedMapScreenProps {
	defaultCenter: google.maps.LatLngLiteral;
	defaultZoom: number;
	onClick: () => void;
	onMove: () => void;
	children?: React.ReactNode;
}

interface MapboxMapScreenProps extends SharedMapScreenProps {
	onLoad: (m: MapEvent) => void;
	onMoveEnd: (e: ViewStateChangeEvent) => void;
	ref: React.RefObject<MapRef>;
}

export const MapboxMapScreen = forwardRef<MapRef, MapboxMapScreenProps>(
	(
		{
			defaultCenter,
			defaultZoom,
			onClick,
			onLoad,
			onMove,
			onMoveEnd,
			children,
		},
		ref,
	) => {
		return (
			<div className={mapClassName}>
				<MapboxMap
					mapStyle="mapbox://styles/louiscohen/cm54miu4700j201qparty6veb"
					reuseMaps
					mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
					initialViewState={{
						latitude: defaultCenter.lat,
						longitude: defaultCenter.lng,
						zoom: defaultZoom,
					}}
					ref={ref}
					onClick={onClick}
					onMoveStart={onMove}
					onMoveEnd={onMoveEnd}
					onLoad={onLoad}
					style={{
						font: 'inherit',
					}}
				>
					{children}
				</MapboxMap>
			</div>
		);
	},
);
