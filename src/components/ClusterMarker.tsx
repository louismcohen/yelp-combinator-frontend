import {
	AdvancedMarker,
	useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { Business } from '../types';

interface ClusterMarkerProps {
	points: number;
	position: google.maps.LatLngLiteral;
	onClick: () => void;
}

const ClusterMarker = ({ points, position, onClick }: ClusterMarkerProps) => {
	const [markerRef] = useAdvancedMarkerRef();

	return (
		<AdvancedMarker
			position={position}
			ref={markerRef}
			className="pop-in"
			onClick={onClick}
		>
			<div className="w-[32px] h-[32px] flex justify-center items-center rounded-full bg-gradient-to-t from-gray-900 via-gray-900 to-gray-700 border border-neutral-900/50 text-gray-50 text-sm/tight font-bold opacity-[0.97] shadow-[0_3px_5px_rgba(0,0,0,0.33)]">
				{points}
			</div>
		</AdvancedMarker>
	);
};

export default ClusterMarker;
