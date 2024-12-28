import {
	AdvancedMarker,
	useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { Marker } from 'react-map-gl';
import { MapService } from '../types';
import { useEffect, useRef } from 'react';
import { getRandomMarkerDelay } from '../utils';

const ClusterBubble = ({ text }: { text: string | number }) => {
	return (
		<div className="pop-in min-w-[32px] min-h-[32px] p-2 aspect-square grow-0 shrink-0 cursor-pointer flex justify-center items-center rounded-full bg-gradient-to-t from-gray-900 via-gray-900 to-gray-700 border border-neutral-900/50 text-gray-50 text-sm/tight font-bold opacity-[0.97] shadow-[0_3px_5px_rgba(0,0,0,0.33)]">
			<p className="shadow-[0_1px_1px_rgba(0,0,0,1)]">{text}</p>
		</div>
	);
};

interface ClusterMarkerProps {
	mapService: MapService;
	points: number;
	latitude: number;
	longitude: number;
	onClick: () => void;
}

const ClusterMarker = ({
	mapService,
	points,
	latitude,
	longitude,
	onClick,
}: ClusterMarkerProps) => {
	if (mapService === MapService.GOOGLE) {
		const [markerRef, marker] = useAdvancedMarkerRef();

		useEffect(() => {
			if (marker) {
				(marker.content as HTMLElement).style.setProperty(
					'--delay-time',
					getRandomMarkerDelay(),
				);
			}
		}, [marker]);

		return (
			<AdvancedMarker
				key={`${latitude}-${longitude}`}
				position={{ lat: latitude, lng: longitude }}
				className="pop-in"
				ref={markerRef}
				onClick={onClick}
			>
				<ClusterBubble text={points.toLocaleString()} />
			</AdvancedMarker>
		);
	} else if (mapService === MapService.MAPBOX) {
		const markerRef = useRef<mapboxgl.Marker>(null);

		useEffect(() => {
			if (markerRef?.current) {
				markerRef.current
					.getElement()
					.style.setProperty('--delay-time', getRandomMarkerDelay());
			}
		}, [markerRef.current]);

		return (
			<Marker
				key={`${latitude}-${longitude}`}
				latitude={latitude}
				longitude={longitude}
				onClick={(e) => {
					e.originalEvent.stopPropagation();
					onClick();
				}}
				ref={markerRef}
			>
				<ClusterBubble text={points.toLocaleString()} />
			</Marker>
		);
	}

	return null;
};

export default ClusterMarker;
