import { motion } from 'motion/react';
import { memo, useEffect } from 'react';
import { Marker } from 'react-map-gl';
import type { Business } from '../../types';
import { getRandomMarkerDelay } from '../../utils';
import {
	IconGenerated,
	generateHexColorFromCategoryAlias,
} from '../../utils/IconGenerator';

const iconFillVisited = '#ffffff';

interface MapMarkerProps {
	business: Business;
	onMarkerPress: (marker: Business) => void;
	children: React.ReactNode;
}

export const MapboxMarker = ({
	business,
	onMarkerPress,
	children,
}: MapMarkerProps) => {
	if (!business.yelpData) return null;

	const handleMarkerRef = (marker: mapboxgl.Marker | null) => {
		if (marker) {
			marker
				.getElement()
				.style.setProperty('--delay-time', getRandomMarkerDelay());
		}
	};

	return (
		<Marker
			latitude={business.yelpData.coordinates.latitude}
			longitude={business.yelpData.coordinates.longitude}
			onClick={(e) => {
				e.originalEvent.stopPropagation();
				onMarkerPress(business);
			}}
			ref={handleMarkerRef}
		>
			<div className="pop-in">{children}</div>
		</Marker>
	);
};

interface IconMapMarkerProps {
	business: Business;
	onMarkerPress: (marker: Business) => void;
	selected: boolean;
}

const IconMarkerComponent = ({
	business,
	onMarkerPress,
	selected = false,
}: IconMapMarkerProps) => {
	if (!business.yelpData) return null;

	const isVisited = business?.visited;
	const primaryCategoryAlias = business.yelpData.categories[0].alias;
	const iconHexColor = generateHexColorFromCategoryAlias(primaryCategoryAlias);
	const iconColor = isVisited ? iconFillVisited : iconHexColor;
	const backgroundColor = isVisited ? `${iconHexColor}F2` : '';
	const backgroundHighlight =
		!isVisited &&
		'bg-gradient-to-t from-neutral-200/95 via-neutral-200/95 to-neutral-50/95';
	const borderColor = isVisited ? 'rgba(255,255,255,0.1)' : iconHexColor;
	const highlightGradient = isVisited
		? 'from-transparent via-transparent to-neutral-50/20'
		: '';

	const markerContent = (
		<motion.div
			className={`w-[32px] h-[32px] flex justify-center items-center rounded-full backdrop-blur-md ${backgroundHighlight} cursor-pointer overflow-hidden`}
			style={{
				backgroundColor,
				borderColor,
				borderWidth: '1px',
				boxShadow: selected
					? `0px 0px 5px 2px ${iconHexColor}60, 0px 3px 5px rgba(0,0,0,0.33)`
					: '0px 3px 5px rgba(0,0,0,0.33)',
			}}
			animate={{
				scale: selected ? 1.25 : 1,
			}}
			transition={{
				type: 'spring',
				visualDuration: selected ? 0.2 : 0.15,
				bounce: selected ? 0.5 : 0.55,
			}}
		>
			<div
				className={`w-full h-full rounded-full bg-gradient-to-t ${highlightGradient}`}
			>
				<IconGenerated
					categoryAlias={primaryCategoryAlias}
					iconProps={{ fill: iconColor }}
				/>
			</div>
		</motion.div>
	);

	return (
		<MapboxMarker business={business} onMarkerPress={onMarkerPress}>
			{markerContent}
		</MapboxMarker>
	);
};

export const IconMarker = memo(IconMarkerComponent, (prevProps, nextProps) => {
	return (
		prevProps.selected === nextProps.selected &&
		prevProps.business.visited === nextProps.business.visited
	);
});
