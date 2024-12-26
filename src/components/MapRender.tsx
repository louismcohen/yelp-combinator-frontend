import {
	Map as GoogleMap,
	MapCameraChangedEvent,
	useMap as useGoogleMap,
} from '@vis.gl/react-google-maps';
import React, { forwardRef } from 'react';
import { Map as MapboxMap, MapRef, ViewStateChangeEvent } from 'react-map-gl';
import { MapEvent } from 'mapbox-gl';
import { BBox } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapClassName = 'w-screen h-screen outline-none focus:outline-none';

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
	handleMapPress: () => void;
	children: React.ReactNode;
}

interface GoogleMapScreenProps extends SharedMapScreenProps {
	onBoundsChanged: (e: MapCameraChangedEvent) => void;
}

interface MapboxMapScreenProps extends SharedMapScreenProps {
	onLoad: (m: MapEvent) => void;
	onMoveEnd: (e: ViewStateChangeEvent) => void;
	ref: React.RefObject<MapRef>;
}

export const GoogleMapScreen = React.memo(
	({
		defaultCenter,
		defaultZoom,
		onBoundsChanged,
		handleMapPress,
		children,
	}: GoogleMapScreenProps) => {
		const map = useGoogleMap();

		map?.setClickableIcons(false);

		return (
			<GoogleMap
				className={mapClassName}
				mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
				defaultCenter={defaultCenter}
				defaultZoom={defaultZoom}
				onBoundsChanged={onBoundsChanged}
				onClick={handleMapPress}
				gestureHandling="greedy"
				disableDefaultUI
			>
				{children}
			</GoogleMap>
		);
	},
);

export const MapboxMapScreen = forwardRef<MapRef, MapboxMapScreenProps>(
	(
		{ defaultCenter, defaultZoom, handleMapPress, onLoad, onMoveEnd, children },
		ref,
	) => {
		return (
			<div className={mapClassName}>
				<MapboxMap
					mapStyle="mapbox://styles/louiscohen/cm54miu4700j201qparty6veb"
					mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
					initialViewState={{
						latitude: defaultCenter.lat,
						longitude: defaultCenter.lng,
						zoom: defaultZoom,
					}}
					ref={ref}
					onClick={handleMapPress}
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
