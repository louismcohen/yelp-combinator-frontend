import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { LocationState } from '../hooks/useLocation';
import { MapService } from '../types';
import { Marker } from 'react-map-gl';

const LocationInnerMarker = () => (
	<div className="w-[20px] h-[20px] bg-blue-500 rounded-full border-2 border-gray-50 drop-shadow-md" />
);

interface UserLocationMarkerProps {
	mapService: MapService;
	userLocation: LocationState;
}

const UserLocationMarker = ({
	mapService,
	userLocation,
}: UserLocationMarkerProps) => {
	if (
		userLocation.loading ||
		userLocation.error ||
		!userLocation.latitude ||
		!userLocation.longitude
	) {
		return null;
	}

	if (mapService === MapService.GOOGLE) {
		return (
			<AdvancedMarker
				className="pop-in"
				position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
			>
				<LocationInnerMarker />
			</AdvancedMarker>
		);
	} else if (mapService === MapService.MAPBOX) {
		return (
			<Marker
				latitude={userLocation.latitude}
				longitude={userLocation.longitude}
			>
				<div className="pop-in">
					<LocationInnerMarker />
				</div>
			</Marker>
		);
	}

	return null;
};

export default UserLocationMarker;
