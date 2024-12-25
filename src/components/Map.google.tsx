import {
	Map as GoogleMap,
	MapCameraChangedEvent,
	useMap as useGoogleMap,
} from '@vis.gl/react-google-maps';
import React, { forwardRef, memo } from 'react';
import {
	Map as MapboxMap,
	useMap as useMapboxMap,
	MapRef,
	ViewStateChangeEvent,
} from 'react-map-gl';
import { MapService } from '../types';
import mapboxgl, { MapEvent } from 'mapbox-gl';
import { BBox } from 'geojson';

const mapClassName = 'w-screen h-screen outline-none focus:outline-none';

export const panTo = (
	mapProvider: MapService,
	latitude: number,
	longitude: number,
	zoom: number,
) => {
	if (mapProvider === MapService.Google) {
		const map = useGoogleMap();
		if (map) {
			map?.panTo({ lat: latitude, lng: longitude });
			map?.setZoom(zoom);
		}
	} else if (mapProvider === MapService.Mapbox) {
		const { current: map } = useMapboxMap();
		if (map) {
			map.flyTo({
				center: [longitude, latitude],
				zoom,
			});
		}
	}
};

export const getBbox = (map: MapRef): BBox => {
	const bounds = map.getBounds()?.toArray();
	if (bounds) {
		const bbox = bounds[0].concat(bounds[1]);
		return bbox as BBox;
	}
	return [0, 0, 0, 0];
};

export const getMapboxBounds = (
	latitude: number,
	longitude: number,
): google.maps.LatLngBoundsLiteral => {
	const position = new mapboxgl.LngLat(longitude, latitude);
	const positionBounds = position.toBounds();
	console.log({ positionBounds });
	const bounds: google.maps.LatLngBoundsLiteral = {
		east: positionBounds.getEast() as number,
		north: positionBounds.getNorth() as number,
		south: positionBounds.getSouth() as number,
		west: positionBounds.getWest() as number,
	};

	return bounds;
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
					mapStyle="mapbox://styles/mapbox/standard"
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
				>
					{children}
				</MapboxMap>
			</div>
		);
	},
);
