import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Business } from '../types';
import {
	generateHexColorFromCategoryAlias,
	IconGenerated,
} from '../utils/IconGenerator';
import { motion } from 'motion/react';

const iconFillVisited = `#ffffff`;

interface IconMarkerProps {
	business: Business;
	onMarkerPress: (marker: Business) => void;
	selected: boolean;
}

const IconMarker = ({
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

	return (
		<AdvancedMarker
			position={{
				lat: business.coordinates.latitude,
				lng: business.coordinates.longitude,
			}}
			onClick={() => onMarkerPress(business)}
		>
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
		</AdvancedMarker>
	);
};

export default IconMarker;
