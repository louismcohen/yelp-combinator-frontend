import { Marker } from 'react-map-gl';
import type { LocationState } from '../hooks/useLocation';

const LocationInnerMarker = () => (
	<div className="w-[24px] h-[24px] flex rounded-full border border-gray-950/15 shadow">
		<div className="w-full h-full bg-blue-500 rounded-full border-gray-50 border-[3px] shadow-md" />
	</div>
);

interface UserLocationMarkerProps {
	userLocation: LocationState;
}

const UserLocationMarker = ({ userLocation }: UserLocationMarkerProps) => {
	if (
		userLocation.loading ||
		userLocation.error ||
		!userLocation.latitude ||
		!userLocation.longitude
	) {
		return null;
	}

	return (
		<Marker latitude={userLocation.latitude} longitude={userLocation.longitude}>
			<div className="pop-in">
				<LocationInnerMarker />
			</div>
		</Marker>
	);
};

export default UserLocationMarker;
