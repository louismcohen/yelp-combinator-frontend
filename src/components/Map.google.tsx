import {
	Map as GoogleMap,
	MapCameraChangedEvent,
	useMap as useGoogleMap,
} from '@vis.gl/react-google-maps';

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
	lat: 34.04162072763611,
	lng: -118.26326182991187,
};

const DEFAULT_ZOOM = 14;

const mapClassName = 'w-screen h-screen outline-none focus:outline-none';

interface MapScreenProps {
	map: 'google' | 'mapbox';
}

interface GoogleMapScreenProps {
	onBoundsChanged: (e: MapCameraChangedEvent) => void;
	handleMapPress: () => void;
	children: React.ReactNode;
}

const GoogleMapScreen = ({
	onBoundsChanged,
	handleMapPress,
	children,
}: GoogleMapScreenProps) => {
	return (
		<GoogleMap
			className={mapClassName}
			mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
			defaultCenter={DEFAULT_CENTER}
			defaultZoom={DEFAULT_ZOOM}
			onBoundsChanged={onBoundsChanged}
			onClick={handleMapPress}
			gestureHandling="greedy"
			disableDefaultUI
		>
			{children}
		</GoogleMap>
	);
};
