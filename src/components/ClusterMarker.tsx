import { Marker } from 'react-map-gl';
import { getRandomMarkerDelay } from '../utils';

const ClusterBubble = ({ text }: { text: string | number }) => {
	return (
		<div className="pop-in min-w-[32px] min-h-[32px] p-2 aspect-square grow-0 shrink-0 cursor-pointer flex justify-center items-center rounded-full bg-gradient-to-t from-gray-900 via-gray-900 to-gray-700 border border-neutral-900/50 text-gray-50 text-sm/tight font-bold opacity-[0.97] shadow-[0_3px_5px_rgba(0,0,0,0.33)]">
			<p className="shadow-[0_1px_1px_rgba(0,0,0,1)]">{text}</p>
		</div>
	);
};

interface ClusterMarkerProps {
	points: number;
	latitude: number;
	longitude: number;
	onClick: () => void;
}

export const ClusterMarker = ({
	points,
	latitude,
	longitude,
	onClick,
}: ClusterMarkerProps) => {
	const handleMarkerRef = (marker: mapboxgl.Marker | null) => {
		if (marker) {
			marker
				.getElement()
				.style.setProperty('--delay-time', getRandomMarkerDelay());
		}
	};

	return (
		<Marker
			key={`${latitude}-${longitude}`}
			latitude={latitude}
			longitude={longitude}
			onClick={(e) => {
				e.originalEvent.stopPropagation();
				onClick();
			}}
			ref={handleMarkerRef}
		>
			<ClusterBubble text={points.toLocaleString()} />
		</Marker>
	);
};
