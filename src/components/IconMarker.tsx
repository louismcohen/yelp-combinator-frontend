import {
	AdvancedMarker,
	useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { Business, MapProvider } from '../types';
import {
	generateHexColorFromCategoryAlias,
	IconGenerated,
} from '../utils/IconGenerator';
import { motion } from 'motion/react';
import { memo, useCallback, useEffect, useRef } from 'react';
import { Marker } from 'react-map-gl';

const iconFillVisited = `#ffffff`;

interface MarkerProps {
	business: Business;
	onMarkerPress: (marker: Business) => void;
	children: React.ReactNode;
}

const GoogleMarker = ({ business, onMarkerPress, children }: MarkerProps) => {
	const [markerRef, marker] = useAdvancedMarkerRef();

	useEffect(() => {
		if (marker) {
			const delay = (Math.random() * 0.5).toFixed(2) + 's';
			(marker.content as HTMLElement).style.setProperty('--delay-time', delay);
		}
	}, [marker]);

	return (
		<AdvancedMarker
			position={{
				lat: business.coordinates.latitude,
				lng: business.coordinates.longitude,
			}}
			onClick={() => onMarkerPress(business)}
			ref={markerRef}
			className="pop-in"
		>
			{children}
		</AdvancedMarker>
	);
};

const MapboxMarker = ({ business, onMarkerPress, children }: MarkerProps) => {
	const markerRef = useRef<mapboxgl.Marker>(null);

	useEffect(() => {
		if (markerRef?.current) {
			const delay = (Math.random() * 0.5).toFixed(2) + 's';
			markerRef.current.getElement().style.setProperty('--delay-time', delay);
		}
	}, [markerRef.current]);

	return (
		<Marker
			latitude={business.coordinates.latitude}
			longitude={business.coordinates.longitude}
			onClick={() => onMarkerPress(business)}
			ref={markerRef}
		>
			{children}
		</Marker>
	);
};

interface IconMarkerProps {
	mapProvider: MapProvider;
	business: Business;
	onMarkerPress: (marker: Business) => void;
	selected: boolean;
}

const IconMarker = ({
	mapProvider,
	business,
	onMarkerPress,
	selected = false,
}: IconMarkerProps) => {
	const isVisited = business?.visited;
	const primaryCategoryAlias = business.categories[0].alias;
	const iconHexColor = generateHexColorFromCategoryAlias(primaryCategoryAlias);
	const iconColor = isVisited ? iconFillVisited : iconHexColor;
	const backgroundColor = isVisited ? iconHexColor : '#fff';
	const borderColor = isVisited ? 'rgba(255,255,255,0.1)' : iconHexColor;

	const InnerMarker = () => {
		return (
			<motion.div
				className={`w-[32px] h-[32px] flex justify-center items-center rounded-full opacity-[0.97] cursor-pointer`}
				style={{
					backgroundColor,
					borderColor,
					borderWidth: '1px',
					boxShadow: selected
						? `0px 0px 5px 2px ${iconHexColor}80, 0px 3px 5px rgba(0,0,0,0.33)`
						: '0px 3px 5px rgba(0,0,0,0.33)',
				}}
				animate={{
					scale: selected ? 1.25 : 1,
				}}
				transition={{
					type: 'spring',
					visualDuration: 0.15,
				}}
			>
				<IconGenerated
					categoryAlias={primaryCategoryAlias}
					iconProps={{ fill: iconColor }}
				/>
			</motion.div>
		);
	};

	if (mapProvider === MapProvider.Mapbox) {
		return (
			<MapboxMarker business={business} onMarkerPress={onMarkerPress}>
				<InnerMarker />
			</MapboxMarker>
		);
	} else if (mapProvider === MapProvider.Google) {
		return (
			<GoogleMarker business={business} onMarkerPress={onMarkerPress}>
				<InnerMarker />
			</GoogleMarker>
		);
	}
};

const MemoizedIconMarker = memo(IconMarker, (prevProps, nextProps) => {
	return (
		prevProps.selected === nextProps.selected &&
		prevProps.business.visited === nextProps.business.visited
	);
});

export default MemoizedIconMarker;
