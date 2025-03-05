import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { LocationState } from '../hooks/useLocation';
import { MapService } from '../types';
import { Marker } from 'react-map-gl';

const LocationInnerMarker = () => (
	<div className="w-[24px] h-[24px] flex rounded-full border border-gray-950/15 shadow">
		<div className="w-full h-full bg-blue-500 rounded-full border-gray-50 border-[3px] shadow-md" />
	</div>
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
