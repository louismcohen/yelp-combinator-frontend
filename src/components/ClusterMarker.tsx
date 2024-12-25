import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Marker } from 'react-map-gl';
import { MapService } from '../types';

const ClusterBubble = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-[32px] h-[32px] flex justify-center items-center rounded-full bg-gradient-to-t from-gray-900 via-gray-900 to-gray-700 border border-neutral-900/50 text-gray-50 text-sm/tight font-bold opacity-[0.97] shadow-[0_3px_5px_rgba(0,0,0,0.33)]">
			{children}
		</div>
	);
};

interface ClusterMarkerProps {
	mapService: MapService;
	points: number;
	position: google.maps.LatLngLiteral;
	onClick: () => void;
}

const ClusterMarker = ({
	mapService,
	points,
	position,
	onClick,
}: ClusterMarkerProps) => {
	console.log('cluster marker', points, position);
	if (mapService === MapService.Google) {
		return (
			<AdvancedMarker position={position} className="pop-in" onClick={onClick}>
				<ClusterBubble>{points}</ClusterBubble>
			</AdvancedMarker>
		);
	} else if (mapService === MapService.Mapbox) {
		return (
			<Marker
				className="pop-in"
				latitude={position.lat}
				longitude={position.lng}
				onClick={onClick}
			>
				<ClusterBubble>{points}</ClusterBubble>
			</Marker>
		);
	}

	return null;
};

export default ClusterMarker;
